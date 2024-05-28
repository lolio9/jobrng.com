document.addEventListener("DOMContentLoaded", () => {
    const totalServersElement = document.getElementById('total-servers');
    const totalUsersElement = document.getElementById('total-users');
    const totalCommandsElement = document.getElementById('total-commands');

    // Simulating data fetch and update
    setTimeout(() => {
        totalServersElement.textContent = '1,234';
        totalUsersElement.textContent = '12,345';
        totalCommandsElement.textContent = '123,456';
    }, 1000);
});
