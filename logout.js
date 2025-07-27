document.addEventListener('DOMContentLoaded', () => {
    // --- Existing logic for active subscription (keep this) ---
    const hasActiveSubscription = true; // Still simulating this for the example
    const subscriberContent = document.getElementById('subscriber-content');
    const nonSubscriberMessage = document.getElementById('non-subscriber-message');

    if (hasActiveSubscription) {
        subscriberContent.style.display = 'block';
        nonSubscriberMessage.style.display = 'none';
        console.log("User has an active subscription. Displaying premium content.");
    } else {
        subscriberContent.style.display = 'none';
        nonSubscriberMessage.style.display = 'block';
        console.log("User does not have an active subscription. Prompting to subscribe/login.");
    }

    // --- NEW LOGIC FOR LOGOUT ---

    // 1. Get a reference to your logout link/button
    //    Make sure your logout link in HTML has an ID, e.g., <a id="logout-link" href="#">Logout</a>
    const logoutLink = document.getElementById('logout-link');

    // 2. Add an event listener to the logout link
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default link behavior (e.g., navigating to '#')

            console.log("Logout initiated...");

            // 3. Perform client-side cleanup
            //    Remove any stored authentication tokens or user data
            localStorage.removeItem('authToken');     // Example: remove token from localStorage
            sessionStorage.removeItem('userSession'); // Example: remove session data from sessionStorage
            // For cookies, if you're managing them via JS, you might clear specific ones
            // document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            // 4. (Optional but Recommended) Make a request to your backend to invalidate the session
            //    This is crucial for security in a real application.
            /*
            fetch('/api/logout', {
                method: 'POST', // Or GET, depending on your API design
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${previousAuthToken}` // Send token if backend needs it to invalidate
                }
            })
            .then(response => {
                if (response.ok) {
                    console.log("Session invalidated on server.");
                } else {
                    console.error("Failed to invalidate session on server.");
                }
            })
            .catch(error => console.error("Error during server-side logout:", error))
            .finally(() => {
                // 5. Redirect to the login page AFTER cleanup (and optional API call)
                window.location.href = '/login.html'; // Adjust this path to your actual login page
            });
            */

            // For this frontend-only example, we'll directly redirect after client-side cleanup
            // If you uncomment the fetch above, move this line inside the .finally() block
            window.location.href = '/login.html'; // **IMPORTANT: Change this to your actual login page path!**
        });
    } else {
        console.warn("Logout link with ID 'logout-link' not found.");
    }
});