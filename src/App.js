import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { encodeHamming, decodeHamming } from './hammingCode';
import './App.css'; // Asegúrate de crear este archivo para los estilos
import HammingDistanceVisualizer from './components/HammingDistanceVisualizer';
import { generateHammingExamples, analyzeHammingDistance } from './hammingCode';

// Función auxiliar para verificar si un número es potencia de 2
function isPowerOfTwo(n) {
    return Math.log2(n) % 1 === 0;
}

function App() {
    const [data, setData] = useState('');
    const [result, setResult] = useState('');
    const [parityTable, setParityTable] = useState([]);
    const [errorDetails, setErrorDetails] = useState(null);
    const [simulationSteps, setSimulationSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isInputValid, setIsInputValid] = useState(true);
    const [action, setAction] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    const [hammingExamples, setHammingExamples] = useState(null);
    const [selectedExample, setSelectedExample] = useState(null);
    const [hammingAnalysis, setHammingAnalysis] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [hammingDistance, setHammingDistance] = useState(null);

    useEffect(() => {
        setIsInputValid(/^[01]*$/.test(data));
    }, [data]);

    const handleEncode = () => {
        setAction('encode');
        try {
            const response = encodeHamming(data);
            setResult(response.encodedData);
            setParityTable(response.parityTable);
            setHammingDistance(response.hammingDistance);
            setSimulationSteps(response.simulationSteps);
            setCurrentStepIndex(0);
            setIsSimulating(true);
            setErrorDetails(null);

            // Generar ejemplos de distancia Hamming
            const examples = generateHammingExamples(data);
            setHammingExamples(examples);
            setSelectedExample(null);
            setHammingAnalysis(null);
        } catch (error) {
            console.error('Error al codificar:', error);
        }
    };

    const handleDecode = () => {
        setAction('decode');
        try {
            const response = decodeHamming(data);
            setResult('');
            setParityTable(response.parityTable);
            setSimulationSteps(response.simulationSteps);
            setCurrentStepIndex(0);
            setIsSimulating(true);
            setErrorDetails(response.errorDetails);
            setHammingExamples(null);
            setSelectedExample(null);
            setHammingAnalysis(null);
            setHammingDistance(null);
        } catch (error) {
            console.error('Error al decodificar:', error);
        }
    };

    const handleNextStep = () => {
        if (currentStepIndex < simulationSteps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    const handleExampleSelect = (example) => {
        setSelectedExample(example);
        if (hammingExamples) {
            const analysis = analyzeHammingDistance(
                hammingExamples.originalSequence,
                example.sequence
            );
            setHammingAnalysis(analysis);
        }
    };

    const renderBitCell = (bit, index, currentStep) => {
        const totalBits = simulationSteps[currentStepIndex]?.bits.length;
        const position = totalBits - index;  // posición real en el código Hamming
        
        // Un bit es de paridad si su posición es potencia de 2
        const isParityPosition = isPowerOfTwo(position);
        
        let cellClass = 'bit-cell';
        
        // Solo resaltar en verde si:
        // 1. Está en highlightPositions
        // 2. Es paso de colocación de datos (type === 'data')
        // 3. NO es posición de paridad
        if (currentStep?.highlightPositions?.includes(totalBits - position) && 
            currentStep.type === 'data' && 
            !isParityPosition) {
            cellClass += ' highlighted data-bit';
        }
        
        // Marcar las posiciones de paridad
        if (isParityPosition) {
            cellClass += ' parity-position';
        }

        return (
            <div key={index} className={cellClass}>
                <div className="bit-value">{bit !== null ? bit : '_'}</div>
                <div className="bit-position">{position}</div>
            </div>
        );
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        // Solo permite 0s y 1s
        if (value === '' || /^[0-1]+$/.test(value)) {
            setData(value);
            setIsInputValid(true);
        } else {
            setIsInputValid(false);
        }
    };

    const validateInput = () => {
        if (data.length === 0) {
            return "Debe ingresar datos binarios";
        }
        if (!/^[0-1]+$/.test(data)) {
            return "Solo se permiten valores binarios (0 y 1)";
        }
        if (data.length < 4) {
            return "Debe ingresar al menos 4 bits";
        }
        return "";
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Simulador de Código Hamming</h1>
            <h2 className="text-center mb-4">José Eugenio Navarro Bovi</h2>
            <h3 className="text-center mb-4">Legajo: 50027 - 3k3</h3>
            
            {/* Entrada de datos */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="input-group">
                        <input
                            type="text"
                            className={`form-control ${!isInputValid ? 'is-invalid' : ''}`}
                            placeholder="Ingrese datos binarios (0 y 1)"
                            value={data}
                            onChange={handleInputChange}
                        />
                        <button 
                            className="btn btn-success mx-2"
                            onClick={handleEncode}
                            disabled={!isInputValid || !data || data.length < 4}
                        >
                            Enviar en Hamming
                        </button>
                        <button 
                            className="btn btn-primary mx-2"
                            onClick={handleDecode}
                            disabled={!isInputValid || !data || data.length < 4}
                        >
                            Recibir en Hamming
                        </button>
                    </div>
                    {(!isInputValid || data.length < 4) && (
                        <div className="invalid-feedback d-block">
                            {validateInput()}
                        </div>
                    )}
                    <small className="text-muted">
                        Ingrese una secuencia de bits (mínimo 4 bits, solo 0s y 1s)
                    </small>
                </div>
            </div>

            {/* Simulación paso a paso */}
            {isSimulating && simulationSteps.length > 0 && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h3>Simulación Paso a Paso</h3>
                        
                        {/* Visualización de bits */}
                        <div className="bits-container mb-3">
                            {simulationSteps[currentStepIndex]?.bits.slice().reverse().map((bit, index) => 
                                renderBitCell(bit, index, simulationSteps[currentStepIndex])
                            )}
                        </div>

                        {/* Descripción del paso actual */}
                        {simulationSteps[currentStepIndex]?.type === 'init' ? (
                            <div className="formula-box">
                                <h5>Fórmula para calcular bits de paridad:</h5>
                                <div className="formula">
                                    <p>2<sup>r</sup> ≥ m + r + 1</p>
                                    <p>Donde:</p>
                                    <ul>
                                        <li>r = número de bits de paridad</li>
                                        <li>m = número de bits de datos ({data.length})</li>
                                    </ul>
                                    <p>Desarrollo:</p>
                                    <ol>
                                        <li>2<sup>r</sup> ≥ {data.length} + r + 1</li>
                                        <li>Resolver para el menor valor de r que satisface la desigualdad</li>
                                        <li>r = {Math.ceil(Math.log2(data.length + Math.ceil(Math.log2(data.length)) + 1))} bits</li>
                                    </ol>
                                </div>
                            </div>
                        ) : (
                            <div className="step-description mb-3">
                                <h4>{simulationSteps[currentStepIndex]?.step}</h4>
                                <p>{simulationSteps[currentStepIndex]?.description}</p>
                            </div>
                        )}

                        {/* Controles de navegación */}
                        <div className="d-flex justify-content-between">
                            <button 
                                className="btn btn-secondary" 
                                onClick={handlePrevStep}
                                disabled={currentStepIndex === 0}
                            >
                                Anterior
                            </button>
                            <span>{`Paso ${currentStepIndex + 1} de ${simulationSteps.length}`}</span>
                            <button 
                                className="btn btn-primary" 
                                onClick={handleNextStep}
                                disabled={currentStepIndex === simulationSteps.length - 1}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Resultado final - Solo mostrar en codificación */}
            {result && action === 'encode' && (
                <div className="alert alert-success">
                    <h4>Resultado de la Codificación</h4>
                    <div className="mb-3">
                        <p>Palabra código: {result}</p>
                        <p>Longitud de datos (m): {data.length} bits</p>
                        <p>Bits de paridad (r): {Math.ceil(Math.log2(data.length + Math.ceil(Math.log2(data.length)) + 1))} bits</p>
                    </div>
                </div>
            )}

            {/* Información de error (para decodificación) */}
            {errorDetails && (
                <div className={`alert ${errorDetails.correctedData ? 'alert-warning' : 'alert-danger'}`}>
                    <h4>Estado de la Decodificación</h4>
                    <div className="mb-3">
                        <p>Longitud total (n): {errorDetails.originalData.length} bits</p>
                        <p>Bits de paridad (r): {Math.ceil(Math.log2(errorDetails.originalData.length))} bits</p>
                        <p>Bits de datos (m): {errorDetails.originalData.length - Math.ceil(Math.log2(errorDetails.originalData.length))} bits</p>
                    </div>
                    {errorDetails.position && (
                        <>
                            <p>Error detectado en posición: {errorDetails.position}</p>
                            <p>Datos originales: {errorDetails.originalData}</p>
                            {errorDetails.correctedData && (
                                <p>Datos corregidos: {errorDetails.correctedData}</p>
                            )}
                        </>
                    )}
                    <div className="formula-box">
                        <h5>Fórmula para verificar bits de paridad:</h5>
                        <div className="formula">
                            <p>Posición del error = Σ P<sub>i</sub> × 2<sup>i-1</sup></p>
                            <p>Donde:</p>
                            <ul>
                                <li>P<sub>i</sub> = valor del bit de paridad i (0 o 1)</li>
                                <li>i = posición del bit de paridad (1, 2, 4, 8, ...)</li>
                            </ul>
                            <p>Los bits de paridad se encuentran en las posiciones que son potencias de 2:</p>
                            <ul>
                                <li>P1: posición 1</li>
                                <li>P2: posición 2</li>
                                <li>P3: posición 4</li>
                                <li>P4: posición 8</li>
                                <li>...</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabla de paridad */}
            {parityTable.length > 0 && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h3>Tabla de Paridad</h3>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Posición</th>
                                    <th>Bits Afectados</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parityTable.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.parityPos}</td>
                                        <td>{row.affectedBits}</td>
                                        <td>{row.parityValue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Visualización de Distancia Hamming */}
            {hammingExamples && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h3>Análisis de Distancia Hamming</h3>
                        <div className="mb-3">
                            <h5>Secuencia Original Codificada</h5>
                            <div className="original-sequence">
                                {hammingExamples.originalSequence.split('').reverse().map((bit, index) => (
                                    <span key={index} className="bit-display">
                                        <span className="bit">{bit}</span>
                                        <small className="position">{hammingExamples.originalSequence.length - index}</small>
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="mb-3">
                            <h5>Seleccione una Variación</h5>
                            <select 
                                className="form-select"
                                onChange={(e) => handleExampleSelect(hammingExamples.examples[e.target.value])}
                                defaultValue=""
                            >
                                <option value="" disabled>Seleccione una posición para ver cambios...</option>
                                {hammingExamples.examples.map((example, index) => (
                                    <option key={index} value={index}>
                                        {example.description} (Distancia: {example.distance})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedExample && hammingAnalysis && (
                            <HammingDistanceVisualizer
                                sequence1={hammingExamples.originalSequence}
                                sequence2={selectedExample.sequence}
                                distance={hammingAnalysis.distance}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;