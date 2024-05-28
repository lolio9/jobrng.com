const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.use(express.json());

const clientId = '1242268554699604078';
const clientSecret = 'q2nYfRaK2AKDJQJb80MVC5zVjUVb7IBg';
const redirectUri = 'http://localhost:3000/callback';

app.get('/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).send('No code provided');
    }

    try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
            }),
        });

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Fetch user profile data
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const userData = await userResponse.json();

        // Log user data to the terminal (not sent to the client)
        console.log(userData);

        // Redirect back to front-end without exposing profile data
        res.redirect('/?loggedIn=true');
    } catch (error) {
        console.error('Error during Discord OAuth2 process:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
