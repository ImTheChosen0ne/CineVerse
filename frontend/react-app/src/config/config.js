const config = {
    apiUrl: process.env.NODE_ENV === 'production'
        ? `https://${process.env.REACT_APP_BACKEND_URL}.onrender.com`
        : 'http://localhost:3000',
    recUrl: process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_RECOMMENDER_URL
        : 'http://localhost:5000',
};

export default config;