// Route affichage numérique type "digital clock"
app.get("/countdown.png", async (req, res) => {
  if (!fontReady) {
    return res.status(503).send("⏳ Police non prête — réessaye dans une seconde.");
  }

  const now = new Date();
  let diff = DEADLINE - now;
  if (diff < 0) diff = 0;

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours   = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Format digital style : HH:MM:SS
  const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Taille finale de l'image
  const width = 400;
  const height = 150;

  const img = PImage.make(width, height);
  const ctx = img.getContext("2d");

  // Fond global transparent (ou noir selon besoins)
  ctx.fillStyle = "transparent";
  ctx.fillRect(0, 0, width, height);

  // Rectangle arrondi blanc
  ctx.fillStyle = "white";
  roundRect(ctx, 20, 20, width - 40, height - 40, 25);
  ctx.fill();

  // Texte numérique rouge
  ctx.fillStyle = "#ff2a2a";        // rouge digital
  ctx.font = "48pt ShareTechMono";  // Police digitale
  ctx.textAlign = "center";

  ctx.fillText(timeStr, width / 2, height / 2 + 20);

  // Conversion PNG
  const buffer = new WritableStreamBuffer();
  await PImage.encodePNGToStream(img, buffer);

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

  res.end(buffer.getContents());
});


// Utilitaire pour dessiner un rectangle arrondi
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
