const API_URL = 'http://localhost:8000/auth';

export const login = async (email, senha) => {
    const response = await fetch('${API_URL}/login',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) throw new Error('Falha no login');
    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    return data;
};

export const logout = () => {
    localStorage.removeItem('token');
};