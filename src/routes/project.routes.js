
import { Router } from "express";

import {
  getByPerson,
  getById,
  create,
  update,
  remove
} from "../controllers/project.controller.js";

const projectRouter = Router();

projectRouter.get("/:id", getById);
projectRouter.put("/:id", update);
projectRouter.delete("/:id", remove);

const personProjectRouter = Router({ mergeParams: true });

personProjectRouter.get("/", getByPerson);
personProjectRouter.post("/", create);

export {
  projectRouter,
  personProjectRouter
};
