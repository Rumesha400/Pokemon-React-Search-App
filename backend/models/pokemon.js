const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pokemon = sequelize.define('Pokemon',{
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true 
    },
    name : {
        type : DataTypes.STRING,
        unique : true,
    },
    url : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true,
    }
},{
    timestamps : true,
    tableName : 'pokemons'
})


module.exports = Pokemon;