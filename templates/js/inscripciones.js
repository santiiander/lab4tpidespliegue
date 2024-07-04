// Función para verificar si existe el token JWT en las cookies
function checkTokenAndLoad() {
    const token = getToken();
    if (!token) {
        // Redirigir al usuario al login si no hay token
        window.location.href = '/login.html'; // Ajusta la ruta según tu aplicación
    } else {
        loadInscripciones(); // Cargar las inscripciones si hay un token válido
    }
}

// Función para cargar y mostrar inscripciones
function loadInscripciones() {
    fetch('http://127.0.0.1:8000/inscripciones', {
        headers: {
            'Authorization': `Bearer ${getToken()}` // Obtener token JWT y añadirlo a la cabecera
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar inscripciones.');
        }
        return response.json();
    })
    .then(data => {
        actualizarTabla(data);
    })
    .catch(error => {
        console.error('Error al cargar inscripciones:', error);
        alert('Error al cargar inscripciones. Por favor, inicie sesión nuevamente.');
        window.location.href = '/login.html'; // Redirigir al login en caso de error
    });
}

// Función para buscar inscripciones por usuario
function buscarInscripciones() {
    const usuarioId = document.getElementById('usuarioIdBusqueda').value;
    const url = usuarioId ? `http://127.0.0.1:8000/inscripciones/usuario/${usuarioId}` : 'http://127.0.0.1:8000/inscripciones';

    fetch(url, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar inscripciones.');
        }
        return response.json();
    })
    .then(data => {
        actualizarTabla(data);
    })
    .catch(error => {
        console.error('Error al cargar inscripciones por usuario:', error);
        // Limpiar la tabla en caso de error
        actualizarTabla([]);
    });
}

// Función para buscar inscripciones activas por usuario
function buscarInscripcionesActivas() {
    const usuarioId = document.getElementById('usuarioIdBusqueda').value;
    const url = usuarioId ? `http://127.0.0.1:8000/inscripciones/usuario/${usuarioId}/activas` : 'http://127.0.0.1:8000/inscripciones/activas';

    fetch(url, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar inscripciones activas.');
        }
        return response.json();
    })
    .then(data => {
        actualizarTabla(data);
    })
    .catch(error => {
        console.error('Error al cargar inscripciones activas:', error);
        // Limpiar la tabla en caso de error
        actualizarTabla([]);
    });
}

// Función para actualizar la tabla de inscripciones
function actualizarTabla(data) {
    const tableBody = document.getElementById('inscripcionTableBody');
    tableBody.innerHTML = '';

    // Agregar cada inscripción a la tabla
    data.forEach(inscripcion => {
        const row = `
            <tr>
                <td>${inscripcion.id}</td>
                <td>${inscripcion.evento_id}</td>
                <td>${inscripcion.usuario_id}</td>
                <td>${inscripcion.fecha_inscripción}</td>
                <td>
                    <button type="button" class="btn btn-info btn-sm" onclick="editInscripcion(${inscripcion.id})">Editar</button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="deleteInscripcion(${inscripcion.id})">Eliminar</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    // Si no hay datos, mostrar un mensaje en la tabla
    if (data.length === 0) {
        const emptyRow = `
            <tr>
                <td colspan="5" class="text-center">No se encontraron inscripciones.</td>
            </tr>
        `;
        tableBody.innerHTML = emptyRow;
    }
}


// Función para limpiar el formulario de inscripción
function limpiarFormularioInscripcion() {
    document.getElementById('inscripcionId').value = '';
    document.getElementById('inscripcionUsuarioId').value = '';
    document.getElementById('inscripcionEventoId').value = '';
    document.getElementById('inscripcionFecha').value = '';
    document.getElementById('inscripcionForm').setAttribute('data-action', 'crear');
}


// Función para guardar una inscripción (crear o editar)
function guardarInscripcion(event) {
    event.preventDefault();
    const action = document.getElementById('inscripcionForm').getAttribute('data-action');
    const id = action === 'editar' ? document.getElementById('inscripcionId').value : Math.floor(Math.random() * 1000) + 100; // Generar ID entre 100 y 1000
    const usuario_id = document.getElementById('inscripcionUsuarioId').value;
    const evento_id = document.getElementById('inscripcionEventoId').value;
    const fecha_inscripcion = document.getElementById('inscripcionFecha').value;

    const data = {
        id: id, 
        usuario_id: usuario_id,
        evento_id: evento_id,
        fecha_inscripción: fecha_inscripcion
    };

    const url = action === 'editar' ? `http://127.0.0.1:8000/inscripciones/${id}` : 'http://127.0.0.1:8000/inscripciones';
    const method = action === 'editar' ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar la inscripción.');
        }
        return response.json();
    })
    .then(() => {
        $('#inscripcionModal').modal('hide');
        loadInscripciones();
        limpiarFormularioInscripcion(); // Limpiar el formulario después de guardar
    })
    .catch(error => {
        console.error('Error al guardar la inscripción:', error);
        alert('Error al guardar la inscripción.');
    });
}


// Función para editar una inscripción
function editInscripcion(id) {
    fetch(`http://127.0.0.1:8000/inscripciones/${id}`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar inscripción.');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('inscripcionId').value = data.id;
        document.getElementById('inscripcionUsuarioId').value = data.usuario_id;
        document.getElementById('inscripcionEventoId').value = data.evento_id;
        document.getElementById('inscripcionFecha').value = data.fecha_inscripción;
        document.getElementById('inscripcionForm').setAttribute('data-action', 'editar');
        $('#inscripcionModal').modal('show');
    })
    .catch(error => {
        console.error('Error al cargar inscripción:', error);
        alert('Error al cargar inscripción.');
    });
}


// Función para eliminar una inscripción
function deleteInscripcion(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta inscripción?')) {
        fetch(`http://127.0.0.1:8000/inscripciones/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar inscripción.');
            }
            loadInscripciones();
        })
        .catch(error => {
            console.error('Error al eliminar inscripción:', error);
            alert('Error al eliminar inscripción.');
        });
    }
}

// Función para obtener el token JWT de las cookies
function getToken() {
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith('token='));
    return cookieValue ? cookieValue.split('=')[1] : null;
}

// Evento para manejar el formulario de inscripción
document.getElementById('inscripcionForm').addEventListener('submit', guardarInscripcion);

// Cargar las inscripciones al cargar la página
document.addEventListener('DOMContentLoaded', checkTokenAndLoad);
