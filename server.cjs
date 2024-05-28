const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    const clientId = '1242268554699604078';
    const clientSecret = 'q2nYfRaK2AKDJQJb80MVC5zVjUVb7IBg';
    const redirectUri = 'http://localhost:3000/callback';

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);

    try {
        const response = await axios.post('https://discord.com/api/oauth2/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const data = response.data;
        res.redirect(`/profile?token=${data.access_token}`);
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        res.status(500).send('An error occurred');
    }
});

app.get('/profile', async (req, res) => {
    const token = req.query.token;

    try {
        const response = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const profile = response.data;
        res.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send('An error occurred');
    }
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
