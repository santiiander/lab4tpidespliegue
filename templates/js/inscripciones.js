// Función para verificar si existe el token JWT en las cookies
function checkTokenAndLoad() {
    const token = getToken();
    if (!token) {
        // Redirigir al usuario al login si no hay token
        window.location.href = '/templates/login.html'; // Ajusta la ruta según tu aplicación
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
        // Limpiar tabla antes de agregar datos nuevos
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
    })
    .catch(error => {
        console.error('Error al cargar inscripciones:', error);
        alert('Error al cargar inscripciones. Por favor, inicie sesión nuevamente.');
        window.location.href = '/login.html'; // Redirigir al login en caso de error
    });
}

// Función para crear o editar inscripciones
function guardarInscripcion(event) {
    event.preventDefault();
    const action = document.getElementById('inscripcionForm').getAttribute('data-action');
    const id = action === 'editar' ? document.getElementById('inscripcionId').value : Math.floor(Math.random() * (100000 - 100 + 1)) + 100;
    const usuario_id = document.getElementById('inscripcionUsuarioId').value;
    const evento_id = document.getElementById('inscripcionEventoId').value;
    const fecha_inscripcion = document.getElementById('inscripcionFecha').value;

    const url = action === 'editar' ? `http://127.0.0.1:8000/inscripciones/${id}` : 'http://127.0.0.1:8000/inscripciones';
    const method = action === 'editar' ? 'PUT' : 'POST';
    const body = JSON.stringify({ id: id, evento_id: evento_id, usuario_id: usuario_id, fecha_inscripción: fecha_inscripcion });

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: body
    })
    .then(response => {
        if (response.ok) {
            $('#inscripcionModal').modal('hide');
            loadInscripciones();
            document.getElementById('inscripcionForm').reset(); // Restablecer el formulario después de guardarlo
        } else {
            alert('Error al guardar la inscripción.');
        }
    })
    .catch(error => {
        console.error('Error al guardar la inscripción:', error);
        alert('Error al guardar la inscripción.');
    });
}

// Función para eliminar una inscripción
function deleteInscripcion(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta inscripción?')) {
        fetch(`http://127.0.0.1:8000/inscripciones/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}` // Añadir token JWT a la cabecera
            }
        })
        .then(response => {
            if (response.ok) {
                loadInscripciones(); // Volver a cargar inscripciones después de eliminar
            } else {
                alert('Error al eliminar la inscripción');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al eliminar la inscripción');
        });
    }
}

// Función para editar una inscripción
function editInscripcion(id) {
    // Obtener la inscripción específica por su ID
    fetch(`http://127.0.0.1:8000/inscripciones/${id}`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    })
    .then(response => response.json())
    .then(inscripcion => {
        // Llenar el formulario con los datos de la inscripción
        document.getElementById('inscripcionId').value = inscripcion.id;
        document.getElementById('inscripcionUsuarioId').value = inscripcion.usuario_id;
        document.getElementById('inscripcionEventoId').value = inscripcion.evento_id;
        document.getElementById('inscripcionFecha').value = inscripcion.fecha_inscripción;

        // Cambiar título del modal y atributo 'data-action'
        const modalTitle = document.getElementById('inscripcionModalLabel');
        modalTitle.textContent = 'Editar Inscripción';
        document.getElementById('inscripcionForm').setAttribute('data-action', 'editar');

        // Mostrar el modal de inscripción
        $('#inscripcionModal').modal('show');
    })
    .catch(error => {
        console.error('Error al cargar la inscripción para editar:', error);
        alert('Error al cargar la inscripción para editar.');
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

// Cargar inscripciones al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    checkTokenAndLoad(); // Verificar token al cargar la página

    // Asignar el evento submit al formulario de inscripción
    document.getElementById('inscripcionForm').addEventListener('submit', guardarInscripcion);
});

// Función para mostrar el modal de creación
function showCreateModal() {
    // Restablecer el formulario y los valores
    document.getElementById('inscripcionForm').reset();
    document.getElementById('inscripcionModalLabel').textContent = 'Crear Inscripción';
    document.getElementById('inscripcionForm').setAttribute('data-action', 'crear');
    $('#inscripcionModal').modal('show');
}
