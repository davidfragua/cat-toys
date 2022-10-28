// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "cat-toys";

app.locals.appTitle = `${capitalize(projectName)}`;

// aqui ejecutaremos el middleware de variables locales para CADA ruta que intente acceder el cliente
app.use((req, res, next) => {
    // el middle crea una variable para HBS que nos ayuda a saber si el usuario esta logeado o no
    if (req.session.activeUser !== undefined) {
      // el usuario está activo
      res.locals.isUserActive = true
      res.locals.localIduser = req.session.activeUser._id
      if (req.session.activeUser.role === "admin") {
        // el usuario es admin
        res.locals.isUserAdmin = true
      }
      if (req.session.activeUser.role === "user") {
        // el usuario no es admin
        res.locals.isUserAdmin = false
      }
    } else {
      // el usuario no está activo y no es admin
      res.locals.isUserActive = false
      res.locals.isUserAdmin = false
    }
    next()
  })

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
