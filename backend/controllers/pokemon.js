const Pokemon = require('../models/pokemon');
const express = require('express');

//create a pokemon
exports.createPokemon = async (req , res) => {
    try {
        const { name , url } = req.body;
        const newPokemon = await Pokemon.create({ name , url });
        res.status(200).json({ newPokemon});
    }
    catch(error) {
        res.status(500).json({error : 'Error creating pokemon'})
    }
};

//read all users
exports.getAllPokemon = async (req,res) => {
    try {
        const pokemons = await Pokemon.findAll();
        res.status(200).json(pokemons) 
    }catch(error){
        res.status(404).json(error);
    }
}

//delete a pokemon
exports.deletePokemon = async (req , res) => {
    try {
        const {id} = req.body;
        const pokemon =  await Pokemon.findByPk(id);
        console.log(pokemon);     
        
        if(!pokemon){
            return res.status(404).json({message : "Pokemon not found"})
        }
        await pokemon.destroy();
        res.status(200).json({message : "Pokemon deleted successfully"})
    }catch(error){
        res.status(500).json(error)   
    }   
}