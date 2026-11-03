
import { pool } from "../config/database.js";

// Listar todas as habilidades
export async function findAll() {
  const result = await pool.query(
    "SELECT * FROM skills ORDER BY name ASC"
  );

  return result.rows;
}

// Buscar habilidade por ID
export async function findById(id) {
  const result = await pool.query(
    "SELECT * FROM skills WHERE id = $1",
    [id]
  );

  return result.rows[0];
}

// Cadastrar habilidade
export async function create(skill) {
  const { name, category } = skill;

  const result = await pool.query(
    `INSERT INTO skills (name, category)
     VALUES ($1, $2)
     RETURNING *`,
    [name, category]
  );

  return result.rows[0];
}

// Atualizar habilidade
export async function update(id, skill) {
  const { name, category } = skill;

  const result = await pool.query(
    `UPDATE skills SET
      name = $1,
      category = $2
     WHERE id = $3
     RETURNING *`,
    [name, category, id]
  );

  return result.rows[0];
}

// Excluir habilidade
export async function remove(id) {
  const result = await pool.query(
    `DELETE FROM skills
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
}

// Listar habilidades de uma pessoa
export async function findAllByPersonId(personId) {
  const result = await pool.query(
    `SELECT
      s.id,
      s.name,
      s.category,
      ps.proficiency_level,
      ps.years_experience
    FROM person_skills ps
    INNER JOIN skills s ON s.id = ps.skill_id
    WHERE ps.person_id = $1
    ORDER BY s.name ASC`,
    [personId]
  );

  return result.rows;
}

// Buscar uma habilidade associada a uma pessoa
export async function findPersonSkill(personId, skillId) {
  const result = await pool.query(
    `SELECT
      s.id,
      s.name,
      s.category,
      ps.proficiency_level,
      ps.years_experience
    FROM person_skills ps
    INNER JOIN skills s ON s.id = ps.skill_id
    WHERE ps.person_id = $1
    AND ps.skill_id = $2`,
    [personId, skillId]
  );

  return result.rows[0];
}

// Associar habilidade a uma pessoa
export async function addToPerson(personId, skillId, data) {
  await pool.query(
    `INSERT INTO person_skills (
      person_id,
      skill_id,
      proficiency_level,
      years_experience
    )
    VALUES ($1, $2, $3, $4)`,
    [
      personId,
      skillId,
      data.proficiency_level,
      data.years_experience
    ]
  );

  return findPersonSkill(personId, skillId);
}

// Atualizar associação
export async function updatePersonSkill(
  personId,
  skillId,
  data
) {
  const result = await pool.query(
    `UPDATE person_skills SET
      proficiency_level = $1,
      years_experience = $2
    WHERE person_id = $3
    AND skill_id = $4
    RETURNING *`,
    [
      data.proficiency_level,
      data.years_experience,
      personId,
      skillId
    ]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return findPersonSkill(personId, skillId);
}

// Remover associação
export async function removeFromPerson(personId, skillId) {
  const result = await pool.query(
    `DELETE FROM person_skills
     WHERE person_id = $1
     AND skill_id = $2
     RETURNING *`,
    [personId, skillId]
  );

  return result.rows[0];
}
