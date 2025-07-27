// frontend/register_validation.js
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const registerMessage = document.getElementById('registerMessage');

    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Function to display field-specific error messages
    const showFieldError = (element, message) => {
        element.textContent = message;
        element.style.display = 'block';
    };

    // Function to clear field-specific error messages
    const clearFieldError = (element) => {
        element.textContent = '';
        element.style.display = 'none';
    };

    // Function to display general messages (success/error)
    const showGeneralMessage = (element, message, isError = false) => {
        element.textContent = message;
        if (isError) {
            element.classList.remove('hidden', 'success');
            element.classList.add('error');
        } else {
            element.classList.remove('hidden', 'error');
            element.classList.add('success');
        }
    };

    // Function to hide general messages
    const hideGeneralMessage = (element) => {
        element.classList.add('hidden');
        element.textContent = '';
    };

    // Validate username
    const validateUsername = () => {
        const username = usernameInput.value.trim();
        if (username.length < 3) {
            showFieldError(usernameError, 'Username must be at least 3 characters long.');
            return false;
        }
        clearFieldError(usernameError);
        return true;
    };

    // Validate email
    const validateEmail = () => {
        const email = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showFieldError(emailError, 'Please enter a valid email address.');
            return false;
        }
        clearFieldError(emailError);
        return true;
    };

    // Validate password
    const validatePassword = () => {
        const password = passwordInput.value.trim();
        if (password.length < 6) {
            showFieldError(passwordError, 'Password must be at least 6 characters long.');
            return false;
        }
        clearFieldError(passwordError);
        return true;
    };

    // Add event listeners for real-time validation feedback
    usernameInput.addEventListener('input', validateUsername);
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);

    // Handle form submission
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        hideGeneralMessage(registerMessage);
        clearFieldError(usernameError);
        clearFieldError(emailError);
        clearFieldError(passwordError);


        // Run all client-side validations
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        // If client-side validations pass, attempt backend registration
        if (isUsernameValid && isEmailValid && isPasswordValid) {
            const username = usernameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;

            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);

            try {
                const response = await fetch('../backend/register.php', { // Corrected path to backend
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok && data.success) { // Check for successful response and data.success flag
                    console.log('Registration successful!', data);
                    showGeneralMessage(registerMessage, 'Registration successful! You can now log in.', false);
                    registerForm.reset(); // Clear the form
                    // Optionally redirect to login page after success
                    setTimeout(() => {
                        window.location.href = 'login.html'; // Redirect to login page
                    }, 2000);
                } else {
                    // Handle registration failure from backend
                    console.error('Registration failed:', data.message || 'Unknown error');
                    showGeneralMessage(registerMessage, data.message || 'Registration failed. Please try again.', true);
                }
            } catch (error) {
                console.error('Error during registration fetch:', error);
                showGeneralMessage(registerMessage, 'An error occurred during registration. Please try again later.', true);
            }
        } else {
            showGeneralMessage(registerMessage, 'Please correct the errors in the form.', true);
        }
    });
});