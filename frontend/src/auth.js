const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export const login = async (username, password) => {
  const res = await fetch('/api/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  localStorage.setItem(TOKEN_KEY, data.access);
  localStorage.setItem(REFRESH_KEY, data.refresh);
  return data;
};

export const register = async (username, email, password) => {
  const res = await fetch('/api/auth/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);