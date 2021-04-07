const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const projectController = require("../controllers/projectController");
const auth = require("../middlewares/auth");

router.post(
  "/",
  auth,
  [check("name", "El nombre del proyecto es obligatorio").not().isEmpty()],
  projectController.postProject
);
router.get("/", auth, projectController.getProjects);
router.put(
  "/:id",
  auth,
  [check("name", "El nombre del proyecto es obligatorio").not().isEmpty()],
  projectController.putProject
);
router.delete("/:id", auth, projectController.deleteProject);

module.exports = router;
