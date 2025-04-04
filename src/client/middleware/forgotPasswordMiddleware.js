const bcrypt = require('bcryptjs');
const Client = require('../models/clientModel');
const nodemailer = require('nodemailer');
const otpGenerator = require("otp-generator");
const OTPModel = require("../models/otpModel"); 

// Middleware for forgot password
const forgotPasswordMiddleware = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "L'email est requis" });
        }

        const client = await Client.findOne({ email });
        if (!client) {
            return res.status(404).json({ message: "Aucun compte trouvé avec cet email" });
        }

         const otp = otpGenerator.generate(5, {
                  upperCaseAlphabets: false, 
                    specialChars: false, 
                    lowerCaseAlphabets: false 
                 });
            
                // Hasher l'OTP avant de le stocker
        const hashedOTP = await bcrypt.hash(otp, 10);
        await OTPModel.deleteMany({ email }); // Supprime tous les anciens OTP de cet email
        await OTPModel.create({ email, otp: hashedOTP, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
        
        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from:`"Foodia" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Réinitialisation de mot de passe',
            html: `<div style="background-color: #e6f2f2; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 8px;">
  <div style="text-align: center; padding: 20px; background-color: #ffffff; border-radius: 8px;">
    <img src="https://img.icons8.com/ios-filled/50/4CAF50/password.png" alt="Réinitialisation Mot de Passe" style="width: 50px; margin-bottom: 10px;">
    <h2 style="color: #333;">Réinitialisation du mot de passe</h2>
    <p style="color: #666; font-size: 16px;">
      Vous avez demandé à réinitialiser votre mot de passe. Utilisez le code ci-dessous pour procéder :
    </p>
    
    <div style="background-color: #e0f7fa; padding: 10px; display: inline-block; font-size: 24px; font-weight: bold; color: #00796b; margin: 15px 0; border-radius: 5px;">
      ${otp}
    </div>
    
    <p style="color: #666; font-size: 14px;">Ce code est valide pendant 05 minutes.</p>
    
    <p style="color: #666; font-size: 14px; margin-top: 10px;">
      Si vous n'avez pas demandé cette réinitialisation, ignorez cet e-mail.
    </p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
    <p>Besoin d'aide ? <a href="https://yourwebsite.com/help" style="color: #00796b; text-decoration: none;">Contactez-nous</a></p>
    <p>&copy; 2025 Foodia. Tous droits réservés.</p>
  </div>
</div>
`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email de réinitialisation envoyé' });

    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

module.exports = forgotPasswordMiddleware;
