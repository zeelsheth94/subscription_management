// upcoming_payment.js
document.addEventListener('DOMContentLoaded', function() {
    const upcomingPaymentsTableBody = document.getElementById('upcomingPaymentsTableBody');
    const upcomingPaymentsTable = document.getElementById('upcomingPaymentsTable');
    const noUpcomingMessage = document.getElementById('no-upcoming-message');
    const loadingMessage = document.getElementById('loading-message');
    const totalUpcomingPaymentsDiv = document.getElementById('total-upcoming-payments');
    const totalAmountSpan = document.getElementById('totalAmount');

    function fetchAndRenderUpcomingPayments() {
        loadingMessage.classList.remove('hidden');
        upcomingPaymentsTable.classList.add('hidden');
        noUpcomingMessage.classList.add('hidden');
        totalUpcomingPaymentsDiv.classList.add('hidden');
        upcomingPaymentsTableBody.innerHTML = '';

        fetch('../backend/get_subscriptions.php?status=Active') // Corrected path to backend
            .then(response => response.json())
            .then(data => {
                loadingMessage.classList.add('hidden');
                let totalUpcomingAmount = 0;
                const currentDate = new Date();
                const thirtyDaysLater = new Date();
                thirtyDaysLater.setDate(currentDate.getDate() + 30); // Date 30 days from now

                const upcomingSubscriptions = data.success ? data.subscriptions.filter(sub => {
                    if (sub.end_date === null || sub.end_date === 'N/A') {
                        return false;
                    }
                    const endDate = new Date(sub.end_date);
                    return endDate > currentDate && endDate <= thirtyDaysLater;
                }) : [];

                if (upcomingSubscriptions.length > 0) {
                    upcomingPaymentsTable.classList.remove('hidden');
                    upcomingSubscriptions.forEach(sub => {
                        const row = upcomingPaymentsTableBody.insertRow();
                        row.insertCell().textContent = sub.plan_name;
                        row.insertCell().textContent = sub.amount !== null ? `₹${parseFloat(sub.amount).toFixed(2)}` : 'N/A';
                        row.insertCell().textContent = sub.end_date;
                        const statusCell = row.insertCell();
                        statusCell.textContent = sub.status;
                        statusCell.classList.add(`status-${sub.status.toLowerCase()}`);

                        if (sub.amount !== null) {
                            totalUpcomingAmount += parseFloat(sub.amount);
                        }
                    });
                    totalAmountSpan.textContent = totalUpcomingAmount.toFixed(2);
                    totalUpcomingPaymentsDiv.classList.remove('hidden');
                } else {
                    noUpcomingMessage.classList.remove('hidden');
                }
            })
            .catch(error => {
                loadingMessage.classList.add('hidden');
                noUpcomingMessage.classList.remove('hidden');
                noUpcomingMessage.textContent = 'Error loading upcoming payments. Please try again later.';
                console.error('Error fetching upcoming payments:', error);
            });
    }

    fetchAndRenderUpcomingPayments();

    document.getElementById('backToDashboardBtn').addEventListener('click', function() {
        window.location.href = 'home.html'; // Stays in frontend folder
    });
});