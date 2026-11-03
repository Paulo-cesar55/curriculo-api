
import { pool } from "../config/database.js";

// Listar projetos de uma pessoa
export async function findAllByPersonId(personId) {
  const result = await pool.query(
    `SELECT * FROM projects
     WHERE person_id = $1
     ORDER BY is_featured DESC, id DESC`,
    [personId]
  );

  return result.rows;
}

// Buscar projeto por ID
export async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM projects WHERE id = $1",
    [id]
  );

  return result.rows[0];
}

// Cadastrar projeto
export async function create(project) {
  const {
    person_id,
    title,
    description,
    repository_url,
    demo_url,
    start_date,
    end_date,
    is_featured
  } = project;

  const result = await pool.query(
    `INSERT INTO projects (
      person_id,
      title,
      description,
      repository_url,
      demo_url,
      start_date,
      end_date,
      is_featured
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      person_id,
      title,
      description,
      repository_url,
      demo_url,
      start_date,
      end_date,
      is_featured
    ]
  );

  return result.rows[0];
}

// Atualizar projeto
export async function update(id, project) {
  const {
    title,
    description,
    repository_url,
    demo_url,
    start_date,
    end_date,
    is_featured
  } = project;

  const result = await pool.query(
    `UPDATE projects SET
      title = $1,
      description = $2,
      repository_url = $3,
      demo_url = $4,
      start_date = $5,
      end_date = $6,
      is_featured = $7
    WHERE id = $8
    RETURNING *`,
    [
      title,
      description,
      repository_url,
      demo_url,
      start_date,
      end_date,
      is_featured,
      id
    ]
  );

  return result.rows[0];
}

// Excluir projeto
export async function remove(id) {
  const result = await pool.query(
    `DELETE FROM projects
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
}
