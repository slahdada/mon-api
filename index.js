const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API fonctionne" });
});

app.get("/api/bonjour", (req, res) => {
  res.json({ message: "Bonjour !" });
});

app.post("/api/data", (req, res) => {
  const nom = req.body.name || "inconnu";
  res.json({ message: "Bonjour " + nom + " !" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Port " + PORT);
});
