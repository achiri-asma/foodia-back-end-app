const nodemailer = require("nodemailer");
require("dotenv").config();

// Configuration du transporteur SMTP (utilisation de Gmail ici)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fonction pour envoyer l'OTP par e-mail
exports.sendOTP = async (email, otp) => {
  const mailOptions = {
    from:`"Foodia" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Votre Code OTP",
    html: `
    <div style="background-color: #e6f2f2; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 8px;">
      <div style="text-align: center; padding: 20px; background-color: #ffffff; border-radius: 8px;">
        <img src="https://img.icons8.com/ios-filled/50/4CAF50/secured-letter.png" alt="Email Confirmation" style="width: 50px; margin-bottom: 10px;">
        <h2 style="color: #333;">Confirmez votre e-mail</h2>
        <p style="color: #666; font-size: 16px;">
          Veuillez utiliser le code ci-dessous pour valider votre adresse e-mail et confirmer que vous êtes bien le propriétaire de ce compte.
        </p>
        <div style="background-color: #e0f7fa; padding: 10px; display: inline-block; font-size: 24px; font-weight: bold; color: #00796b; margin: 15px 0; border-radius: 5px;">
          ${otp}
        </div>
        <p style="color: #666; font-size: 14px;">Ce code est valide pendant 05 min </p>
       
        <p style="color: #666; font-size: 14px; margin-top: 10px;">
          Si vous n'avez pas demandé ce code, ignorez cet e-mail.
        </p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>Besoin d'aide ? <a href="https://yourwebsite.com/help" style="color: #00796b; text-decoration: none;">Contactez-nous</a></p>
        <p>&copy; 2025 Foodia . Tous droits réservés.</p>
         </div>
           </div>
    </div>
  `,
  };

  await transporter.sendMail(mailOptions);
};
