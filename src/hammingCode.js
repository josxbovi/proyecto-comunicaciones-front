export function encodeHamming(data) {
    const dataBits = data.split('').map(bit => parseInt(bit));
    const m = dataBits.length;
    let r = 1;
    let steps = [];
    let parityTable = [];
    let simulationSteps = []; // Array para los pasos de simulación

    // Calcula bits de paridad necesarios
    while (Math.pow(2, r) < m + r + 1) {
        r++;
    }

    // Paso 1: Inicialización
    const totalBits = m + r;
    const encodedBits = new Array(totalBits).fill(null);
    simulationSteps.push({
        step: 'Inicialización',
        description: `Se necesitan ${r} bits de paridad para ${m} bits de datos`,
        bits: [...encodedBits],
        highlightPositions: [],
        type: 'init'
    });

    // Paso 2: Colocación de bits de paridad
    let parityPositions = [];
    for (let i = 0; i < r; i++) {
        const pos = Math.pow(2, i) - 1;
        encodedBits[pos] = 0;
        parityPositions.push(pos);
    }
    simulationSteps.push({
        step: 'Colocación de bits de paridad',
        description: `Bits de paridad colocados en posiciones: ${parityPositions.map(p => p + 1).join(', ')}`,
        bits: [...encodedBits],
        highlightPositions: parityPositions,
        type: 'parity'
    });

    // Paso 3: Colocación de bits de datos
    let dataIndex = 0;
    for (let i = 0; i < totalBits; i++) {
        if (!parityPositions.includes(i)) {
            encodedBits[i] = dataBits[dataIndex];
            simulationSteps.push({
                step: 'Colocación de datos',
                description: `Bit de datos ${dataBits[dataIndex]} colocado en posición ${i + 1}`,
                bits: [...encodedBits],
                highlightPositions: [i],
                type: 'data'
            });
            dataIndex++;
        }
    }

    // Paso 4: Cálculo de bits de paridad
    for (let i = 0; i < r; i++) {
        const parityPos = Math.pow(2, i) - 1;
        const affectedPositions = [];
        let parityValue = 0;

        // Simular el cálculo de cada bit de paridad
        for (let j = parityPos; j < totalBits; j++) {
            if (((j + 1) & (parityPos + 1)) !== 0) {
                affectedPositions.push(j);
                if (encodedBits[j] === 1) {
                    parityValue ^= 1;
                }
            }
        }

        encodedBits[parityPos] = parityValue;
        simulationSteps.push({
            step: `Cálculo de paridad P${parityPos + 1}`,
            description: `Calculando paridad para posición ${parityPos + 1}: ${parityValue}`,
            bits: [...encodedBits],
            highlightPositions: [parityPos, ...affectedPositions],
            affectedBits: affectedPositions,
            parityValue: parityValue,
            type: 'calculation'
        });

        parityTable.push({
            parityPos: parityPos + 1,
            affectedBits: affectedPositions.map(p => p + 1).join(', '),
            parityValue: parityValue
        });
    }

    // Paso final
    simulationSteps.push({
        step: 'Palabra código completa',
        description: `Código Hamming final: ${encodedBits.join('')}`,
        bits: encodedBits,
        highlightPositions: [],
        type: 'final'
    });

    return {
        encodedData: encodedBits.join(''),
        steps,
        parityTable,
        simulationSteps,
        hammingDistance: Math.floor(Math.log2(data.length)) + 1
    };
}

