const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const taskController = require("../controllers/taskController");
const auth = require("../middlewares/auth");

router.post(
  "/",
  auth,
  [
    check("name", "El nombre del proyecto es obligatorio").not().isEmpty(),
    check("project", "El nombre del proyecto es obligatorio").not().isEmpty(),
  ],
  taskController.postTask
);

router.get("/", auth, taskController.getTasks);

router.put("/:id", auth, taskController.putTask);
router.delete("/:id", auth, taskController.deleteTask);

module.exports = router;
