
import * as Project from "../models/project.model.js";
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

function validOptionalUrl(value) {
  if (value === null || value === undefined || value === "") {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  try {
    const url = new URL(value);

    return url.protocol === "http:" ||
      url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateProject(body) {
  if (
    typeof body.title !== "string" ||
    !body.title.trim()
  ) {
    return "O título do projeto é obrigatório.";
  }

  if (
    !validOptionalUrl(body.repository_url) ||
    !validOptionalUrl(body.demo_url)
  ) {
    return "Informe URLs válidas para o projeto.";
  }

  if (
    body.start_date !== null &&
    body.start_date !== undefined &&
    !validDate(body.start_date)
  ) {
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
    body.start_date &&
    body.end_date &&
    body.end_date < body.start_date
  ) {
    return "A data final não pode ser anterior à inicial.";
  }

  if (
    body.is_featured !== undefined &&
    typeof body.is_featured !== "boolean"
  ) {
    return "O campo is_featured deve ser verdadeiro ou falso.";
  }

  return null;
}

// Listar projetos de uma pessoa
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

    const projects = await Project.findAllByPersonId(personId);

    return res.status(200).json(projects);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao listar projetos."
    });
  }
}

// Buscar projeto por ID
export async function getById(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        message: "Projeto não encontrado."
      });
    }

    return res.status(200).json(project);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar projeto."
    });
  }
}

// Cadastrar projeto
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

    const validationError = validateProject(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const project = await Project.create({
      person_id: personId,
      title: req.body.title.trim(),
      description: req.body.description || null,
      repository_url: req.body.repository_url || null,
      demo_url: req.body.demo_url || null,
      start_date: req.body.start_date || null,
      end_date: req.body.end_date || null,
      is_featured: req.body.is_featured ?? false
    });

    return res.status(201).json(project);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao cadastrar projeto."
    });
  }
}

// Atualizar projeto
export async function update(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const validationError = validateProject(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const project = await Project.update(id, {
      title: req.body.title.trim(),
      description: req.body.description || null,
      repository_url: req.body.repository_url || null,
      demo_url: req.body.demo_url || null,
      start_date: req.body.start_date || null,
      end_date: req.body.end_date || null,
      is_featured: req.body.is_featured ?? false
    });

    if (!project) {
      return res.status(404).json({
        message: "Projeto não encontrado."
      });
    }

    return res.status(200).json(project);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao atualizar projeto."
    });
  }
}

// Excluir projeto
export async function remove(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const project = await Project.remove(id);

    if (!project) {
      return res.status(404).json({
        message: "Projeto não encontrado."
      });
    }

    return res.status(200).json({
      message: "Projeto excluído com sucesso.",
      project
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao excluir projeto."
    });
  }
}
