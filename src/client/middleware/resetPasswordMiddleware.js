const bcrypt = require('bcryptjs');
const Client = require('../models/clientModel');

const resetPasswordMiddleware = async (req, res) => { 
    try {
        // Récupérer l'email et le nouveau mot de passe depuis le body
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: "L'email et le nouveau mot de passe sont requis" });
        }

        // Vérifier si l'utilisateur existe avec cet email
        const client = await Client.findOne({ email });

        if (!client) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Hasher le nouveau mot de passe
        client.motpasse = await bcrypt.hash(newPassword, 10);
        await client.save();

        res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });

    } catch (error) {
        console.error("Erreur de réinitialisation du mot de passe:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

module.exports = resetPasswordMiddleware;
