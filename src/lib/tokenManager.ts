let currentToken: string | null = null;

export function setToken(token: string | null) {
  currentToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
}

export function getToken(): string | null {
  if (currentToken !== null) {
    return currentToken;
  }

  if (typeof window !== 'undefined') {
    currentToken = localStorage.getItem('token');
  }

  return currentToken;
}

export function clearToken() {
  setToken(null);
}
