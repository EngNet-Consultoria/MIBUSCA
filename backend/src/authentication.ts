
import axios from 'axios';

export async function authenticate(): Promise<string | undefined> {
    try {
        const response = await axios.post('https://api.ifood.com.br/oauth/token', {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'client_credentials'
        });

        console.log('Access token:', response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        console.error('Authentication error:', error.message);
    }
}