const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model.js");
const { isLoggedIn } = require("../middlewares/auth.middleware.js");
const uploader = require("../middlewares/cloudinary.js")

//GET "/auth/signup" => renderiza el form para recoger los datos del nuevo usuario
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

//POST "/auth/signup" => recoge a info del form de nuevo user
router.post("/signup", uploader.single("avatar"), async (req, res, next) => {
  // aqui recibiremos la info del formulario

  const { username, email, password } = req.body;

  
  // 1. Validaciones de backend
  // .todos los campos deben estar llenos
  if (username === "" || email === "" || password === "") {
    res.render("auth/signup.hbs", {
      errorMessage: "Debes llenar todos los campos",
    });
    return;
  }

  // validar la fuerza de la contraseña
  // const passwordRegex = new RegExp("/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm")
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (passwordRegex.test(password) === false) {
    res.render("auth/signup.hbs", {
      errorMessage:
        "La contraseña debe tener minimo 8 caracteres, una mayuscula y un numero",
    });
    return;
  }

  // TODO dos campos de contraseña. Verificar que sean igual. if (password1 !== password2)
  // TODO validar el formato de correo electronico

  try {
    // validacion de que el usuario sea unico, no esté actualmente registrado en la DB
    const foundUser = await User.findOne({ username: username });
    console.log(foundUser);
    if (foundUser !== null) {
      // si existe en la BD
      res.render("auth/signup.hbs", {
        errorMessage: "Credenciales ya existentes",
      });
      return;
    }

    //  verificar tambien que el correo electronico sea unico, no este actualmente registrado en la DB
    const foundEmail = await User.findOne({ email: email });
    if (foundEmail !== null) {
      // si existe en la BD
      res.render("auth/signup.hbs", {
        errorMessage: "Credenciales ya existentes",
      });
      return;
    }

    // 2. Elemento de seguridad
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    // 3. Crear el perfil del usuario
    const newUser = {
      username: username,
      avatar: req.file?.path,
      email: email,
      password: hashPassword,
    };

    await User.create(newUser);

    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
});

//GET "/auth/login" => renderiza el form para recoger los datos del usuario
router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

//POST "/auth/login" => recoge a info del form para loggear
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  // 1. validaciones de backend
  if (email === "" || password === "") {
    res.render("auth/login.hbs", {
      errorMessage: "Los campos deben estar completos",
    });
    return;
  }

  try {
    // verificar que el usuario exista
    const foundUser = await User.findOne({ email: email });
    if (foundUser === null) {
      // si no existe
      res.render("auth/login.hbs", {
        errorMessage: "Credenciales incorrectas ",
      });
      return;
    }

    // 2. verificar la contraseña del usuario (validar)
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    console.log("isPasswordValid", isPasswordValid);
    if (isPasswordValid === false) {
      res.render("auth/login.hbs", {
        errorMessage: "Credenciales incorrectas",
      });
      return;
    }

    // 3. Implementar un sistema de sesions y abrir una sesión para este usuario

    req.session.activeUser = foundUser; // ESTA ES LA LINEA CREA CREA LA SESSION/COOKIE
    console.log(req.session.activeUser);
    // el método es para asegurar que la sesión se ha creado correctamente antes de continuar
    req.session.save(() => {
      // 4. redireccionar a una página privada
      res.redirect("/user/profile");
    });
  } catch (error) {
    next(error);
  }
});

//GET "/auth/logout" => cerrar sesión
router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
