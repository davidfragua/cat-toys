const toys =
[
{
    name: CattoFun,
photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgC6NFBXkhyWOHlI2g4odh1kHt8D4l5U9SwQ&usqp=CAU",
status:"new",
},
{
    name: FunnyFunny,
photo: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.bondara.co.uk%2Fml%2F11%2Ff-enlargev3%2Fproducts%2Fbo44.jpg&imgrefurl=https%3A%2F%2Fwww.bondara.co.uk%2Fbondara-rider-pink-silicone-realistic-dildo-7-8-9-10-inch&tbnid=kerQZ59i7rkxVM&vet=12ahUKEwiYmZWcifH6AhUBphoKHRSHBS4QMygWegUIARDEAQ..i&docid=_vwZGvjAV2xJSM&w=720&h=720&q=dildo%20pic&ved=2ahUKEwiYmZWcifH6AhUBphoKHRSHBS4QMygWegUIARDEAQ",
status:"new",
},
{
    name: Extreeeem,
photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzKFM8uoQ0bZqp8PCacZOZHbntwsdwy20jrg&usqp=CAU",
status:"new",
},
{
    name: SuperToy,
photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4o9c9kPOuDrvOwCFGv6xp6OjO1JKX9_oMNRhTvoyz0pwTCZmrSef33eiku-Ez1plrw_I&usqp=CAU",
status:"new",
},
{
    name: PlayIt,
photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGc5JD0atWiz1drU-8dcioIdrM65fbKhNkDA&usqp=CAU",
status:"new",
},
{
    name: TacoCat,
photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3ZsPGpjz-uLogW5Y-_V6pqSt3plnDLx68OA&usqp=CAU",
status:"new",
},
]



require("../db")

const Movies = require("../models/Movies.model.js")

Movies.insertMany(movies)
.then((response)=> {
    console.log("Agregadas las pelis")
})
.catch((error)=>{
    console.log(error)
})