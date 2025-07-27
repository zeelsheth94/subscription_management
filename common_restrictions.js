// frontend/common_restrictions.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if the user is logged in by checking sessionStorage
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (!isLoggedIn) {
        // If not logged in, redirect to the login page
        window.location.href = 'login.html'; // Assuming login.html is in the same directory
    }
});