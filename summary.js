// summary.js
document.addEventListener('DOMContentLoaded', function() {
    const subscriptionsTableBody = document.getElementById('subscriptionsTableBody');
    const subscriptionsTable = document.getElementById('subscriptionsTable');
    const noSubscriptionsMessage = document.getElementById('no-subscriptions-message');
    const loadingMessage = document.getElementById('loading-message');

    // Custom alert function (replicated from your existing files for consistency)
    const customAlert = (message, type = 'info') => {
        const existingAlert = document.getElementById('custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertDiv = document.createElement('div');
        alertDiv.id = 'custom-alert';
        let bgColor = 'bg-gray-600';
        let btnColor = 'bg-blue-600';
        let btnHoverColor = 'hover:bg-blue-700';

        if (type === 'error') {
            bgColor = 'bg-red-600';
            btnColor = 'bg-red-700';
            btnHoverColor = 'hover:bg-red-800';
        } else if (type === 'success') {
            bgColor = 'bg-green-600';
            btnColor = 'bg-green-700';
            btnHoverColor = 'hover:bg-green-800';
        }

        alertDiv.className = `fixed inset-0 ${bgColor} bg-opacity-50 flex items-center justify-center z-50`;
        alertDiv.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
                <p class="text-lg font-semibold text-gray-800 mb-4">${message}</p>
                <button id="alert-ok-btn" class="${btnColor} ${btnHoverColor} text-white font-bold py-2 px-4 rounded-md">OK</button>
            </div>
        `;
        document.body.appendChild(alertDiv);

        document.getElementById('alert-ok-btn').addEventListener('click', function() {
            alertDiv.remove();
        });
    };

    function fetchAndRenderSubscriptions() {
        loadingMessage.classList.remove('hidden');
        subscriptionsTable.classList.add('hidden');
        noSubscriptionsMessage.classList.add('hidden');
        subscriptionsTableBody.innerHTML = ''; // Clear existing rows

        // Fetch ALL subscriptions for the logged-in user
        fetch('../backend/get_subscriptions.php?status=all') // Corrected path to backend
            .then(response => response.json())
            .then(data => {
                loadingMessage.classList.add('hidden');
                if (data.success && data.subscriptions.length > 0) {
                    subscriptionsTable.classList.remove('hidden');
                    data.subscriptions.forEach(sub => {
                        const row = subscriptionsTableBody.insertRow();
                        row.insertCell().textContent = sub.user_id;
                        row.insertCell().textContent = sub.plan_name;
                        row.insertCell().textContent = sub.start_date;
                        row.insertCell().textContent = sub.end_date === null ? 'N/A' : sub.end_date;
                        const statusCell = row.insertCell();
                        statusCell.textContent = sub.status;
                        statusCell.classList.add(`status-${sub.status.toLowerCase()}`);
                        row.insertCell().textContent = sub.amount !== null ? `₹${parseFloat(sub.amount).toFixed(2)}` : 'N/A';

                        // Actions cell for Edit and Delete buttons
                        const actionsCell = row.insertCell();
                        actionsCell.classList.add('actions-cell');

                        const editButton = document.createElement('button');
                        editButton.innerHTML = '<span class="material-symbols-outlined">edit</span>';
                        editButton.classList.add('action-btn', 'edit-btn');
                        editButton.title = 'Edit Subscription';
                        editButton.addEventListener('click', () => {
                            window.location.href = 'edit_subscription.html?id=' + sub.id; // Stays in frontend folder
                        });
                        actionsCell.appendChild(editButton);

                        const deleteButton = document.createElement('button');
                        deleteButton.innerHTML = '<span class="material-symbols-outlined">delete</span>';
                        deleteButton.classList.add('action-btn', 'delete-btn');
                        deleteButton.title = 'Delete Subscription';
                        deleteButton.addEventListener('click', () => {
                            if (confirm('Are you sure you want to delete this subscription?')) {
                                deleteSubscription(sub.id);
                            }
                        });
                        actionsCell.appendChild(deleteButton);
                    });
                } else {
                    noSubscriptionsMessage.classList.remove('hidden');
                }
            })
            .catch(error => {
                loadingMessage.classList.add('hidden');
                noSubscriptionsMessage.classList.remove('hidden');
                noSubscriptionsMessage.textContent = 'Error loading subscriptions. Please try again later.';
                console.error('Error fetching subscriptions:', error);
            });
    }

    function deleteSubscription(id) {
        const formData = new FormData();
        formData.append('action', 'delete');
        formData.append('id', id);

        fetch('../backend/manage_subscription.php', { // Corrected path to backend
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                customAlert('Subscription deleted successfully!', 'success');
                fetchAndRenderSubscriptions(); // Re-render the list after deletion
            } else {
                customAlert('Error deleting subscription: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            customAlert('An error occurred during deletion.', 'error');
        });
    }

    // Initial load
    fetchAndRenderSubscriptions();

    // Button event listeners
    document.getElementById('addNewSubscriptionBtn').addEventListener('click', function() {
        window.location.href = 'add_subscription.html'; // Stays in frontend folder
    });

    document.getElementById('backToDashboardBtn').addEventListener('click', function() {
        window.location.href = 'home.html'; // Stays in frontend folder
    });
});