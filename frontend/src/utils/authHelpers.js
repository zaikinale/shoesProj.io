export const clearUserSession = () => {
    localStorage.clear();
    sessionStorage.clear();
    
    const cookiesToClear = ['access_token', 'token', 'refreshToken'];
    cookiesToClear.forEach(name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}; SameSite=Lax`;
    });
};