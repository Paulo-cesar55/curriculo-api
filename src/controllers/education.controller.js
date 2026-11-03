
import * as Education from "../models/education.model.js";
import * as Person from "../models/person.model.js";

function validId(id) {
  return /^\d+$/.test(id) && BigInt(id) > 0n;
}

function validDate(date) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);

  return !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date;
}

function validateEducation(body) {
  if (!body.institution || !body.institution.trim()) {
    return "A instituição é obrigatória.";
  }

  if (!body.course || !body.course.trim()) {
    return "O curso é obrigatório.";
  }

  if (!validDate(body.start_date)) {
    return "Informe uma data inicial válida.";
  }

  const allowedStatus = [
    "IN_PROGRESS",
    "COMPLETED",
    "PAUSED"
  ];

  if (!allowedStatus.includes(body.status)) {
    return "Status inválido.";
  }

  if (body.end_date && !validDate(body.end_date)) {
    return "Informe uma data final válida.";
  }

  if (body.end_date && body.end_date < body.start_date) {
    return "A data final não pode ser anterior à inicial.";
  }

  return null;
}

// Listar formações de uma pessoa
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

    const education = await Education.findAllByPersonId(personId);

    return res.status(200).json(education);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao listar formações acadêmicas."
    });
  }
}

// Buscar formação por ID
export async function getById(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const education = await Education.findById(id);

    if (!education) {
      return res.status(404).json({
        message: "Formação não encontrada."
      });
    }

    return res.status(200).json(education);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar formação."
    });
  }
}

// Cadastrar formação para uma pessoa
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

    const validationError = validateEducation(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const education = await Education.create({
      person_id: personId,
      institution: req.body.institution.trim(),
      course: req.body.course.trim(),
      degree_level: req.body.degree_level || null,
      start_date: req.body.start_date,
      end_date: req.body.end_date || null,
      status: req.body.status,
      description: req.body.description || null
    });

    return res.status(201).json(education);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao cadastrar formação."
    });
  }
}

// Atualizar formação
export async function update(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const validationError = validateEducation(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const education = await Education.update(id, {
      institution: req.body.institution.trim(),
      course: req.body.course.trim(),
      degree_level: req.body.degree_level || null,
      start_date: req.body.start_date,
      end_date: req.body.end_date || null,
      status: req.body.status,
      description: req.body.description || null
    });

    if (!education) {
      return res.status(404).json({
        message: "Formação não encontrada."
      });
    }

    return res.status(200).json(education);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao atualizar formação."
    });
  }
}

// Excluir formação
export async function remove(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const education = await Education.remove(id);

    if (!education) {
      return res.status(404).json({
        message: "Formação não encontrada."
      });
    }

    return res.status(200).json({
      message: "Formação excluída com sucesso.",
      education
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao excluir formação."
    });
  }
}
