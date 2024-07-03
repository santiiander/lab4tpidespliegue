// Función para verificar si existe el token JWT en las cookies


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
        // Limpiar tabla antes de agregar datos nuevos
        const tableBody = document.getElementById('eventoTableBody');
        tableBody.innerHTML = '';

        // Agregar cada evento a la tabla
        data.forEach(evento => {
            const row = `
                <tr>
                    <td>${evento.id}</td>
                    <td>${evento.nombre}</td>
                    <td>${evento.fecha_inicio}</td>
                    <td>${evento.fecha_fin}</td>
                    <td>${evento.lugar}</td>
                    <td>${evento.cupos}</td>
                    <td>${evento.categoria_id}</td> <!-- Verificar si evento.categoria está definido -->
                    <td>
                        <button type="button" class="btn btn-info btn-sm" onclick="editEvento(${evento.id})">Editar</button>
                        <button type="button" class="btn btn-danger btn-sm" onclick="deleteEvento(${evento.id})">Eliminar</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => {
        console.error('Error al cargar eventos:', error);
    });

    // Cargar opciones del select de categorías al mismo tiempo
    loadCategorias();
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
        const selectCategoria = document.getElementById('eventoCategoria');
        selectCategoria.innerHTML = ''; // Limpiar opciones actuales

        data.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            selectCategoria.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error al cargar categorías:', error);
    });
}

// Función para guardar un nuevo evento o editar uno existente
function guardarEvento(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const id = document.getElementById('eventoId').value;
    const nombre = document.getElementById('eventoNombre').value;
    const descripcion = document.getElementById('eventoDescripcion').value;
    const fechaInicio = document.getElementById('eventoFechaInicio').value;
    const fechaFin = document.getElementById('eventoFechaFin').value;
    const lugar = document.getElementById('eventoLugar').value;
    const cupos = parseInt(document.getElementById('eventoCupos').value);
    const categoriaId = parseInt(document.getElementById('eventoCategoria').value);

    // Objeto con los datos del evento
    const eventoData = {
        id: id ? parseInt(id) : Math.floor(Math.random() * (100000 - 100 + 1)) + 100, // Generar un id aleatorio para nuevos eventos
        nombre: nombre,
        descripcion: descripcion,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        lugar: lugar,
        cupos: cupos,
        categoria_id: categoriaId
    };

    // Determinar si es una solicitud POST o PUT
    let url = id ? `http://127.0.0.1:8000/eventos/${id}` : 'http://127.0.0.1:8000/eventos';
    let method = id ? 'PUT' : 'POST';

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
        fetch(`http://127.0.0.1:8000/eventos/${id}`, {
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

// Función para cargar datos de un evento específico en el formulario de edición
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
        // Llenar el formulario con los datos del evento
        document.getElementById('eventoId').value = evento.id;
        document.getElementById('eventoNombre').value = evento.nombre;
        document.getElementById('eventoDescripcion').value = evento.descripcion;
        document.getElementById('eventoFechaInicio').value = evento.fecha_inicio;
        document.getElementById('eventoFechaFin').value = evento.fecha_fin;
        document.getElementById('eventoLugar').value = evento.lugar;
        document.getElementById('eventoCupos').value = evento.cupos;
        document.getElementById('eventoCategoria').value = evento.categoria_id;

        // Cambiar título del modal
        const modalTitle = document.getElementById('eventoModalLabel');
        modalTitle.textContent = 'Editar Evento';

        // Mostrar modal de edición
        $('#eventoModal').modal('show');
    })
    .catch(error => {
        console.error('Error al cargar el evento para editar:', error);
        alert('Error al cargar el evento para editar');
    });
}

// Función para obtener el token JWT almacenado en las cookies
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
function checkTokenAndLoad() {
    const token = getToken();
    if (!token) {
        // Redirigir al usuario al login si no hay token
        window.location.href = '/templates/login.html'; // Ajusta la ruta según tu aplicación
    } else {
        loadEventos(); // Cargar los eventos si hay un token válido
    }
}
// Cargar eventos y categorías al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    checkTokenAndLoad();
});
