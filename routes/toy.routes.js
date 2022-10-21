const express = require('express');
const mongoose = require("mongoose")
const router = express.Router();
const Toy = require("../models/Toy.model")

//GET "/toy/list" => renderiza una lista de todos los toy
router.get("/list", async (req, res, next) =>{

try {
    const toyList = await Toy.find()
    res.render("toy/list.hbs", {
        toyList
    })
} catch (error) {
    next(error)   
}
})


//GET "/toy/:idtoy/detail" => renderiza detalles de cada toy
router.get("/:idtoy/detail", async (req, res, next) =>{
    const { idtoy } = req.params
try {
    const eachToy = await Toy.findById(idtoy)
    res.render("toy/toy-detail.hbs", {
        eachToy
    })
}
 catch (error) {
    next(error)
}
})

//!GET "/toy/add" =>  renderiza el form para añadir toy


//!POST "/toy/add" =>  recoge la info del form add toy

module.exports=router