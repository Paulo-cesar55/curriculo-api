
import * as Experience from "../models/experience.model.js";
import * as Person from "../models/person.model.js";

function validId(id) {
  return /^\d+$/.test(id) && BigInt(id) > 0n;
}

function validDate(date) {
  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);

  return !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date;
}

function validateExperience(body) {
  if (
    typeof body.company !== "string" ||
    !body.company.trim()
  ) {
    return "O nome da empresa é obrigatório.";
  }

  if (
    typeof body.role !== "string" ||
    !body.role.trim()
  ) {
    return "O cargo é obrigatório.";
  }

  if (!validDate(body.start_date)) {
    return "Informe uma data inicial válida.";
  }

  if (
    body.end_date !== null &&
    body.end_date !== undefined &&
    !validDate(body.end_date)
  ) {
    return "Informe uma data final válida.";
  }

  if (
    body.end_date &&
    body.end_date < body.start_date
  ) {
    return "A data final não pode ser anterior à inicial.";
  }

  if (
    body.is_current !== undefined &&
    typeof body.is_current !== "boolean"
  ) {
    return "O campo is_current deve ser verdadeiro ou falso.";
  }

  const isCurrent = body.is_current ?? false;

  if (isCurrent && body.end_date) {
    return "Uma experiência atual não deve possuir data final.";
  }

  return null;
}

// Listar experiências de uma pessoa
export async function getByPerson(req, res) {
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

    const experiences =
      await Experience.findAllByPersonId(personId);

    return res.status(200).json(experiences);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao listar experiências profissionais."
    });
  }
}

// Buscar experiência por ID
export async function getById(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({
        message: "Experiência não encontrada."
      });
    }

    return res.status(200).json(experience);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar experiência."
    });
  }
}

// Cadastrar experiência
export async function create(req, res) {
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

    const validationError = validateExperience(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const experience = await Experience.create({
      person_id: personId,
      company: req.body.company.trim(),
      role: req.body.role.trim(),
      employment_type: req.body.employment_type || null,
      location: req.body.location || null,
      start_date: req.body.start_date,
      end_date: req.body.end_date || null,
      is_current: req.body.is_current ?? false,
      description: req.body.description || null
    });

    return res.status(201).json(experience);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao cadastrar experiência."
    });
  }
}

// Atualizar experiência
export async function update(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const validationError = validateExperience(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const experience = await Experience.update(id, {
      company: req.body.company.trim(),
      role: req.body.role.trim(),
      employment_type: req.body.employment_type || null,
      location: req.body.location || null,
      start_date: req.body.start_date,
      end_date: req.body.end_date || null,
      is_current: req.body.is_current ?? false,
      description: req.body.description || null
    });

    if (!experience) {
      return res.status(404).json({
        message: "Experiência não encontrada."
      });
    }

    return res.status(200).json(experience);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao atualizar experiência."
    });
  }
}

// Excluir experiência
export async function remove(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const experience = await Experience.remove(id);

    if (!experience) {
      return res.status(404).json({
        message: "Experiência não encontrada."
      });
    }

    return res.status(200).json({
      message: "Experiência excluída com sucesso.",
      experience
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao excluir experiência."
    });
  }
}
