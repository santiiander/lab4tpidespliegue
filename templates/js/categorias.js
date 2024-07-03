

// Función para cargar y mostrar categorías
function loadCategories() {
    fetch('http://127.0.0.1:8000/categorias', {
        headers: {
            'Authorization': `Bearer ${getToken()}` // Obtener token JWT y añadirlo a la cabecera
        }
    })
    .then(response => response.json())
    .then(data => {
        // Limpiar tabla antes de agregar datos nuevos
        const tableBody = document.getElementById('categoriaTableBody');
        tableBody.innerHTML = '';

        // Agregar cada categoría a la tabla
        data.forEach(categoria => {
            const row = `
                <tr>
                    <td>${categoria.id}</td>
                    <td>${categoria.nombre}</td>
                    <td>${categoria.descripcion}</td>
                    <td>
                        <button type="button" class="btn btn-info btn-sm" onclick="editCategoria(${categoria.id})">Editar</button>
                        <button type="button" class="btn btn-danger btn-sm" onclick="deleteCategoria(${categoria.id})">Eliminar</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => {
        console.error('Error al cargar categorías:', error);
    });
}

// Función para crear o editar categorías
// Función para crear o editar categorías
function guardarCategoria(event) {
    event.preventDefault();
    const action = document.getElementById('categoriaForm').getAttribute('data-action');
    const id = Math.floor(Math.random() * (100000 - 100 + 1)) + 100;
    const nombre = document.getElementById('categoriaNombre').value;
    const descripcion = document.getElementById('categoriaDescripcion').value;

    const url = action === 'editar' ? `http://127.0.0.1:8000/categorias/${id}` : 'http://127.0.0.1:8000/categorias';
    const method = action === 'editar' ? 'PUT' : 'POST';
    const body = JSON.stringify({ id: id, nombre: nombre, descripcion: descripcion });

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
            $('#categoriaModal').modal('hide');
            loadCategories();
        } else {
            alert('Error al guardar la categoría.');
        }
    })
    .catch(error => {
        console.error('Error al guardar la categoría:', error);
        alert('Error al guardar la categoría.');
    });
}


// Función para eliminar una categoría
function deleteCategoria(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
        fetch(`http://127.0.0.1:8000/categorias/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}` // Añadir token JWT a la cabecera
            }
        })
        .then(response => {
            if (response.ok) {
                loadCategories(); // Volver a cargar categorías después de eliminar
            } else {
                alert('Error al eliminar la categoría');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al eliminar la categoría');
        });
    }
}

function editCategoria(id) {
    // Obtener la categoría específica por su ID
    fetch(`http://127.0.0.1:8000/categorias/${id}`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`
        }
    })
    .then(response => response.json())
    .then(categoria => {
        // Llenar el formulario con los datos de la categoría
        document.getElementById('categoriaId').value = categoria.id;
        document.getElementById('categoriaNombre').value = categoria.nombre;
        document.getElementById('categoriaDescripcion').value = categoria.descripcion;

        // Cambiar título del modal y atributo 'data-action'
        const modalTitle = document.getElementById('categoriaModalLabel');
        modalTitle.textContent = 'Editar Categoría';
        document.getElementById('categoriaForm').setAttribute('data-action', 'editar');

        // Mostrar el modal de categoría
        $('#categoriaModal').modal('show');
    })
    .catch(error => {
        console.error('Error al cargar la categoría para editar:', error);
        alert('Error al cargar la categoría para editar.');
    });
}
function checkTokenAndLoad() {
    const token = getToken();
    if (!token) {
        // Redirigir al usuario al login si no hay token
        window.location.href = '/templates/login.html'; // Ajusta la ruta según tu aplicación
    } else {
        loadCategories(); // Cargar las inscripciones si hay un token válido
    }
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

// Cargar categorías al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    checkTokenAndLoad(); // Verificar token al cargar la página
    loadCategories();
});


