const bcrypt = require("bcryptjs");
const Client = require("../models/clientModel"); // Modèle Client
const otpGenerator = require("otp-generator");
const { sendOTP } = require("../../utils/email");
const OTPModel = require("../models/otpModel"); // Modèle pour stocker les OTP
const crypto = require("crypto");

exports.signupMiddleware = async (req, res) => {
  try {
    const { nom, prenom, email, motpasse } = req.body;
   
    // Vérifier si l'email existe déjà
    let clientExists = await Client.findOne({ email });
    if (clientExists) {
      return res.status(400).json({ msg: "Email déjà utilisé" });
    }

    const otp = otpGenerator.generate(5, {
          upperCaseAlphabets: false, 
            specialChars: false, 
            lowerCaseAlphabets: false 
         });
    
        // Hasher l'OTP avant de le stocker
     const hashedOTP = await bcrypt.hash(otp, 10);

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedMotpasse = await bcrypt.hash(motpasse, salt);

    const uniqueCode = crypto.randomBytes(6).toString("hex");  
    const dynamicLink = `https://foodia-app.com/invite/${uniqueCode}`; 
    // Créer un nouveau client
    const client = new Client({
      nom,
      prenom,
      email,
      motpasse: hashedMotpasse,
      link:dynamicLink,
    });

    // Sauvegarder le client
    await client.save();

     // Enregistrer l'OTP dans la base de données avec expiration (10 min)
     await OTPModel.create({ email, otp: hashedOTP, expiresAt: Date.now() + 10 * 60 * 1000});
 
     // Envoyer l'OTP par e-mail
     await sendOTP(email, otp);

    res.status(201).json({
      msg: "Compte créé avec succès",
      client,
      msg: "email envoyé",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur serveur" });
  }
};
