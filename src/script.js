document.addEventListener('DOMContentLoaded', function() {
    let csvData; // Variable para almacenar los datos CSV procesados globalmente

    const fileInput = document.getElementById('file-input');
    const fileDropArea = document.getElementById('file-drop-area');
    const sliderGrafica = document.getElementById('slider-grafica');
    const sliderTabla = document.getElementById('slider-tabla');
    const valorSliderGrafica = document.getElementById('valor-slider-grafica');
    const valorSliderTabla = document.getElementById('valor-slider-tabla');

    // Eventos para manejar la interacción con el área de carga de archivos
    fileDropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        fileDropArea.classList.add('over');
    });

    fileDropArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        fileDropArea.classList.remove('over');
    });

    fileDropArea.addEventListener('drop', function(e) {
        e.preventDefault();
        fileDropArea.classList.remove('over');
        let files = e.dataTransfer.files;
        handleFile(files[0]);
    });

    fileDropArea.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            handleFile(this.files[0]);
        }
    });

    // Eventos para manejar cambios en los sliders y actualizar las visualizaciones
    sliderGrafica.addEventListener('input', function() {
        valorSliderGrafica.textContent = sliderGrafica.value;
        if (csvData) { // Verifica si csvData contiene datos antes de intentar filtrar y mostrar
            showPlots(csvData);
        }
    });

    sliderTabla.addEventListener('input', function() {
        valorSliderTabla.textContent = sliderTabla.value;
        if (csvData) { // Verifica si csvData contiene datos antes de intentar filtrar y mostrar
            showTable(csvData);
        }
    });

    // Función para manejar el archivo seleccionado o arrastrado
    function handleFile(file) {
        if (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel') {
            readFile(file);
        } else {
            alert('Por favor, selecciona un archivo CSV.');
        }
    }

    // Función para leer el archivo CSV
    function readFile(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            csvData = e.target.result;
            processData(csvData);
        };
        reader.readAsText(file);
    }

    // Función para procesar los datos CSV y visualizar gráficas y tablas
    function processData(data) {
        csvData = Papa.parse(data, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true
        }).data;

        // Asegúrate de que las secciones ocultas ahora sean visibles
        document.getElementById('slider-graficas').classList.remove('hidden');
        document.getElementById('graficas').classList.remove('hidden');
        document.getElementById('slider-tablas').classList.remove('hidden');
        document.getElementById('tablas').classList.remove('hidden');
        document.querySelectorAll('.hidden').forEach(element => element.classList.remove('hidden'));

        // Llama a las funciones para mostrar gráficas y tablas
        showPlots(csvData);
        showTable(csvData);
    }

    // Función para mostrar gráficas usando Plotly
    function showPlots(data) {
        // Filtrar los datos basados en el año seleccionado en el slider de gráficas
        const yearSelected = document.getElementById('slider-grafica').value;
        const filteredData = data.filter(row => row.Year >= yearSelected);
    
        // Preparar los datos para las gráficas de Plotly
        const traces = ['VentasA', 'VentasB', 'VentasC', 'VentasD'].map(column => ({
            x: filteredData.map(row => `${row.Month}-${row.Year}`),
            y: filteredData.map(row => row[column]),
            type: 'scatter',
            mode: 'lines+markers',
            name: column
        }));
    
        const layout = {
            title: 'Ventas por Producto y Mes',
            xaxis: { title: 'Fecha' },
            yaxis: { title: 'Ventas' },
            margin: { l: 50, r: 50, b: 100, t: 100, pad: 4 },
            paper_bgcolor: '#f8f9fa',
            plot_bgcolor: '#f8f9fa',
            font: { color: "#2c3e50", family: "Arial" }
        };
    
        Plotly.newPlot('grafica-lineal', traces, layout);
    }

    // Función para mostrar tablas usando Plotly
    function showTable(data) {
        // Filtrar los datos basados en el año seleccionado en el slider de tablas
        const yearSelected = document.getElementById('slider-tabla').value;
        const filteredData = data.filter(row => row.Year >= yearSelected);
    
        // Organizar los datos para la tabla de Plotly
        const headers = ['Year', 'Month', 'VentasA', 'VentasB', 'VentasC', 'VentasD'];
        const values = headers.map(header => filteredData.map(row => row[header]));
    
        const tableData = [{
            type: 'table',
            header: {
                values: headers.map(header => `<b>${header}</b>`),
                align: 'center',
                line: { width: 1, color: 'black' },
                fill: { color: 'grey' },
                font: { family: 'Arial', size: 12, color: 'white' }
            },
            cells: {
                values: values,
                align: 'center',
                line: { color: 'black', width: 1 },
                fill: { color: ['white', 'lightgrey'] },
                font: { family: 'Arial', size: 11, color: ['black'] }
            }
        }];
    
        const layout = {
            title: 'Detalle de Ventas por Año y Mes',
            margin: { l: 50, r: 50, b: 20, t: 50, pad: 4 },
            paper_bgcolor: '#f8f9fa',
            font: { color: "#2c3e50", family: "Arial" }
        };
    
        Plotly.newPlot('tabla-total', tableData, layout);
    }

        // Función para agrupar los datos por año y sumar ventas por producto
    function agruparDatosPorAno(datos) {
        let datosAgrupados = {};

        // Iterar sobre cada fila de datos
        datos.forEach(row => {
            const ano = row.Year;
            if (!datosAgrupados[ano]) {
                datosAgrupados[ano] = { VentasA: 0, VentasB: 0, VentasC: 0, VentasD: 0 };
            }

            // Sumar las ventas por producto para el año
            datosAgrupados[ano].VentasA += row.VentasA;
            datosAgrupados[ano].VentasB += row.VentasB;
            datosAgrupados[ano].VentasC += row.VentasC;
            datosAgrupados[ano].VentasD += row.VentasD;
        });

        return datosAgrupados;
    }

    // Función para mostrar la tabla agrupada
    function mostrarTablaAgrupada(datosAgrupados) {
        const headers = [["<b>Año</b>"], ["<b>Ventas A</b>"], ["<b>Ventas B</b>"], ["<b>Ventas C</b>"], ["<b>Ventas D</b>"]];
        const values = [
            Object.keys(datosAgrupados),
            Object.values(datosAgrupados).map(row => row.VentasA),
            Object.values(datosAgrupados).map(row => row.VentasB),
            Object.values(datosAgrupados).map(row => row.VentasC),
            Object.values(datosAgrupados).map(row => row.VentasD)
        ];

        const dataAgrupada = [{
            type: 'table',
            header: {
                values: headers,
                align: "center",
                line: {width: 1, color: 'black'},
                fill: {color: "grey"},
                font: {family: "Arial", size: 12, color: "white"}
            },
            cells: {
                values: values,
                align: "center",
                line: {color: "black", width: 1},
                fill: {color: ["white", "lightgrey"]},
                font: {family: "Arial", size: 11, color: ["black"]}
            }
        }];

        const layoutAgrupado = {
            title: "Tabla de datos agrupados por año",
            margin: { l: 50, r: 50, b: 20, t: 50, pad: 4 },
            paper_bgcolor: '#f8f9fa',
            font: { color: "#2c3e50", family: "Arial" }
        };

        Plotly.newPlot('tabla-agrupada', dataAgrupada, layoutAgrupado);
    }

    // Llamada a las funciones
    const datosAgrupados = agruparDatosPorAno(csvData);
    mostrarTablaAgrupada(datosAgrupados);
});


document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('header nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });
});