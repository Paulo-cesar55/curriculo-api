
import * as Person from "../models/person.model.js";

// Validar o ID recebido pela URL
function validId(id) {
  return /^\d+$/.test(id) && BigInt(id) > 0n;
}

// Validar os dados obrigatórios
function validatePerson(body) {
  if (
    !body.full_name ||
    typeof body.full_name !== "string" ||
    !body.full_name.trim()
  ) {
    return "O nome completo é obrigatório.";
  }

  if (
    !body.email ||
    typeof body.email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
  ) {
    return "Informe um e-mail válido.";
  }

  return null;
}

// Listar pessoas
export async function getAll(req, res) {
  try {
    const persons = await Person.findAll();
    return res.status(200).json(persons);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao listar pessoas."
    });
  }
}

// Buscar pessoa por ID
export async function getById(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const person = await Person.findById(id);

    if (!person) {
      return res.status(404).json({
        message: "Pessoa não encontrada."
      });
    }

    return res.status(200).json(person);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao buscar pessoa."
    });
  }
}

// Cadastrar pessoa
export async function create(req, res) {
  try {
    const validationError = validatePerson(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const person = await Person.create({
      ...req.body,
      full_name: req.body.full_name.trim(),
      email: req.body.email.trim().toLowerCase()
    });

    return res.status(201).json(person);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Este e-mail já está cadastrado."
      });
    }

    return res.status(500).json({
      message: "Erro ao cadastrar pessoa."
    });
  }
}

// Atualizar pessoa
export async function update(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const validationError = validatePerson(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const person = await Person.update(id, {
      ...req.body,
      full_name: req.body.full_name.trim(),
      email: req.body.email.trim().toLowerCase()
    });

    if (!person) {
      return res.status(404).json({
        message: "Pessoa não encontrada."
      });
    }

    return res.status(200).json(person);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Este e-mail já está cadastrado."
      });
    }

    return res.status(500).json({
      message: "Erro ao atualizar pessoa."
    });
  }
}

// Excluir pessoa
export async function remove(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const person = await Person.remove(id);

    if (!person) {
      return res.status(404).json({
        message: "Pessoa não encontrada."
      });
    }

    return res.status(200).json({
      message: "Pessoa excluída com sucesso.",
      person
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao excluir pessoa."
    });
  }
}
