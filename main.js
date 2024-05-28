function loginWithDiscord() {
    const clientId = '1242268554699604078';
    const redirectUri = 'http://localhost:3000/callback';
    const scope = 'identify email guilds applications.commands.permissions.update';
    const responseType = 'code';

    const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
    window.location.href = url;
}

async function fetchProfile(token) {
    try {
        console.log('Fetching profile with token:', token);
        const response = await fetch(`/profile?token=${token}`);
        const data = await response.json();
        console.log('Profile data:', data);

        const profile = document.querySelector('.profile');
        const loginBtn = document.querySelector('.login-btn');

        if (data.id) {
            profile.innerHTML = `
                <img src="https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png" alt="${data.username}">
                <span>@${data.username}</span>
                <button class="logout-btn" onclick="logout()">Logout</button>
            `;
            profile.style.display = 'flex';
            loginBtn.style.display = 'none';
        } else {
            console.log('Profile data does not contain an ID.');
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

function getTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    console.log('Extracted token from URL:', token);
    return token;
}

function logout() {
    document.querySelector('.profile').style.display = 'none';
    document.querySelector('.login-btn').style.display = 'block';
    window.history.pushState({}, document.title, "/");
}

window.onload = function() {
    const token = getTokenFromUrl();
    if (token) {
        fetchProfile(token);
    }
}
