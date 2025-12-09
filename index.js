// Serveur Node.js générant un compte à rebours PNG stylé "digital"
const express = require("express");
const PImage = require("pureimage");
const { WritableStreamBuffer } = require("stream-buffers");

const app = express();
const PORT = process.env.PORT || 3000;

// =======================================================
// Charger la police numérique ShareTechMono
// =======================================================
let fontReady = false;

const digitalFont = PImage.registerFont(
  "./fonts/ShareTechMono-Regular.ttf",
  "ShareTechMono"
);

digitalFont.load(() => {
  fontReady = true;
  console.log("🔢 Police numérique ShareTechMono chargée !");
});

// =======================================================
// Date limite (fuseau Québec)
// =======================================================
const DEADLINE = new Date("2025-12-15T23:59:00-05:00");

// Route accueil
app.get("/", (req, res) => {
  res.send("✨ Service Countdown en ligne. Image sur /countdown.png");
});

// =======================================================
// Route PNG — style digital sur fond blanc
// =======================================================
app.get("/countdown.png", async (req, res) => {
  if (!fontReady) {
    return res.status(503).send("⏳ Police non prête — réessaye dans une seconde.");
  }

  const now = new Date();
  let diff = DEADLINE - now;
  if (diff < 0) diff = 0;

  // Calcul du temps restant
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const seconds = Math.floor(diff / 1000) % 60;

  // Format digital : DD:HH:MM:SS
  const timeStr =
    `${String(days).padStart(2, "0")}:` +
    `${String(hours).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;

  // Taille finale
  const width = 500;
  const height = 200;

  const img = PImage.make(width, height);
  const ctx = img.getContext("2d");

  // Fond blanc
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  // Rectangle arrondi gris clair
  ctx.fillStyle = "#f0f0f0"; 
  roundRect(ctx, 40, 40, width - 80, height - 80, 30);
  ctx.fill();

  // Texte numérique rouge
  ctx.fillStyle = "#ff2a2a";
  ctx.font = "72pt ShareTechMono";
  ctx.textAlign = "center";
  ctx.fillText(timeStr, width / 2, height / 2 + 25);

  // Conversion PNG
  const buffer = new WritableStreamBuffer();
  await PImage.encodePNGToStream(img, buffer);

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "no-store"); // pour s'assurer du rafraîchissement

  res.end(buffer.getContents());
});

// =======================================================
// Fonction rectangle arrondi
// =======================================================
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// =======================================================
// Démarrer le serveur
// =======================================================
app.listen(PORT, () => {
  console.log(`🚀 Serveur countdown en marche sur port ${PORT}`);
});
