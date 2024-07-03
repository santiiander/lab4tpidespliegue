// Función para verificar si existe el token JWT en las cookies
function checkTokenAndLoad() {
    const token = getToken();
    if (!token) {
        // Redirigir al usuario al login si no hay token
        window.location.href = '/templates/login.html'; // Ajusta la ruta según tu aplicación
    } 
}

document.addEventListener('DOMContentLoaded', function() {
    checkTokenAndLoad(); // Verificar token al cargar la página
    // Obtener y mostrar el token JWT
    const token = getToken();

    // Fetch para obtener la cantidad de eventos
    fetch('http://127.0.0.1:8000/eventos/cantidad', {
        headers: {
            'Authorization': `Bearer ${token}` // Añadir token JWT a la cabecera
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const totalEventosElement = document.getElementById('totalEventos');
        if (totalEventosElement) {
            totalEventosElement.textContent = data["Cantidad Eventos"];
        } else {
            console.error('Elemento totalEventos no encontrado.');
        }
    })
    .catch(error => {
        console.error('Error al cargar la cantidad de eventos:', error);
        //alert('Ocurrió un error al cargar la cantidad de eventos');
    });

    // Fetch para obtener las inscripciones activas
    fetch('http://127.0.0.1:8000/inscripciones_activas', {
        headers: {
            'Authorization': `Bearer ${token}` // Añadir token JWT a la cabecera
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const inscripcionesActivasElement = document.getElementById('inscripcionesActivas');
        if (inscripcionesActivasElement) {
            inscripcionesActivasElement.textContent = data["Cantidad de Inscripciones Activas"];
        } else {
            console.error('Elemento inscripcionesActivas no encontrado.');
        }
    })
    .catch(error => {
        console.error('Error al cargar las inscripciones activas:', error);
        //alert('Ocurrió un error al cargar las inscripciones activas');
    });

    // Fetch para obtener el promedio de usuarios por evento
    fetch('http://127.0.0.1:8000/inscripciones_promedio', {
        headers: {
            'Authorization': `Bearer ${token}` // Añadir token JWT a la cabecera
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const promedioUsuariosElement = document.getElementById('promedioUsuarios');
        if (promedioUsuariosElement) {
            promedioUsuariosElement.textContent = data["promedio_inscripciones"];
        } else {
            console.error('Elemento promedioUsuarios no encontrado.');
        }
    })
    .catch(error => {
        console.error('Error al cargar el promedio de usuarios por evento:', error);
        //alert('Ocurrió un error al cargar el promedio de usuarios por evento');
    });

    // Fetch para obtener el evento con más inscripciones
    fetch('http://127.0.0.1:8000/inscripciones_evento_mas_inscripciones', {
        headers: {
            'Authorization': `Bearer ${token}` // Añadir token JWT a la cabecera
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const eventoMasInscripcionesNombreElement = document.getElementById('eventoMasInscripcionesNombre');
        const eventoMasInscripcionesCantidadElement = document.getElementById('eventoMasInscripcionesCantidad');
        if (eventoMasInscripcionesNombreElement && eventoMasInscripcionesCantidadElement) {
            eventoMasInscripcionesNombreElement.textContent = data.nombre;
            eventoMasInscripcionesCantidadElement.textContent = data.num_inscripciones;
        } else {
            console.error('Elementos eventoMasInscripciones no encontrados.');
        }
    })
    .catch(error => {
        console.error('Error al cargar el evento con más inscripciones:', error);
        //alert('Ocurrió un error al cargar el evento con más inscripciones');
    });
});

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
