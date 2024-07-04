// Función para verificar si existe el token JWT en las cookies
function getToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'token') {
            return value;
        }
    }
    return '';
}

// Función para cargar y mostrar eventos
function loadEventos() {
    fetch('http://127.0.0.1:8000/eventos', {
        headers: {
            'Authorization': `Bearer ${getToken()}` // Obtener token JWT y añadirlo a la cabecera
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        renderEventos(data);
    })
    .catch(error => {
        console.error('Error al cargar eventos:', error);
    });

    // Cargar opciones del select de categorías al mismo tiempo
    loadCategorias();
}

// Función para renderizar eventos en la tabla
function renderEventos(eventos) {
    const tableBody = document.getElementById('eventoTableBody');
    tableBody.innerHTML = '';

    eventos.forEach(evento => {
        //const categoriaNombre = evento.categoria ? evento.categoria.nombre : 'Sin categoría'; // Verificar si evento.categoria está definido

        const row = `
            <tr>
                <td>${evento.id}</td>
                <td>${evento.nombre}</td>
                <td>${evento.descripcion}</td>
                <td>${evento.fecha_inicio}</td>
                <td>${evento.fecha_fin}</td>
                <td>${evento.lugar}</td>
                <td>${evento.cupos}</td>
                <td>${evento.categoria_id}</td> <!-- Mostrar nombre de la categoría -->
                <td>
                    <button type="button" class="btn btn-info btn-sm" onclick="editEvento(${evento.id})">Editar</button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="deleteEvento(${evento.id})">Eliminar</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Función para cargar opciones del select de categorías
function loadCategorias() {
    fetch('http://127.0.0.1:8000/categorias', {
        headers: {
            'Authorization': `Bearer ${getToken()}` // Obtener token JWT y añadirlo a la cabecera
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        const selectCategoriaFilter = document.getElementById('categoriaFilter');
        const selectCategoriaEvento = document.getElementById('eventoCategoria');

        selectCategoriaFilter.innerHTML = ''; // Limpiar opciones actuales
        selectCategoriaEvento.innerHTML = ''; // Limpiar opciones actuales

        // Añadir opción por defecto al filtro
        const defaultOptionFilter = document.createElement('option');
        defaultOptionFilter.value = '';
        defaultOptionFilter.textContent = 'Todas las categorías';
        selectCategoriaFilter.appendChild(defaultOptionFilter);

        // Añadir opciones al select de categoría en el formulario de evento
        data.forEach(categoria => {
            const optionFilter = document.createElement('option');
            optionFilter.value = categoria.id;
            optionFilter.textContent = categoria.nombre;
            selectCategoriaFilter.appendChild(optionFilter);

            const optionEvento = document.createElement('option');
            optionEvento.value = categoria.id;
            optionEvento.textContent = categoria.nombre;
            selectCategoriaEvento.appendChild(optionEvento);
        });
    })
    .catch(error => {
        console.error('Error al cargar categorías:', error);
    });
}

// Función para filtrar eventos por categoría
function filterByCategoria() {
    const categoriaId = document.getElementById('categoriaFilter').value;
    const url = categoriaId ? `http://127.0.0.1:8000/eventos/categoria/${categoriaId}` : 'http://127.0.0.1:8000/eventos';

    fetch(url, {
        headers: {
            'Authorization': `Bearer ${getToken()}` // Obtener token JWT y añadirlo a la cabecera
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        renderEventos(data);
    })
    .catch(error => {
        console.error('Error al filtrar eventos:', error);
    });
}

// Función para guardar un evento (crear o actualizar)
// Función para guardar un evento (crear o actualizar)
function guardarEvento(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const nombre = document.getElementById('eventoNombre').value;
    const descripcion = document.getElementById('eventoDescripcion').value;
    const fechaInicio = document.getElementById('eventoFechaInicio').value;
    const fechaFin = document.getElementById('eventoFechaFin').value;
    const lugar = document.getElementById('eventoLugar').value;
    const cupos = parseInt(document.getElementById('eventoCupos').value);
    const categoriaId = parseInt(document.getElementById('eventoCategoria').value);

    // Generar un id aleatorio para nuevos eventos
    const id = Math.floor(Math.random() * (100000 - 100 + 1)) + 100;

    // Objeto con los datos del evento
    const eventoData = {
        id: id, // Usar el id generado para nuevos eventos
        nombre: nombre,
        descripcion: descripcion,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        lugar: lugar,
        cupos: cupos,
        categoria_id: categoriaId
    };
 
    // Determinar si es una solicitud POST o PUT
    let url = 'http://127.0.0.1:8000/eventos';
    let method = 'POST';

    // Verificar si hay un id existente para actualizar (PUT)
    const eventoId = document.getElementById('eventoId').value;
    if (eventoId) {
        url += `/${eventoId}`;
        method = 'PUT';
    }
   
    // Enviar datos al backend mediante una solicitud POST o PUT
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}` // Añadir token JWT a la cabecera
        },
        body: JSON.stringify(eventoData)
    })
    .then(response => {
        if (response.ok) {
            $('#eventoModal').modal('hide'); // Ocultar modal después de guardar
            loadEventos(); // Volver a cargar eventos después de guardar
        } else {
            throw new Error('Error al guardar el evento');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al guardar el evento');
    });
}



// Función para eliminar un evento
function deleteEvento(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
        fetch(`http://127.0.0.1:8000/evento/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}` // Añadir token JWT a la cabecera
            }
        })
        .then(response => {
            if (response.ok) {
                loadEventos(); // Volver a cargar eventos después de eliminar
            } else {
                throw new Error('Error al eliminar el evento');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al eliminar el evento');
        });
    }
}

