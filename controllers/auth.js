const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/user");

const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    // Verificar si existe email
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / password no son validos - correo",
      });
    }

    // Si el usuario esta activo
    if (!usuario.state) {
      return res.status(400).json({
        msg: "Usuario / password no son validos - estado:false",
      });
    }
    // Verifivar contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / password no son validos - password",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const googleSignin = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { correo, nombre, img } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      // crear usuario
      const data = {
        nombre,
        correo,
        password: ":P",
        img,
        google: true,
      };

      usuario = new Usuario(data);
      await usuario.save();
    }
    // si usuario en db tiene estado false
    if (!usuario.state) {
      return res.status(401).json({
        msg: "Hable con el administrador, usuario bloqueado",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Token de Google no es válido",
    });
  }
};

const renovarToken = async(req, res = response) => {
  const { usuario } = req;

  // Generar el JWT
  const token = await generarJWT(usuario.id);

  res.json({
    usuario,
    token,
  });
};

module.exports = {
  login,
  googleSignin,
  renovarToken,
};
