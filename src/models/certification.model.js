
import { pool } from "../config/database.js";

// Listar certificados de uma pessoa
export async function findAllByPersonId(personId) {
  const result = await pool.query(
    `SELECT * FROM certifications
     WHERE person_id = $1
     ORDER BY issue_date DESC NULLS LAST`,
    [personId]
  );

  return result.rows;
}

// Buscar certificado por ID
export async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM certifications WHERE id = $1",
    [id]
  );

  return result.rows[0];
}

// Cadastrar certificado
export async function create(certification) {
  const {
    person_id,
    name,
    institution,
    issue_date,
    expiration_date,
    credential_url
  } = certification;

  const result = await pool.query(
    `INSERT INTO certifications (
      person_id,
      name,
      institution,
      issue_date,
      expiration_date,
      credential_url
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      person_id,
      name,
      institution,
      issue_date,
      expiration_date,
      credential_url
    ]
  );

  return result.rows[0];
}

// Atualizar certificado
export async function update(id, certification) {
  const {
    name,
    institution,
    issue_date,
    expiration_date,
    credential_url
  } = certification;

  const result = await pool.query(
    `UPDATE certifications SET
      name = $1,
      institution = $2,
      issue_date = $3,
      expiration_date = $4,
      credential_url = $5
    WHERE id = $6
    RETURNING *`,
    [
      name,
      institution,
      issue_date,
      expiration_date,
      credential_url,
      id
    ]
  );

  return result.rows[0];
}

// Excluir certificado
export async function remove(id) {
  const result = await pool.query(
    `DELETE FROM certifications
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
}
