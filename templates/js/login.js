// Function to handle form submission
$(document).ready(function() {
    $('#loginForm').on('submit', function(event) {
        event.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();

        $.ajax({
            url: 'http://127.0.0.1:8000/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email: email, password: password }),
            success: function(response) {
                document.cookie = `token=${response.token}; Secure; SameSite=Strict`;
                window.location.href = '/templates/dashboard.html';  // Redirigir al dashboard después del login
            },
            error: function(xhr, status, error) {
                alert('Login failed: ' + xhr.responseJSON.detail);
            }
        });
    });
});
