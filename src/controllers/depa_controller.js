import Departamento from "../models/Departamento.js"
import mongoose from "mongoose"

import { Stripe } from "stripe"

const registrarDepartamento = async (req, res) => {
  try {
    const { arrendatario } = req.body;

    // Validar que arrendatario sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(arrendatario)) {
      return res.status(400).json({ msg: "Lo sentimos, el ID del arrendatario no es válido." });
    }

    // Crear el departamento
    const nuevoDepartamento = await Departamento.create(req.body);
    
    res.status(201).json({
      msg: "Registro exitoso de departamento",
      departamento: nuevoDepartamento
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al registrar el departamento", error: error.message });
  }
}

const listarDepartamento = async (req,res)=>{
    const departamentos = await Departamento.find()
    res.status(200).json(departamentos)
}

export {
    registrarDepartamento,
    listarDepartamento}