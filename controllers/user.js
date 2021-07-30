const { request, response } = require("express");
const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/user");

const userGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { state: true };

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({ total, usuarios });
};

const userPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, correo, password, google, ...resto } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json(usuario);
};

const userPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  // encriptar pass
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  await usuario.save();

  res.json(usuario);
};

const userPatch = (req, res = response) => {
  res.json({});
};

const userDelete = async (req, res = response) => {
  const { id } = req.params;

  const usuario = await Usuario.findByIdAndUpdate(id, {state:false})

  res.json({ usuario});
};

module.exports = {
  userGet,
  userPut,
  userPost,
  userPatch,
  userDelete,
};
