const Project = require("../models/Project");
const { validationResult } = require("express-validator");

exports.postProject = async (req, res) => {
  //Revisamos si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    //Crear un nuevo proyecto
    const project = new Project(req.body);

    //Guardar el creador via JWT
    project.creator = req.user.id;

    //Guardar el proyecto
    project.save();
    res.json(project); //Devolvemos el proyecto creado
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Hubo un error" });
  }
};

exports.getProjects = async (req, res) => {
  try {
    /* .sort({ created: -1,});   Dira que ordene por fecha */
    const projects = await Project.find({ creator: req.user.id }).sort({
      created: -1,
    });
    res.json({ projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

exports.putProject = async (req, res) => {
  //Revisamos si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //Extraer la info del proyecto
  const { name } = req.body;
  const newProject = {};

  if (name) {
    newProject.name = name;
  }
  try {
    //Revisar el ID
    let project = await Project.findById(req.params.id);

    //si el proyecto existe
    if (!project) {
      return res.status(404).json({ msg: "Proyecto NO encontrado" });
    }

    //verificar el creador si es la autenticada
    if (project.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //actualizar
    project = await Project.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: newProject },
      { new: true }
    );
    res.json({ project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    //Revisar el ID
    let project = await Project.findById(req.params.id);

    //si el proyecto existe
    if (!project) {
      return res.status(404).json({ msg: "Proyecto NO encontrado" });
    }

    //verificar el creador si es la autenticada
    if (project.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Eliminar el proyecto
    await Project.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Proyecto Eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
