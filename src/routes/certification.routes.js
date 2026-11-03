
import { Router } from "express";

import {
  getByPerson,
  getById,
  create,
  update,
  remove
} from "../controllers/certification.controller.js";

const certificationRouter = Router();

certificationRouter.get("/:id", getById);
certificationRouter.put("/:id", update);
certificationRouter.delete("/:id", remove);

const personCertificationRouter = Router({
  mergeParams: true
});

personCertificationRouter.get("/", getByPerson);
personCertificationRouter.post("/", create);

export {
  certificationRouter,
  personCertificationRouter
};
