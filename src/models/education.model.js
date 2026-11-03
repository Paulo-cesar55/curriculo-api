
import { pool } from "../config/database.js";

// Buscar formações de uma pessoa
export async function findAllByPersonId(personId) {
  const result = await pool.query(
    `SELECT * FROM education
     WHERE person_id = $1
     ORDER BY start_date DESC`,
    [personId]
  );

  return result.rows;
}

// Buscar formação por ID
export async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM education WHERE id = $1",
    [id]
  );

  return result.rows[0];
}

// Cadastrar formação
export async function create(education) {
  const {
    person_id,
    institution,
    course,
    degree_level,
    start_date,
    end_date,
    status,
    description
  } = education;

  const result = await pool.query(
    `INSERT INTO education (
      person_id,
      institution,
      course,
      degree_level,
      start_date,
      end_date,
      status,
      description
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      person_id,
      institution,
      course,
      degree_level,
      start_date,
      end_date,
      status,
      description
    ]
  );

  return result.rows[0];
}

// Atualizar formação
export async function update(id, education) {
  const {
    institution,
    course,
    degree_level,
    start_date,
    end_date,
    status,
    description
  } = education;

  const result = await pool.query(
    `UPDATE education SET
      institution = $1,
      course = $2,
      degree_level = $3,
      start_date = $4,
      end_date = $5,
      status = $6,
      description = $7
    WHERE id = $8
    RETURNING *`,
    [
      institution,
      course,
      degree_level,
      start_date,
      end_date,
      status,
      description,
      id
    ]
  );

  return result.rows[0];
}

// Excluir formação
export async function remove(id) {
  const result = await pool.query(
    `DELETE FROM education
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
}
