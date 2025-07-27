// active_subscription.js
document.addEventListener('DOMContentLoaded', function() {
    const activeSubscriptionsContent = document.getElementById('active-subscriptions-content');
    const noActiveMessage = document.getElementById('no-active-message');
    const activeSubscriptionTable = document.getElementById('activeSubscriptionTable');
    const activeSubscriptionTableBody = document.getElementById('activeSubscriptionTableBody');
    const nonSubscriberMessage = document.getElementById('non-subscriber-message');
    const pageTitle = document.querySelector('h1');

    function renderActiveSubscriptions() {
        activeSubscriptionTableBody.innerHTML = ''; // Clear previous entries

        // Fetch active subscriptions from the backend
        fetch('../backend/get_subscriptions.php?status=Active') // Corrected path to backend
        .then(response => response.json())
        .then(data => {
            if (data.success && data.subscriptions.length > 0) {
                noActiveMessage.classList.add('hidden'); // Hide "no active subscriptions" message
                activeSubscriptionTable.classList.remove('hidden'); // Show the table
                nonSubscriberMessage.style.display = 'none'; // Hide general non-subscriber message/CTA
                pageTitle.textContent = 'Your Active Subscriptions'; // Update title

                data.subscriptions.forEach(sub => {
                    const row = activeSubscriptionTableBody.insertRow(); // Insert a new row
                    row.insertCell().textContent = sub.user_id; // Add User ID (from PHP backend)
                    row.insertCell().textContent = sub.plan_name; // Add Plan Name
                    row.insertCell().textContent = sub.start_date; // Add Start Date
                    row.insertCell().textContent = sub.end_date === null ? 'N/A' : sub.end_date; // Add End Date

                    const statusCell = row.insertCell(); // Add Status
                    statusCell.textContent = sub.status;
                    if (sub.status === 'Active') {
                        statusCell.classList.add('status-active');
                    }

                    row.insertCell().textContent = sub.amount !== null ? `₹${parseFloat(sub.amount).toFixed(2)}` : 'N/A'; // Add Amount
                });
            } else {
                noActiveMessage.classList.remove('hidden'); // Show "no active subscriptions" message
                activeSubscriptionTable.classList.add('hidden'); // Hide the table
                nonSubscriberMessage.style.display = 'block'; // Show general non-subscriber message/CTA
                pageTitle.textContent = 'No Active Subscriptions'; // Update title
            }
        })
        .catch(error => {
            console.error('Error fetching active subscriptions:', error);
            noActiveMessage.textContent = 'Could not load active subscriptions. Please try again.';
            noActiveMessage.classList.remove('hidden');
            activeSubscriptionTable.classList.add('hidden');
            nonSubscriberMessage.style.display = 'none';
            pageTitle.textContent = 'Error Loading Subscriptions';
        });
    }

    // Initial render when the page loads
    renderActiveSubscriptions();

    // Button event listeners
    document.getElementById('addNewSubscriptionBtn').addEventListener('click', function() {
        window.location.href = 'add_subscription.html'; // Stays in frontend folder
    });

    document.getElementById('viewAllSubscriptionsBtn').addEventListener('click', function() {
        window.location.href = 'summary.html'; // Stays in frontend folder
    });
});