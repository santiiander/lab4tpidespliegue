document.addEventListener('DOMContentLoaded', function() {
    listarUsuarios();
});

const token = getCookie('token'); // Suponiendo que el token JWT está almacenado en una cookie llamada 'token'

// Función para obtener el token JWT de una cookie
function getCookie(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        return match[2];
    } else {
        console.log('Cookie no encontrada');
        return null;
    }
}

// Función para listar usuarios
async function listarUsuarios() {
    try {
        const response = await fetch('http://127.0.0.1:8000/usuarios', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 403) {
            console.error('Error 403: Acceso denegado. Asegúrate de que estás autenticado.');
            return;
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            console.error('La respuesta de la API no es un array:', data);
            return;
        }

        const usuarioTableBody = document.getElementById('usuarioTableBody');
        usuarioTableBody.innerHTML = '';

        data.forEach(usuario => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarUsuario(${usuario.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                </td>
            `;
            usuarioTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al listar usuarios:', error);
    }
}

// Función para guardar usuario
document.getElementById('usuarioForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('usuarioId').value;
    const nombre = document.getElementById('usuarioNombre').value;
    const email = document.getElementById('usuarioEmail').value;
    const rol = document.getElementById('usuarioRol').value;
    const password = document.getElementById('usuarioPassword').value;

    if (password.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres.');
        return;
    }

    const usuario = {
        id: id ? parseInt(id) : Math.floor(Math.random() * (1000 - 100) + 100),
        nombre,
        email,
        rol,
        password
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `http://127.0.0.1:8000/usuarios/${id}` : 'http://127.0.0.1:8000/usuarios';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(usuario)
        });

        if (response.status === 403) {
            console.log('Error 403: Acceso denegado. Asegúrate de que estás autenticado.');
            return;
        }

        const data = await response.json();
        console.log('Usuario guardado:', data.detail);
        listarUsuarios();
        $('#usuarioModal').modal('hide');
    } catch (error) {
        console.log('Error al guardar el usuario:', error.detail);
    } finally {
        // Limpiar el formulario después de guardar
        limpiarFormulario();
    }
});

// Función para limpiar el formulario
function limpiarFormulario() {
    document.getElementById('usuarioId').value = '';
    document.getElementById('usuarioNombre').value = '';
    document.getElementById('usuarioEmail').value = '';
    document.getElementById('usuarioRol').value = 'Cliente'; // Valor por defecto
    document.getElementById('usuarioPassword').value = '';
}

// Función para editar usuario
async function editarUsuario(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/usuarios/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 403) {
            alert('Error 403: Acceso denegado. Asegúrate de que estás autenticado.');
            return;
        }

        const data = await response.json();

        document.getElementById('usuarioId').value = data.id;
        document.getElementById('usuarioNombre').value = data.nombre;
        document.getElementById('usuarioEmail').value = data.email;
        document.getElementById('usuarioRol').value = data.rol;
        document.getElementById('usuarioPassword').value = ''; // No mostrar la contraseña actual

        $('#usuarioModal').modal('show');
    } catch (error) {
        console.error('Error al cargar el usuario para editar:', error);
    }
}

// Función para eliminar usuario
async function eliminarUsuario(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/usuarios/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 403) {
            console.error('Error 403: Acceso denegado. Asegúrate de que estás autenticado.');
            return;
        }

        const data = await response.json();
        console.log('Usuario eliminado:', data);
        listarUsuarios();
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
    }
}
