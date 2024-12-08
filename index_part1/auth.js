const axios = require('axios');

async function authenticate() {
  try {
    const response = await axios.post('https://api.ifood.com.br/oauth/token', {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'client_credentials'
    });

    console.log('Token de acesso:', response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error('Erro na autenticação:', error.message);
  }
}

module.exports = authenticate;
