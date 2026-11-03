
import { pool } from "../config/database.js";

// Listar experiências de uma pessoa
export async function findAllByPersonId(personId) {
  const result = await pool.query(
    `SELECT * FROM experiences
     WHERE person_id = $1
     ORDER BY start_date DESC`,
    [personId]
  );

  return result.rows;
}

// Buscar experiência por ID
export async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM experiences WHERE id = $1",
    [id]
  );

  return result.rows[0];
}

// Cadastrar experiência
export async function create(experience) {
  const {
    person_id,
    company,
    role,
    employment_type,
    location,
    start_date,
    end_date,
    is_current,
    description
  } = experience;

  const result = await pool.query(
    `INSERT INTO experiences (
      person_id,
      company,
      role,
      employment_type,
      location,
      start_date,
      end_date,
      is_current,
      description
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
      person_id,
      company,
      role,
      employment_type,
      location,
      start_date,
      end_date,
      is_current,
      description
    ]
  );

  return result.rows[0];
}

// Atualizar experiência
export async function update(id, experience) {
  const {
    company,
    role,
    employment_type,
    location,
    start_date,
    end_date,
    is_current,
    description
  } = experience;

  const result = await pool.query(
    `UPDATE experiences SET
      company = $1,
      role = $2,
      employment_type = $3,
      location = $4,
      start_date = $5,
      end_date = $6,
      is_current = $7,
      description = $8
    WHERE id = $9
    RETURNING *`,
    [
      company,
      role,
      employment_type,
      location,
      start_date,
      end_date,
      is_current,
      description,
      id
    ]
  );

  return result.rows[0];
}

// Excluir experiência
export async function remove(id) {
  const result = await pool.query(
    `DELETE FROM experiences
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
}
