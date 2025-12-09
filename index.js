// Serveur Node.js générant un compte à rebours PNG sans police externe
const express = require("express");
const PImage = require("pureimage");
const { WritableStreamBuffer } = require("stream-buffers");

const app = express();
const PORT = process.env.PORT || 3000;

// Définir la date limite (Fuseau Québec)
const DEADLINE = new Date("2025-12-15T23:59:00-05:00");


// Route d’accueil (optionnelle mais utile)
app.get("/", (req, res) => {
  res.send("✨ Service Countdown en ligne. Utilise /countdown.png pour voir l’image.");
});


// Route qui génère l’image PNG du compte à rebours
app.get("/countdown.png", async (req, res) => {
  const now = new Date();
  let diff = DEADLINE - now;
  if (diff < 0) diff = 0; // Évite les valeurs négatives

  // Calcul du temps restant
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours   = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Créer une image 400x120
  const img = PImage.make(400, 120);
  const ctx = img.getContext("2d");

  // Fond noir
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 400, 120);

  // Titre
  ctx.fillStyle = "white";
  ctx.font = "28pt sans-serif";
  ctx.fillText("Temps restant :", 100, 40);

  // Données du compte à rebours
  ctx.font = "bold 24pt sans-serif";
  ctx.fillText(`${days}j ${hours}h ${minutes}m ${seconds}s`, 100, 90);

  // Conversion en PNG
  const buffer = new WritableStreamBuffer();
  await PImage.encodePNGToStream(img, buffer);

  // Headers
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  // Envoi
  res.end(buffer.getContents());
});


// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur countdown en marche sur port ${PORT}`);
});
