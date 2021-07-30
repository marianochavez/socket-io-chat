const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/user");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    usuario = await Usuario.findById(uid);

    if(!usuario){
        return res.status(401).json({
            msg: 'Token no válido - usuario inexistente en la DB'
        })
    }

    // Verificar si el uid tiene estado en true
    if(!usuario.state){
        return res.status(401).json({
            msg: 'Token no válido - usuario con estado:false'
        })
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no valido",
    });
  }
};

module.exports = {
  validarJWT,
};
