
import { Router } from "express";

import {
  getAll,
  getById,
  create,
  update,
  remove
} from "../controllers/person.controller.js";

import {
  getCurriculum
} from "../controllers/curriculum.controller.js";

const router = Router();

router.get("/", getAll);

// Currículo completo
router.get("/:id/curriculum", getCurriculum);

// CRUD de pessoas
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
