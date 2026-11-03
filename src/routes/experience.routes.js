
import { Router } from "express";

import {
  getByPerson,
  getById,
  create,
  update,
  remove
} from "../controllers/experience.controller.js";

const experienceRouter = Router();

experienceRouter.get("/:id", getById);
experienceRouter.put("/:id", update);
experienceRouter.delete("/:id", remove);

const personExperienceRouter = Router({ mergeParams: true });

personExperienceRouter.get("/", getByPerson);
personExperienceRouter.post("/", create);

export {
  experienceRouter,
  personExperienceRouter
};
