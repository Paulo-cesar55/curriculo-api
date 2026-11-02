
import express from "express";
import { pool } from "./config/database.js";
import cors from "cors";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota inicial
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API de Currículos funcionando!"
  });
});

// Rota para verificar o funcionamento da API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Servidor funcionando corretamente!"
  });
});

app.get("/api/health/db", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS current_time"
    );

    res.status(200).json({
      status: "OK",
      database: "connected",
      time: result.rows[0].current_time
    });

  } catch (error) {
    console.error("Erro ao conectar com o banco:", error.message);

    res.status(500).json({
      status: "ERROR",
      database: "disconnected"
    });
  }
});


export default app;
