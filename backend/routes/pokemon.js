const express = require('express')
const pokemonController = require('../controllers/pokemon')
const router = express.Router();

router.post("/", pokemonController.createPokemon);   //create pokemon
router.get("/getPokemon", pokemonController.getAllPokemon);  //read pokemon
router.delete('/deletePokemon', pokemonController.deletePokemon); //delete pokemon

module.exports = router;