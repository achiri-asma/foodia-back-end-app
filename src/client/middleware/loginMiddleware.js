
const bcrypt = require('bcryptjs');
const Client = require('../models/clientModel');
const { generateAccessToken } = require('../../utils/tokens');

// Middleware for login authentication
const loginMiddleware = async (req, res, next) => {
    try {
        const { email, motpasse } = req.body;
        
        if (!email || !motpasse) {
            return res.status(400).json({ message: "L'email et le mot de passe sont requis" });
        }
        
        const client = await Client.findOne({ email });
        if (!client) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        const isMatch = await bcrypt.compare(motpasse, client.motpasse);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mot de passe erroné' });
        }
        
        const token = generateAccessToken(client._id);

        res.status(200).json({ 
            message: 'Connexion réussie',
            token,
            client: { id: client._id, email: client.email, nom: client.nom }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

module.exports = loginMiddleware;

