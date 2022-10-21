
const isLoggedIn = (req, res, next) => {
    console.log(req.session.activeUser)
    if (req.session.activeUser === undefined) {
      // si no tienes sesion, fuera de aqui
      res.redirect("/auth/login")
    } else {
      // bienvenido, continua con la ruta
      next()
    }
  }
  
  const isAdmin = (req, res, next) => {
  
    
    if (req.session.activeUser.role !== "admin") {
      // no tienes sesion active o no eres un admin
      res.redirect("/auth/login")
    } else {
      // bienvenido, continua con la ruta
      next()
    }
  }
  
  
  module.exports = {
    isLoggedIn,
    isAdmin
  }