# cat-toys
<br>

## Description
Plataforma para intercanviar juguetes gatunos entre dueños de gatos.
<br>

## User stories
- **404** - Como usuario quiero saber cuando hay un error de URL para saber como corregirlo o que ha sido culpa de los grandes caballeros que han diseñado la aplicación.
- **500** - Como usuario quiero saber cuando hay un error interno y que yo soy totalmente inocente, gracias a la humildad divina de los desarrolladores que emplean el 'mea culpa'.
- **signup** - Como usuario quiero ver una página de bienvenida y poder registrarme con mis datos personales para tenenr una cuenta y hacer uso del sevicio de la app.
- **login** - Como usuario quiero ver una página que me permita acceder a los servicios especiales para miembros usando mis credenciales, y me dirija a my perfil privado.
- **homepage** - Como usuario quiero que mi privera vista de la página sea ver un lindo gatito jugando con una peotita antes mientras accedo a secciones mas concretas como la lista de juguetes o los formularios para acceder o para registrarse.
- **toy/list** - Como usuario e invitado no registrado quiero ver una lista previa de los juguetes para gatos disponibles, ver informacion detallada de estos o proceder al acceso o registro.
- **toy/detail** - Como usuario quiero ver informacion detallada de un juguete concreto cuando hago click en el así como los comentarios de otros usuarios sobre este, hacer una reserva del juguete, y dejar mi propio comentario.
- **user/list** - Como usuario quiero ver una lista de los demás miembros de la plataforma para poder acceder a sus aportes de juguetes ofrecidos y comentarios que ha escrito sobre los juguetes.
- **user/profile** - Como usuario quiero ver qué juguete he reservado, y poder deshacer esta reserva, una lista de mis juguetes aportados y editarlos si quisiera, además de todos mis comentarios con la opción de cambiarlos.
- **user/edit** - Como usuario quiero ver un formulario con mis datos para poder alterarlos.
- **toy/add** - Como usuario quiero poder ver un formulario para añadir un nuevo juguete con toda la información necesaria.
- **toy/edit** - Como usuario quiero ver un formulario para alterar los datos de un juguete que he aportado.
- **comment/edit** - Como usuario quiero ver un formulario para alterar cualquier comentario que haya hecho sobre cualquier juguete.
<br>

## API routes (back-end)

-GET "/" => home
-GET "/auth/signup" => renderiza el form para recoger los datos del nuevo usuario
-POST "/auth/signup" => recoge a info del form de nuevo user
-GET "/auth/login" => renderiza el form para recoger los datos del usuario
-POST "/auth/login" => recoge a info del form para loggear
- GET "/auth/logout" => cerrar sesión
- GET "/toy/list" => renderiza una lista de todos los toy
- GET "/toy/:idtoy/detail" => renderiza detalles de cada toy
- POST "/toy/:idtoy/detail" => Crear nuevo comentario y añadir relación al toy y al user
- GET "/toy/add"=> renderiza formulario para añadir nuevo juguete
- POST "/toy/add" =>  recoge la info del form add toy
- GET ("/toy/reserve") => Añade el toy a la reserva del user
- GET ("/toy/:idtoy/edit") => renderiza el formulario para editar el juguete
- POST ("/toy/:idtoy/edit") => Actualiza el juguete en la base de datos.
- GET ("/toy/:idtoy/delete") => Elimina un juguete de la base de datos
- GET "/toy/removereserve" => Elimina una reserva hecha y te redirije al perfil
- GET "/toy/removereserve/:idtoy" => Elimina una reserva y te redirije al juguete en cuestion
- GET "/user/profile" => renderiza el area personal del user
- GET "/user/list" => renderiza una lista de todos los user
- GET "/user/:userid/detail" => renderiza detalles de cada user
- GET ("/user/:userid/edit") => renderiza form editar datos user
- POST ("/user/:userid/edit") => Actualiza los datos del usuario en la base de datos
- GET ("user/:userid/delete") => Elimina un usuario de la base de datos
- GET ("/comment/:idcomment/edit") => Renderiza un formulario para editar un comentario
- POST ("/comment/update") => actualizar comentario
- GET ("/comment/delete") => borrar comentario

<br>

## Models
 
 - User 
    new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    toyOffered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Toy",
      },
    ],
    toyReserved: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Toy",
    },
    commentUser: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/dgsjejaed/image/upload/v1666701992/cat-toys/q3fi1deeyjznzy6athzy.png"
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);
          
  - Toy 
    new Schema(
  {
    name: String,
    description: String,
    photo: {
      type: String,
      default: "https://res.cloudinary.com/dgsjejaed/image/upload/v1666701992/cat-toys/q3fi1deeyjznzy6athzy.png"
    },
    status: {
      type: String,
      enum: ["new", "used", "trash"],
      default: "used",
    },
    commentToy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

  - Comment
  new Schema(
  {
    content: String,
    idToy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Toy",
    },
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

    <br>
    



### Git
[https://github.com/davidfragua/cat-toys]

[https://cat-toys.cyclic.app/]

<br>
