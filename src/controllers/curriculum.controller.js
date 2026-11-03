
import * as Person from "../models/person.model.js";
import * as Education from "../models/education.model.js";
import * as Experience from "../models/experience.model.js";
import * as Project from "../models/project.model.js";
import * as Skill from "../models/skill.model.js";
import * as Certification from "../models/certification.model.js";

export async function getCurriculum(req, res) {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || BigInt(id) <= 0n) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const person = await Person.findById(id);

    if (!person) {
      return res.status(404).json({
        message: "Currículo não encontrado."
      });
    }

    const [
      education,
      experiences,
      projects,
      skills,
      certifications
    ] = await Promise.all([
      Education.findAllByPersonId(id),
      Experience.findAllByPersonId(id),
      Project.findAllByPersonId(id),
      Skill.findAllByPersonId(id),
      Certification.findAllByPersonId(id)
    ]);

    return res.status(200).json({
      person,
      education,
      experiences,
      projects,
      skills,
      certifications
    });

  } catch (error) {
    console.error("Erro ao buscar currículo:", error);

    return res.status(500).json({
      message: "Erro ao consultar currículo."
    });
  }
}
