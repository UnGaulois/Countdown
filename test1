// Serveur Node.js pour générer un compte à rebours en image
const express = require("express");
const { createCanvas } = require("canvas");
const app = express();

const PORT = process.env.PORT || 3000;
const DEADLINE = new Date("2025-12-15T23:59:00-05:00"); // fuseau horaire Québec

app.get("/countdown.png", (req, res) => {
  const now = new Date();
  let diff = DEADLINE - now;

  if (diff < 0) diff = 0;

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const canvas = createCanvas(400, 120);
  const ctx = canvas.getContext("2d");

  // Fond
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Texte
  ctx.fillStyle = "#fff";
  ctx.font = "28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Temps restant :", canvas.width / 2, 40);

  ctx.font = "bold 36px monospace";
  ctx.fillText(
    `${days}j ${hours}h ${minutes}m ${seconds}s`,
    canvas.width / 2,
    90
  );

  // En-têtes pour éviter le cache
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  canvas.pngStream().pipe(res);
});

app.listen(PORT, () => {
  console.log(`Serveur countdown en marche sur http://localhost:${PORT}`);
});
