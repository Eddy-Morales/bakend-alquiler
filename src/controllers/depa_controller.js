import Departamento from "../models/Departamento.js"
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs-extra';
import mongoose from 'mongoose';

const registrarDepartamento = async (req, res) => {
  try {
    const { arrendatario } = req.body;

    // Validación básica
    if (!mongoose.Types.ObjectId.isValid(arrendatario)) {
      return res.status(400).json({ msg: "El ID del arrendatario no es válido." });
    }

    if (Object.values(req.body).includes("")) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios." });
    }

    const imagenesSubidas = [];

    // 📷 Subida de imágenes desde dispositivo
    if (req.files?.imagenes) {
      const archivos = Array.isArray(req.files.imagenes)
        ? req.files.imagenes
        : [req.files.imagenes];

      for (const archivo of archivos) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          archivo.tempFilePath,
          { folder: "Departamentos" }
        );

        imagenesSubidas.push({ url: secure_url, public_id });
        await fs.unlink(archivo.tempFilePath);
      }
    }

    const nuevoDepartamento = new Departamento({
      ...req.body,
      imagenes: imagenesSubidas
    });

    await nuevoDepartamento.save();

    res.status(201).json({
      msg: "Departamento registrado exitosamente",
      departamento: nuevoDepartamento
    });

  } catch (error) {
    console.error("Error al registrar departamento:", error);
    res.status(500).json({ msg: "Error interno", error: error.message });
  }
};


const listarDepartamento = async (req,res)=>{
    const departamentos = await Departamento.find()
    res.status(200).json(departamentos)
}

const eliminarDepa = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "ID de departamento no válido" });
    }
    const depaEliminado = await Departamento.findByIdAndDelete(id);
    if (!depaEliminado) {
        return res.status(404).json({ msg: "Departamento no encontrado" });
    }
    res.status(200).json({ msg: "Departamento eliminado correctamente" });
};


export {
    registrarDepartamento,
    listarDepartamento,
    eliminarDepa
  }