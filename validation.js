// validation.js

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const successMessage = document.getElementById('successMessage');

    // Function to display error messages
    const showError = (element, message) => {
        const errorDiv = element.nextElementSibling; // Get the div with class 'error'
        if (errorDiv && errorDiv.classList.contains('error')) {
            errorDiv.textContent = message;
            element.classList.add('border-red-500'); // Add red border for error
            element.classList.remove('focus:ring-blue-500'); // Remove blue ring on error
            element.classList.add('focus:ring-red-500'); // Add red ring on error
        }
    };

    // Function to clear error messages
    const clearError = (element) => {
        const errorDiv = element.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error')) {
            errorDiv.textContent = '';
            element.classList.remove('border-red-500'); // Remove red border
            element.classList.add('border-gray-300'); // Restore default border
            element.classList.remove('focus:ring-red-500'); // Remove red ring
            element.classList.add('focus:ring-blue-500'); // Restore blue ring
        }
    };

    // Validate username
    const validateUsername = () => {
        const username = usernameInput.value.trim();
        if (username.length < 3) {
            showError(usernameInput, 'Username must be at least 3 characters long.');
            return false;
        }
        clearError(usernameInput);
        return true;
    };

    // Validate email
    const validateEmail = () => {
        const email = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showError(emailInput, 'Please enter a valid email address.');
            return false;
        }
        clearError(emailInput);
        return true;
    };

    // Validate password
    const validatePassword = () => {
        const password = passwordInput.value.trim();
        if (password.length < 6) {
            showError(passwordInput, 'Password must be at least 6 characters long.');
            return false;
        }
        clearError(passwordInput);
        return true;
    };

    // Add event listeners for real-time validation
    usernameInput.addEventListener('input', validateUsername);
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);

    // Handle form submission
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        // Run all validations
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        // If all validations pass, simulate registration and redirect
        if (isUsernameValid && isEmailValid && isPasswordValid) {
            // Simulate successful registration (e.g., send data to a server in a real app)
            console.log('Form submitted successfully!');
            console.log('Username:', usernameInput.value);
            console.log('Email:', emailInput.value);
            console.log('Password:', passwordInput.value);

            // Show success message
            successMessage.classList.remove('hidden');

            // Redirect to login.html after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000); // 2000 milliseconds = 2 seconds
        } else {
            console.log('Form validation failed. Please correct the errors.');
        }
    });
});
