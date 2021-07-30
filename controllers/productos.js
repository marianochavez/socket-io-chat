const { response, request } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("categoria", "nombre")
      .populate("usuario", "nombre"),
  ]);

  res.json({ total, productos });
};

const obtenerProducto = async (req, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate("categoria", "nombre")
    .populate("usuario", "nombre");

  res.json(producto);
};

const crearProducto = async (req, res = response) => {
  const { nombre, precio, descripcion, categoria } = req.body;
  const productoDB = await Producto.findOne({ nombre });

  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre}, ya existe`,
    });
  }

  const data = {
    nombre,
    precio,
    descripcion,
    categoria,
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);

  await producto.save();

  res.status(201).json(producto);
};

const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { nombre, precio, descripcion, disponible, categoria, estado } =
    req.body;

  const data = {
    nombre,
    precio,
    descripcion,
    disponible,
    categoria,
    estado,
  };
  const producto = await Producto.findByIdAndUpdate(id, data, { new: true })
    .populate("categoria", "nombre")
    .populate("usuario", "nombre");

  res.json(producto);
};

const eliminarProducto = async (req, res = response) => {
  const { id } = req.params;
  const productoBorrado = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json(productoBorrado);
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
