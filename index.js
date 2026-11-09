require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// Starts the LocalLoop backend server
app.listen(PORT, () => {
    console.log(`LocalLoop server running on port ${PORT}`);
});