const express = require('express')
const sequelize = require('./config/database')
const pokemonRoutes = require('./routes/pokemon')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json())
app.use(express.json());

app.use('/poke', pokemonRoutes);

sequelize.sync()
.then(() => {
    console.log('Database Synced');
    app.listen(PORT, '192.168.148.188', () => console.log(`Server running on ${PORT}`));
})
.catch(error => console.error('Database synced error:', error))