// Función para editar un evento (cargar datos en el formulario)
function editEvento(id) {
    fetch(`http://127.0.0.1:8000/eventos/${id}`, {
        headers: {
            'Authorization': `Bearer ${getToken()}` // Obtener token JWT y añadirlo a la cabecera
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(evento => {
        document.getElementById('eventoId').value = evento.id;
        document.getElementById('eventoNombre').value = evento.nombre;
        document.getElementById('eventoDescripcion').value = evento.descripcion;
        document.getElementById('eventoFechaInicio').value = evento.fecha_inicio;
        document.getElementById('eventoFechaFin').value = evento.fecha_fin;
        document.getElementById('eventoLugar').value = evento.lugar;
        document.getElementById('eventoCupos').value = evento.cupos;
        document.getElementById('eventoCategoria').value = evento.categoria_id;

        $('#eventoModal').modal('show');
    })
    .catch(error => {
        console.error('Error al cargar evento:', error);
    });
}

// Función para resetear el formulario
function resetForm() {
    document.getElementById('eventoForm').reset();
    document.getElementById('eventoId').value = '';
}

function buscarEventosPorNombre() {
    const nombre = document.getElementById('nombreBuscar').value;
    fetch(`http://127.0.0.1:8000/eventos?nombre=${encodeURIComponent(nombre)}`, {
        headers: {
            'Authorization': `Bearer ${getToken()}` // Obtener token JWT y añadirlo a la cabecera
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        renderEventos(data);
    })
    .catch(error => {
        console.error('Error al filtrar eventos:', error);
    });
}

function buscarEventosPorDescripcion() {
    const nombre = document.getElementById('descripcionBuscar').value;
    fetch(`http://127.0.0.1:8000/eventos?descripcion=${encodeURIComponent(nombre)}`, {
        headers: {
            'Authorization': `Bearer ${getToken()}` // Obtener token JWT y añadirlo a la cabecera
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        renderEventos(data);
    })
    .catch(error => {
        console.error('Error al filtrar eventos:', error);
    });
}

function resetFormularioBuscar() {
    document.getElementById('nombreBuscar').value = '';
    document.getElementById('descripcionBuscar').value = '';
    loadEventos();
}
// Inicializar carga de eventos y categorías al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    loadEventos();
});
