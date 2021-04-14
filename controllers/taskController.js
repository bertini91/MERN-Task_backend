const { validationResult } = require("express-validator");
const Task = require("../models/Task");
const Project = require("../models/Project");

exports.postTask = async (req, res) => {
  //Revisamos si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    //Extraer el proyecto y comprobar si existe
    const { project } = req.body;
    const projectObj = await Project.findById(project);
    if (!projectObj) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Revisar si el proyecto actual pertenece al usuario autenticado
    if (projectObj.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Crear tarea
    const task = new Task(req.body);
    task.save();
    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    //Extraer el proyecto y comprobar si existe
    const { project } = req.query;
    const projectObj = await Project.findById(project);
    if (!projectObj) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Revisar si el proyecto actual pertenece al usuario autenticado
    if (projectObj.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Obtener tareas por proyecto
    const tasks = await Task.find({ project }).sort({ created: -1 });
    res.json({ tasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

exports.putTask = async (req, res) => {
  try {
    //Extraer el proyecto y comprobar si existe
    const { project, name, state } = req.body;

    //Si la tarea existe o no
    let taskObj = await Task.findById(req.params.id);
    if (!taskObj) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    //Extraer proyecto
    const projectObj = await Project.findById(project);

    //Revisar si el proyecto actual pertenece al usuario autenticado
    if (projectObj.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Creamos el obj con la nueva info
    let newTask = {};
    newTask.name = name;
    newTask.state = state;

    //Actualizamos la tarea
    taskObj = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, {
      new: true,
    });

    res.json({ taskObj });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    //Extraer el proyecto y comprobar si existe
    const { project } = req.query;
    console.log(project);

    //Si la tarea existe o no
    let taskObj = await Task.findById(req.params.id);
    if (!taskObj) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    //Extraer proyecto
    const projectObj = await Project.findById(project);

    //Revisar si el proyecto actual pertenece al usuario autenticado
    if (projectObj.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Eliminar
    await Task.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Tarea eliminada" });

    res.json({ taskObj });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error en el servidor" });
  }
};
