
import * as Certification from "../models/certification.model.js";
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

function validateCertification(body) {
  if (
    typeof body.name !== "string" ||
    !body.name.trim()
  ) {
    return "O nome do certificado é obrigatório.";
  }

  if (
    body.institution !== undefined &&
    body.institution !== null &&
    typeof body.institution !== "string"
  ) {
    return "A instituição deve ser um texto.";
  }

  if (
    body.issue_date !== null &&
    body.issue_date !== undefined &&
    !validDate(body.issue_date)
  ) {
    return "Informe uma data de emissão válida.";
  }

  if (
    body.expiration_date !== null &&
    body.expiration_date !== undefined &&
    !validDate(body.expiration_date)
  ) {
    return "Informe uma data de validade válida.";
  }

  if (
    body.issue_date &&
    body.expiration_date &&
    body.expiration_date < body.issue_date
  ) {
    return "A validade não pode ser anterior à emissão.";
  }

  if (!validOptionalUrl(body.credential_url)) {
    return "Informe uma URL válida para o certificado.";
  }

  return null;
}

// Listar certificados de uma pessoa
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

    const certifications =
      await Certification.findAllByPersonId(personId);

    return res.status(200).json(certifications);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao listar certificados."
    });
  }
}

// Buscar certificado por ID
export async function getById(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const certification = await Certification.findById(id);

    if (!certification) {
      return res.status(404).json({
        message: "Certificado não encontrado."
      });
    }

    return res.status(200).json(certification);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar certificado."
    });
  }
}

// Cadastrar certificado
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

    const validationError = validateCertification(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const certification = await Certification.create({
      person_id: personId,
      name: req.body.name.trim(),
      institution: req.body.institution?.trim() || null,
      issue_date: req.body.issue_date || null,
      expiration_date: req.body.expiration_date || null,
      credential_url: req.body.credential_url || null
    });

    return res.status(201).json(certification);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao cadastrar certificado."
    });
  }
}

// Atualizar certificado
export async function update(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const validationError = validateCertification(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const certification = await Certification.update(id, {
      name: req.body.name.trim(),
      institution: req.body.institution?.trim() || null,
      issue_date: req.body.issue_date || null,
      expiration_date: req.body.expiration_date || null,
      credential_url: req.body.credential_url || null
    });

    if (!certification) {
      return res.status(404).json({
        message: "Certificado não encontrado."
      });
    }

    return res.status(200).json(certification);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao atualizar certificado."
    });
  }
}

// Excluir certificado
export async function remove(req, res) {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        message: "ID inválido."
      });
    }

    const certification = await Certification.remove(id);

    if (!certification) {
      return res.status(404).json({
        message: "Certificado não encontrado."
      });
    }

    return res.status(200).json({
      message: "Certificado excluído com sucesso.",
      certification
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao excluir certificado."
    });
  }
}
