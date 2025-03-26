const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "24h"
  });
};



const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Récupérer le token Bearer

  if (!token) return res.status(401).json({ msg: "Accès refusé, token manquant" });

  try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded; // Ajouter l'utilisateur dans req
      next();
  } catch (err) {
      return res.status(403).json({ msg: "Token expiré ou invalide" });
  }
};




module.exports = { generateAccessToken}
