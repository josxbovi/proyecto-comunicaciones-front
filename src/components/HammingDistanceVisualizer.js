import React from 'react';
import '../hamingDistanceVisualizer.css';

const HammingDistanceVisualizer = ({ sequence1, sequence2, distance }) => {
    const renderBitComparison = () => {
        return (
            <div className="comparison-section">
                <div className="comparison-table">
                    <div className="sequence-row original">
                        <div className="sequence-label">Original:</div>
                        <div className="sequence-bits">
                            {sequence1.split('').reverse().map((bit, index) => (
                                <div key={index} className="bit-box">
                                    <div className="bit-value">{bit}</div>
                                    <div className="bit-position">Pos {sequence1.length - index}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="sequence-row modified">
                        <div className="sequence-label">Modificada:</div>
                        <div className="sequence-bits">
                            {sequence2.split('').reverse().map((bit, index) => {
                                const isDifferent = bit !== sequence1[sequence1.length - 1 - index];
                                return (
                                    <div key={index} className={`bit-box ${isDifferent ? 'different' : ''}`}>
                                        <div className="bit-value">{bit}</div>
                                        <div className="bit-position">Pos {sequence2.length - index}</div>
                                        {isDifferent && <div className="error-indicator">↑</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="formula-box mt-4">
                    <h5>Fórmula de la Distancia Hamming:</h5>
                    <div className="formula">
                        <p>d(x,y) = Número de posiciones en las que x e y difieren</p>
                        <p>Donde:</p>
                        <ul>
                            <li>x = secuencia original</li>
                            <li>y = secuencia modificada</li>
                        </ul>
                        <p>Desarrollo:</p>
                        <ol>
                            <li>Comparar bit a bit las secuencias</li>
                            <li>Contar las diferencias encontradas</li>
                            <li>Distancia Hamming = {distance} bits</li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    };

    const renderDistanceGraph = () => {
        const maxPossibleDistance = sequence1.length;
        const percentage = (distance / maxPossibleDistance) * 100;
        
        return (
            <div className="distance-graph">
                <div className="graph-title">
                    <h5>Análisis de Distancia</h5>
                    <div className="distance-value">
                        Distancia de Hamming: <span className="highlight">{distance} bits</span>
                    </div>
                </div>
                <div className="graph-container">
                    <div className="graph-bar" style={{ width: `${percentage}%` }}>
                        {distance}
                    </div>
                </div>
                <div className="graph-metrics">
                    <div className="metric-box">
                        <div className="metric-title">Errores Detectables</div>
                        <div className="metric-value">2</div>
                        <div className="metric-description">
                            El código Hamming puede detectar hasta 2 errores
                        </div>
                    </div>
                    <div className="metric-box">
                        <div className="metric-title">Errores Corregibles</div>
                        <div className="metric-value">1</div>
                        <div className="metric-description">
                            El código Hamming puede corregir 1 error
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="hamming-visualizer">
            <div className="comparison-section">
                <h4>Comparación de Secuencias</h4>
                {renderBitComparison()}
            </div>
            <div className="analysis-section">
                {renderDistanceGraph()}
            </div>
        </div>
    );
};

export default HammingDistanceVisualizer; 