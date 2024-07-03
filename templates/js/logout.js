// logout.js

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/templates;';
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/templates/login.html;';
}


function logout() {
    alert('Logging out');  // Añadir alerta para ver si la función se ejecuta
    console.log('Logging out');
    // Eliminar la cookie del token
    deleteCookie('token');
    // Redirigir al usuario al login
    window.location.href = '/templates/login.html';
}

