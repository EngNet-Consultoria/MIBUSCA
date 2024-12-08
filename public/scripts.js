async function generateCode() {
    const response = await fetch('/api/generate-code', { method: 'POST' });
    const data = await response.json();
    document.getElementById('userCode').value = data.userCode;
    alert('Code generated: ' + data.userCode);
  }
  
  async function authorizeStore() {
    const userCode = document.getElementById('userCode').value;
    const response = await fetch('/api/authorize-store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userCode }),
    });
    const data = await response.json();
    alert(data.message);
  }
  
  async function saveAuthCode() {
    const userCode = document.getElementById('userCode').value;
    const authCode = document.getElementById('authCode').value;
    const response = await fetch('/api/save-authorization-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userCode, authCode }),
    });
    const data = await response.json();
    alert(data.message);
  }
  
  async function generateAccessToken() {
    const userCode = document.getElementById('userCode').value;
    const response = await fetch('/api/generate-access-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userCode }),
    });
    const data = await response.json();
    document.getElementById('accessToken').value = data.accessToken;
    alert('Access token generated: ' + data.accessToken);
  }
  