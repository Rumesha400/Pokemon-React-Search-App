const express = require('express');
const app = express();
const port = 3001;
const pokemonData = require('./src/pokemonapi.json');

// console.log(`Received request for ${reqUrl.pathname}`);

// Middleware to set CORS headers globally
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});


app.get('/api/pokemon', (req, res) => {
    res.json(pokemonData.results);
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


// app.get('/api/pokemon/:identifier', (req, res) => {
//     const identifier = req.params.identifier.toLowerCase();


//     const pokemon = pokemonData.results.find(
//         (poke) => poke.name.toLowerCase() === identifier || poke.id == identifier
//     );

//     if (pokemon) {
//         res.json(pokemon);
//     } else {
//         res.status(404).json({ error: 'Pokémon not found' });
//     }
// });

