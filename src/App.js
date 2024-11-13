// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [data, setData] = useState('');
    const [result, setResult] = useState('');
    const [steps, setSteps] = useState([]);
    const [parityTable, setParityTable] = useState([]);
    const [hammingDistance, setHammingDistance] = useState(null);

    const handleEncode = async () => {
        try {
            const response = await axios.post('/encode', { data });
            setResult(response.data.encodedData);
            setSteps(response.data.steps);
            setParityTable(response.data.parityTable);
            setHammingDistance(response.data.hammingDistance);
        } catch (error) {
            console.error('Error al codificar los datos:', error);
            setResult('Error al codificar los datos');
        }
    };

    const handleDecode = async () => {
        try {
            const response = await axios.post('/decode', { data });
            setResult(response.data.decodedData);
            setSteps(response.data.steps);
            setParityTable(response.data.parityTable);
        } catch (error) {
            console.error('Error al decodificar los datos:', error);
            setResult('Error al decodificar los datos');
        }
    };

    return (
        <div className="container">
            <h1>Codificador/Decodificador de Código Hamming</h1>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Ingrese datos binarios"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <button className="btn btn-primary me-2" onClick={handleEncode}>
                    Codificar
                </button>
                <button className="btn btn-secondary" onClick={handleDecode}>
                    Decodificar
                </button>
            </div>
            <div className="mb-3">
                <h2>Resultado</h2>
                <p>{result}</p>
            </div>
            {hammingDistance && (
                <div className="mb-3">
                    <h2>Distancia de Hamming</h2>
                    <div className="alert alert-info">
                        <p><strong>Distancia mínima:</strong> {hammingDistance}</p>
                        <p><strong>Capacidad de detección:</strong> {hammingDistance - 1} errores</p>
                        <p><strong>Capacidad de corrección:</strong> {Math.floor((hammingDistance - 1)/2)} errores</p>
                    </div>
                </div>
            )}
            <div className="mb-3">
                <h2>Pasos</h2>
                <ul>
                    {steps.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ul>
            </div>
            <div className="mb-3">
                <h2>Tabla de Paridad</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Posición de Paridad</th>
                            <th>Bits Afectados</th>
                            <th>Valor de Paridad</th>
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
    );
}

export default App;