const bcrypt = require('bcryptjs');
const OTPModel = require("../models/otpModel");

const verifyOtpMiddleware = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email et OTP sont requis" });
        }

        // Vérifier si l'OTP existe pour cet email
        const otpRecord = await OTPModel.findOne({ email });
        if (!otpRecord) {
            return res.status(400).json({ message: "OTP invalide ou expiré" });
        }
        
        // Vérifier si l'OTP est expiré
        if (otpRecord.expiresAt < Date.now()) {
            await OTPModel.deleteOne({ email }); // Supprimer l'OTP expiré
            return res.status(400).json({ message: "OTP expiré, veuillez en demander un nouveau" });
        }

        // Comparer l'OTP hashé avec celui entré par l'utilisateur
        const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);
        if (!isOtpValid) {
            return res.status(400).json({ message: "OTP incorrect" });
        }

        res.status(200).json({ message: "OTP vérifié avec succès" });

    } catch (error) {
        console.error("Erreur de vérification de l'OTP:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

module.exports = verifyOtpMiddleware;
