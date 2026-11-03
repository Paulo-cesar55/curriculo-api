
import * as Skill from "../models/skill.model.js";
import * as Person from "../models/person.model.js";

function validId(id) {
  return /^\d+$/.test(id) && BigInt(id) > 0n;
}

const allowedLevels = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT"
];

function validateSkill(body) {
  if (
    typeof body.name !== "string" ||
    !body.name.trim()
  ) {
    return "O nome da habilidade é obrigatório.";
  }

  if (
    body.category !== undefined &&
    body.category !== null &&
    typeof body.category !== "string"
  ) {
    return "A categoria deve ser um texto.";
  }

  return null;
}

function validateAssociation(body) {
  if (!allowedLevels.includes(body.proficiency_level)) {
    return "Nível inválido. Utilize BEGINNER, INTERMEDIATE, ADVANCED ou EXPERT.";
  }

  const years = Number(body.years_experience);

  if (
    body.years_experience === undefined ||
    !Number.isFinite(years) ||
    years < 0 ||
    years > 999.9
  ) {
    return "Informe anos de experiência entre 0 e 999.9.";
  }

  return null;
}

// =====================================
// CRUD DE HABILIDADES
// =====================================

// Listar habilidades
export async function getAll(req, res) {
  try {
    const skills = await Skill.findAll();

    return res.status(200).json(skills);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao listar habilidades."
    });
  }
}

// Buscar habilidade
export async function getById(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({
        message: "Habilidade não encontrada."
      });
    }

    return res.status(200).json(skill);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar habilidade."
    });
  }
}

// Cadastrar habilidade
export async function create(req, res) {
  try {
    const validationError = validateSkill(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const skill = await Skill.create({
      name: req.body.name.trim(),
      category: req.body.category?.trim() || null
    });

    return res.status(201).json(skill);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Esta habilidade já está cadastrada."
      });
    }

    return res.status(500).json({
      message: "Erro ao cadastrar habilidade."
    });
  }
}

// Atualizar habilidade
export async function update(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const validationError = validateSkill(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const skill = await Skill.update(id, {
      name: req.body.name.trim(),
      category: req.body.category?.trim() || null
    });

    if (!skill) {
      return res.status(404).json({
        message: "Habilidade não encontrada."
      });
    }

    return res.status(200).json(skill);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Esta habilidade já está cadastrada."
      });
    }

    return res.status(500).json({
      message: "Erro ao atualizar habilidade."
    });
  }
}

// Excluir habilidade
export async function remove(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const skill = await Skill.remove(id);

    if (!skill) {
      return res.status(404).json({
        message: "Habilidade não encontrada."
      });
    }

    return res.status(200).json({
      message: "Habilidade excluída com sucesso.",
      skill
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao excluir habilidade."
    });
  }
}

// =====================================
// RELACIONAMENTO PESSOA + HABILIDADES
// =====================================

// Listar habilidades de uma pessoa
export async function getPersonSkills(req, res) {
  try {
    const { personId } = req.params;

    if (!validId(personId)) {
      return res.status(400).json({
        message: "ID da pessoa inválido."
      });
    }

    const person = await Person.findById(personId);

    if (!person) {
      return res.status(404).json({
        message: "Pessoa não encontrada."
      });
    }

    const skills = await Skill.findAllByPersonId(personId);

    return res.status(200).json(skills);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao listar habilidades da pessoa."
    });
  }
}

// Associar habilidade a uma pessoa
export async function addPersonSkill(req, res) {
  try {
    const { personId } = req.params;
    const { skill_id } = req.body;

    if (!validId(personId) || !validId(String(skill_id ?? ""))) {
      return res.status(400).json({
        message: "ID da pessoa ou da habilidade inválido."
      });
    }

    const person = await Person.findById(personId);

    if (!person) {
      return res.status(404).json({
        message: "Pessoa não encontrada."
      });
    }

    const skill = await Skill.findById(skill_id);

    if (!skill) {
      return res.status(404).json({
        message: "Habilidade não encontrada."
      });
    }

    const validationError = validateAssociation(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const association = await Skill.addToPerson(
      personId,
      skill_id,
      {
        proficiency_level: req.body.proficiency_level,
        years_experience: Number(req.body.years_experience)
      }
    );

    return res.status(201).json({
      message: "Habilidade associada à pessoa com sucesso.",
      association
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Esta habilidade já está associada a esta pessoa."
      });
    }

    return res.status(500).json({
      message: "Erro ao associar habilidade."
    });
  }
}

// Atualizar nível e experiência da associação
export async function updatePersonSkill(req, res) {
  try {
    const { personId, skillId } = req.params;

    if (!validId(personId) || !validId(skillId)) {
      return res.status(400).json({
        message: "ID da pessoa ou da habilidade inválido."
      });
    }

    const validationError = validateAssociation(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const association = await Skill.updatePersonSkill(
      personId,
      skillId,
      {
        proficiency_level: req.body.proficiency_level,
        years_experience: Number(req.body.years_experience)
      }
    );

    if (!association) {
      return res.status(404).json({
        message: "Associação entre pessoa e habilidade não encontrada."
      });
    }

    return res.status(200).json(association);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao atualizar associação."
    });
  }
}

// Remover associação entre pessoa e habilidade
export async function removePersonSkill(req, res) {
  try {
    const { personId, skillId } = req.params;

    if (!validId(personId) || !validId(skillId)) {
      return res.status(400).json({
        message: "ID da pessoa ou da habilidade inválido."
      });
    }

    const association = await Skill.removeFromPerson(
      personId,
      skillId
    );

    if (!association) {
      return res.status(404).json({
        message: "Associação não encontrada."
      });
    }

    return res.status(200).json({
      message: "Habilidade removida da pessoa com sucesso.",
      association
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao remover habilidade da pessoa."
    });
  }
}
