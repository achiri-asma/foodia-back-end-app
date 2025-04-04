const axios = require("axios");
const client = require("../models/clientModel");
const { generateAccessToken } = require('../../utils/tokens');
const crypto = require("crypto");

const loginGoogleMiddleware = async (req, res, next) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ error: "Access token is required" });
  }

  try {
    const googleResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, given_name, family_name, picture } = googleResponse.data;
    let user = await client.findOne({ email });

    if (!user) {
      const uniqueCode = crypto.randomBytes(6).toString("hex");
      const dynamicLink = `https://foodia-app.com/invite/${uniqueCode}`;

      // Création du nouvel utilisateur
      const newUser = new client({
        photoProfil: picture,
        nom: family_name,
        prenom: given_name,
        email: email,
        verifie: true,
        link: dynamicLink,
      });

      user = await newUser.save(); // Suppression du 'let' ici

      const token = generateAccessToken(user._id);
      return res.status(201).json({ // Ajout du return pour éviter l'exécution suivante
        message: "successfuly created",
        user,
        token
      });
    }

    // Cas utilisateur existant
    const token = generateAccessToken(user._id);
    res.status(200).json({
      message: "success",
      user,
      token
    });

  } catch (error) {
    console.error("Error fetching user info:", error);
    
    // Gestion des erreurs spécifiques
    if (error.code === 11000) {
      return res.status(409).json({ error: "User already exists" });
    }
    
    res.status(500).json({ 
      error: error.response?.data?.error || "Failed to fetch user info" 
    });
  }
};

module.exports = loginGoogleMiddleware;