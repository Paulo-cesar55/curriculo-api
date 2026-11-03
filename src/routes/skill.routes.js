
import { Router } from "express";

import {
  getAll,
  getById,
  create,
  update,
  remove,
  getPersonSkills,
  addPersonSkill,
  updatePersonSkill,
  removePersonSkill
} from "../controllers/skill.controller.js";

// CRUD de habilidades
const skillRouter = Router();

skillRouter.get("/", getAll);
skillRouter.get("/:id", getById);
skillRouter.post("/", create);
skillRouter.put("/:id", update);
skillRouter.delete("/:id", remove);

// Relacionamento entre pessoas e habilidades
const personSkillsRouter = Router({ mergeParams: true });

personSkillsRouter.get("/", getPersonSkills);
personSkillsRouter.post("/", addPersonSkill);
personSkillsRouter.put("/:skillId", updatePersonSkill);
personSkillsRouter.delete("/:skillId", removePersonSkill);

export {
  skillRouter,
  personSkillsRouter
};
