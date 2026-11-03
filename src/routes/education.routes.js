
import { Router } from "express";

import {
  getByPerson,
  getById,
  create,
  update,
  remove
} from "../controllers/education.controller.js";

// Rotas de formação
const educationRouter = Router();

educationRouter.get("/:id", getById);
educationRouter.put("/:id", update);
educationRouter.delete("/:id", remove);

// Rotas relacionadas a uma pessoa
const personEducationRouter = Router({ mergeParams: true });

personEducationRouter.get("/", getByPerson);
personEducationRouter.post("/", create);

export {
  educationRouter,
  personEducationRouter
};
