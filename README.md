# Simulador de Código Hamming

Este proyecto es un simulador interactivo del Código Hamming, una técnica de detección y corrección de errores utilizada en comunicaciones digitales.

## Descripción

El simulador permite:
- Codificar secuencias binarias usando el Código Hamming
- Decodificar palabras código
- Detectar y corregir errores
- Visualizar la distancia Hamming entre secuencias
- Simular errores de transmisión

## Funcionamiento

### Codificación
1. El usuario ingresa una secuencia binaria (0s y 1s)
2. El sistema:
   - Calcula los bits de paridad necesarios
   - Posiciona los bits de datos y paridad
   - Calcula los valores de paridad
   - Genera la palabra código final

### Decodificación
1. El usuario ingresa una palabra código
2. El sistema:
   - Verifica los bits de paridad
   - Detecta si hay errores
   - Corrige errores de un bit si es posible
   - Extrae los datos originales

### Análisis de Distancia Hamming
- Muestra comparaciones entre secuencias
- Calcula la distancia Hamming
- Indica capacidad de detección y corrección de errores
- Visualiza las diferencias entre secuencias

## Características Principales

### Entrada de Datos
- Acepta secuencias binarias de cualquier longitud
- Validación en tiempo real
- Mínimo 4 bits requeridos

### Visualización
- Simulación paso a paso del proceso
- Tabla de bits de paridad
- Comparación visual de secuencias
- Indicadores de errores y correcciones

### Análisis
- Cálculo de distancia Hamming
- Ejemplos de variaciones y errores
- Métricas de capacidad de corrección
- Visualización de diferencias entre secuencias

## Resultados Esperados

### En Codificación
- Palabra código válida con bits de paridad
- Visualización del proceso de codificación
- Tabla de cálculos de paridad

### En Decodificación
- Detección de errores
- Corrección de errores de un bit
- Recuperación de datos originales
- Indicación de posición del error

### En Análisis
- Distancia Hamming entre secuencias
- Número de errores detectables
- Número de errores corregibles
- Visualización de diferencias

## Uso

1. Inicie la aplicación:
```bash
npm start
```

2. Acceda a través del navegador:
```
http://localhost:3000
```

3. Ingrese una secuencia binaria
4. Seleccione "Codificar" o "Decodificar" según sea necesario

5. Explore los resultados y análisis

## Limitaciones

- Solo corrige errores de un bit
- Requiere secuencias de al menos 4 bits
- La eficiencia disminuye con secuencias muy largas

## Tecnologías

- React.js
- Bootstrap
- JavaScript ES6+
- CSS3

## Contribución
Si desea contribuir al proyecto:
1. Fork el repositorio
2. Cree una rama para su característica
3. Commit sus cambios
4. Push a la rama
5. Abra un Pull Request