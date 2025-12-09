// Serveur Node.js générant un compte à rebours PNG
const express = require("express");
const PImage = require("pureimage");
const { WritableStreamBuffer } = require("stream-buffers");

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================================
// Charger la police OpenSans AVANT toute génération
// ===============================================
let fontReady = false;

const font = PImage.registerFont(
  "./fonts/OpenSans_SemiCondensed-Regular.ttf", // chemin EXACT à ta police
  "OpenSans"                                    // nom utilisé dans ctx.font
);

font.load(() => {
  fontReady = true;
  console.log("📘 Police OpenSans chargée !");
});

// Date limite
const DEADLINE = new Date("2025-12-15T23:59:00-05:00");


// Route d’accueil
app.get("/", (req, res) => {
  res.send("✨ Service Countdown en ligne. Utilise /countdown.png pour voir l’image.");
});


// Route PNG
app.get("/countdown.png", async (req, res) => {

  // 🚦 Assurer que la police est chargée AVANT de dessiner
  if (!fontReady) {
    return res.status(503).send("⏳ Police non prête — réessaye dans 1 seconde…");
  }

  const now = new Date();
  let diff = DEADLINE - now;
  if (diff < 0) diff = 0;

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours   = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));

  const img = PImage.make(400, 120);
  const ctx = img.getContext("2d");

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 400, 120);

  // Titre
  ctx.fillStyle = "white";
  ctx.font = "28pt OpenSans";
  ctx.fillText("Temps restant :", 100, 40);

  // Données du compte à rebours
  ctx.font = "bold 24pt OpenSans";
  ctx.fillText(`${days}j ${hours}h ${minutes}m ${seconds}s`, 100, 90);

  // Conversion PNG
  const buffer = new WritableStreamBuffer();
  await PImage.encodePNGToStream(img, buffer);

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

  res.end(buffer.getContents());
});


// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur countdown en marche sur port ${PORT}`);
});