export function decodeHamming(data) {
    const dataBits = data.split('').map(bit => parseInt(bit));
    const m = dataBits.length;
    let errorPosition = 0;
    let simulationSteps = [];
    let parityTable = [];

    // Paso 1: Inicialización
    simulationSteps.push({
        step: 'Inicialización',
        description: `Datos recibidos: ${data}`,
        bits: [...dataBits],
        highlightPositions: [],
        type: 'init'
    });

    // Verificación de paridad
    let errorBits = [];
    for (let i = 0; Math.pow(2, i) <= m; i++) {
        const parityPos = Math.pow(2, i) - 1;
        const affectedPositions = [];
        let parity = 0;

        for (let j = parityPos; j < m; j++) {
            if (((j + 1) & (parityPos + 1)) !== 0) {
                affectedPositions.push(j);
                if (dataBits[j] === 1) {
                    parity ^= 1;
                }
            }
        }

        if (parity !== 0) {
            errorPosition += (parityPos + 1);
            errorBits.push(parityPos);
        }

        simulationSteps.push({
            step: `Verificación de paridad P${parityPos + 1}`,
            description: `Verificando paridad en posición ${parityPos + 1}: ${parity === 0 ? 'correcta' : 'incorrecta'}`,
            bits: [...dataBits],
            highlightPositions: [parityPos, ...affectedPositions],
            parityValue: parity,
            type: 'verification'
        });

        parityTable.push({
            parityPos: parityPos + 1,
            affectedBits: affectedPositions.map(p => p + 1).join(', '),
            parityValue: parity
        });
    }

    let correctedData = null;
    if (errorPosition !== 0) {
        if (errorPosition > m) {
            simulationSteps.push({
                step: 'Error detectado',
                description: `Error en posición ${errorPosition} (fuera de límites)`,
                bits: [...dataBits],
                highlightPositions: [],
                type: 'error'
            });
            return {
                decodedData: null,
                simulationSteps,
                parityTable,
                errorDetails: {
                    position: errorPosition,
                    originalData: data,
                    correctedData: null
                }
            };
        }

        // Corregir el error
        dataBits[errorPosition - 1] ^= 1;
        correctedData = dataBits.join('');
        
        simulationSteps.push({
            step: 'Corrección de error',
            description: `Error corregido en posición ${errorPosition}`,
            bits: [...dataBits],
            highlightPositions: [errorPosition - 1],
            type: 'correction'
        });
    } else {
        simulationSteps.push({
            step: 'Verificación completada',
            description: 'No se encontraron errores',
            bits: [...dataBits],
            highlightPositions: [],
            type: 'success'
        });
    }

    // Extraer bits de datos
    const decodedBits = [];
    for (let i = 0; i < m; i++) {
        if (Math.log2(i + 1) % 1 !== 0) {
            decodedBits.push(dataBits[i]);
        }
    }

    return {
        decodedData: decodedBits.join(''),
        simulationSteps,
        parityTable,
        errorDetails: errorPosition !== 0 ? {
            position: errorPosition,
            originalData: data,
            correctedData: correctedData
        } : null
    };
}

// Las demás funciones auxiliares permanecen igual
export function calculateHammingDistance(str1, str2) {
    if (str1.length !== str2.length) return null;
    let distance = 0;
    for (let i = 0; i < str1.length; i++) {
        if (str1[i] !== str2[i]) distance++;
    }
    return distance;
}

export function getAffectedBits(bits, pos) {
    let affectedBits = [];
    for (let i = pos; i <= bits.length; i++) {
        if (((i + 1) & pos) !== 0) {
            affectedBits.push(i);
        }
    }
    return affectedBits;
}

export function calculateParity(bits, pos) {
    let parity = 0;
    for (let i = pos; i <= bits.length; i++) {
        if (((i + 1) & pos) !== 0) {
            parity ^= bits[i - 1];
        }
    }
    return parity;
}

export function generateHammingExamples(originalData) {
    const examples = [];
    const encodedOriginal = encodeHamming(originalData).encodedData;
    
    // Generar ejemplos con 1 bit cambiado
    for (let i = 0; i < encodedOriginal.length; i++) {
        const modifiedData = encodedOriginal.split('');
        modifiedData[i] = modifiedData[i] === '0' ? '1' : '0';
        examples.push({
            sequence: modifiedData.join(''),
            distance: calculateHammingDistance(encodedOriginal, modifiedData.join('')),
            description: `Cambio en posición ${i + 1}`
        });
    }

    // Generar ejemplos con 2 bits cambiados
    for (let i = 0; i < encodedOriginal.length - 1; i++) {
        for (let j = i + 1; j < encodedOriginal.length; j++) {
            const modifiedData = encodedOriginal.split('');
            modifiedData[i] = modifiedData[i] === '0' ? '1' : '0';
            modifiedData[j] = modifiedData[j] === '0' ? '1' : '0';
            examples.push({
                sequence: modifiedData.join(''),
                distance: calculateHammingDistance(encodedOriginal, modifiedData.join('')),
                description: `Cambios en posiciones ${i + 1} y ${j + 1}`
            });
        }
    }

    return {
        originalSequence: encodedOriginal,
        examples: examples
    };
}

export function analyzeHammingDistance(sequence1, sequence2) {
    const distance = calculateHammingDistance(sequence1, sequence2);
    
    return {
        distance,
        detectable: distance - 1,
        correctable: Math.floor((distance - 1) / 2),
        differences: sequence1.split('').map((bit, index) => ({
            position: index + 1,
            bits: [bit, sequence2[index]],
            isDifferent: bit !== sequence2[index]
        }))
    };
}