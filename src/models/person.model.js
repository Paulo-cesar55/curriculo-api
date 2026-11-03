
import { pool } from "../config/database.js";

// Listar todas as pessoas
export async function findAll() {
  const result = await pool.query(
    "SELECT * FROM persons ORDER BY id ASC"
  );

  return result.rows;
}

// Buscar uma pessoa pelo ID
export async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM persons WHERE id = $1",
    [id]
  );

  return result.rows[0];
}

// Cadastrar uma pessoa
export async function create(person) {
  const {
    full_name,
    email,
    phone,
    city,
    state,
    bio,
    linkedin_url,
    github_url,
    portfolio_url
  } = person;

  const result = await pool.query(
    `INSERT INTO persons (
      full_name,
      email,
      phone,
      city,
      state,
      bio,
      linkedin_url,
      github_url,
      portfolio_url
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
      full_name,
      email,
      phone,
      city,
      state,
      bio,
      linkedin_url,
      github_url,
      portfolio_url
    ]
  );

  return result.rows[0];
}

// Atualizar uma pessoa
export async function update(id, person) {
  const {
    full_name,
    email,
    phone,
    city,
    state,
    bio,
    linkedin_url,
    github_url,
    portfolio_url
  } = person;

  const result = await pool.query(
    `UPDATE persons SET
      full_name = $1,
      email = $2,
      phone = $3,
      city = $4,
      state = $5,
      bio = $6,
      linkedin_url = $7,
      github_url = $8,
      portfolio_url = $9
    WHERE id = $10
    RETURNING *`,
    [
      full_name,
      email,
      phone,
      city,
      state,
      bio,
      linkedin_url,
      github_url,
      portfolio_url,
      id
    ]
  );

  return result.rows[0];
}

// Excluir uma pessoa
export async function remove(id) {
  const result = await pool.query(
    "DELETE FROM persons WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
}
