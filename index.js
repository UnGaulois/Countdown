// Serveur Node.js avec pureimage pour générer un compte à rebours PNG
const express = require("express");
const PImage = require("pureimage");
const { WritableStreamBuffer } = require("stream-buffers");

const app = express();
const PORT = process.env.PORT || 3000;
const DEADLINE = new Date("2025-12-15T23:59:00-05:00"); // Heure du Québec

app.get("/countdown.png", async (req, res) => {
  const now = new Date();
  let diff = DEADLINE - now;
  if (diff < 0) diff = 0;

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const img = PImage.make(400, 120);
  const ctx = img.getContext("2d");

  // Fond noir
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 400, 120);

  // Texte blanc
  ctx.fillStyle = "white";
  ctx.font = PImage.registerFont("./arial.ttf", "Arial");
  await ctx.font.load();
  ctx.font = "28pt Arial";
  ctx.fillText("Temps restant :", 100, 40);

  ctx.font = "bold 24pt Arial";
  ctx.fillText(`${days}j ${hours}h ${minutes}m ${seconds}s`, 100, 90);

  // Convertir l'image en buffer PNG
  const buffer = new WritableStreamBuffer();
  PImage.encodePNGToStream(img, buffer).then(() => {
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.end(buffer.getContents());
  });
});

app.listen(PORT, () => {
  console.log(`Serveur countdown en marche sur http://localhost:${PORT}`);
});
