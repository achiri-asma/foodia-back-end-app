const jwt = require("jsonwebtoken");
const Client = require("../models/clientModel");
const Preference = require("../models/preferencesModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const ajouterPreferenceAuClient = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token manquant, accès non autorisé" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérification renforcée de l'ID
    if (!decoded.userId || !mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return res.status(400).json({ message: "ID utilisateur invalide dans le token" });
    }

    const clientId = new ObjectId(decoded.userId);

    // Vérifier si le client existe avec populate pour debug
    const client = await Client.findById(clientId)
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }

    const { nomPreference, sousPreference } = req.body; // matching avec la requête
    let preference; // Déclaration explicite

    // Validation du nom de préférence
    if (!["allergenes", "choix_alim", "ethique"].includes(nomPreference?.toLowerCase())) {
      return res.status(400).json({ message: "Catégorie invalide" });
    }

    // Création de la préférence
    preference = new Preference({
      nomPreference: nomPreference.toLowerCase(),
      sousPreferences: sousPreference, // matching avec le nom de la requête
      client:clientId
    });

    await preference.save();
    
    res.status(201).json(preference);

  } catch (error) {
    console.error("Erreur détaillée :", error);
    return res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message // Ajout du message d'erreur pour le debug
    });
  }
};

module.exports = { ajouterPreferenceAuClient };