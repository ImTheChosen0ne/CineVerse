const config = {
    apiUrl: process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_BACKEND_URL
        : 'http://localhost:3000',
};

export default config;