const express = require('express');
const mongoose = require("mongoose")
const router = express.Router();
const Toy = require("../models/Toy.model")

//GET "/toy/list" => renderiza una lista de todos los toy
router.get("/list", async (req, res, next) =>{

try {
    const toyList = await Toy.find().select("name")
    res.render("toy/list.hbs", {
        toyList
    })


} catch (error) {
    next(error)
    
}


})


//GET "/toy/detail" => renderiza detalles de cada toy

//!GET "/toy/add" =>  renderiza el form para añadir toy

//!POST "/toy/add" =>  recoge la info del form add toy

module.exports=router