const toys =
[
{
    name: "THE CAT BAND JUGUETE INTERACTIVO",
    description: "Combinar un juguete que sea interactivo y 3 en 1 ahora es posible con nuevo disco de The Cat Band, este incentiva la inteligencia de los gatos y es placentero y puedes lanzarlo en el césped.",
photo: "https://www.tiendanimal.es/on/demandware.static/-/Sites-kiwoko-master-catalog/default/dw95f5c14b/images/juguete_interactivo_gato_the_cat_band_TCB40002_M.jpg",
status:"new",
},
{
    name: "FLAMINGO TIOVIVO JUGUETE INTERACTIVO",
    description: "Este juguete para gatos es un tiovivo diseñado y elaborado en Alemania, con materiales de primera calidad. Se trata de un accesorio muy sencillo y económico, pero que fascina a los gatos.",
photo: "https://www.tiendanimal.es/on/demandware.static/-/Sites-kiwoko-master-catalog/default/dw4db46102/images/juguete_gato_flamingo_tiovivo_FLA7118_M.jpg",
status:"new",
},
{
    name: "FERPLAST PELOTA PORTA GOLOSINAS",
    description: "La pelota dispensadora de chuches para gatos es un fantástico juguete con el que tu felino podrá jugar durante horas buscando sus golosinas favoritas. Una forma estupenda de mantenerle entretenido.",
photo: "https://www.tiendanimal.es/on/demandware.static/-/Sites-kiwoko-master-catalog/default/dw16eeda6d/images/accesorios_gatos_Ferplast_pelota_dispensadora_de_chuches_para_gatos_FER85216799_M.jpg",
status:"new",
},
{
    name: "THE CAT BAND SPARKLING BALL JUGUETE",
    description: "Las pelotas de The Cat Band son uno de los juguetes favoritos para tu gato, porque le proporciona mucha actividad física, juego y diversión",
photo: "https://www.tiendanimal.es/on/demandware.static/-/Sites-kiwoko-master-catalog/default/dw2682d65e/images/THE%20CAT%20BAND%20SPARKLING%20BALL_TCB70402.jpg",
status:"new",
},
{
    name: "THE CAT BAND PELUCHE RATÓN GIGANTE ARCOIRIS",
    description: "Seguro que le has comprado a tu gato un montón de ratoncitos de todo tipo: de felpa, de papel, de cuerda, con plumas, sin plumas… ¡pero ninguno como este!",
photo: "https://www.tiendanimal.es/on/demandware.static/-/Sites-kiwoko-master-catalog/default/dw3a38323f/images/peluche_raton_arcoiris_gigante_the_cat_band_TCB88924_M.jpg",
status:"new",
},
{
    name: "KARLIE FISHBONE CAÑA",
    description: "La caña con juguete Karlie para gatos es ideal para fomentar y promover la interacción entre dueño y mascota . Es un juguete divertido que les encanta a los gatos.",
photo: "https://www.tiendanimal.es/on/demandware.static/-/Sites-kiwoko-master-catalog/default/dwb3c27190/images/Karlie_Cana_para_gato_KAR1030498.jpg",
status:"new",
},
]



require("../db")

const Toy = require("../models/Toy.model.js")

Toy.insertMany(toys)
.then((response)=> {
    console.log("Agregados los toys")
})
.catch((error)=>{
    console.log(error)
})