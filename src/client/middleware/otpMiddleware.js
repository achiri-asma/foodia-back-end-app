const bcrypt = require("bcryptjs");
const UserModel = require("../models/clientModel");
const generateAccessToken = require("../../utils/tokens");
const OTPModel = require("../models/otpModel"); 
const otpGenerator = require("otp-generator");
const { sendOTP } = require("../../utils/email");

exports.generateOTP = async (req, res)=>{
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, msg: "Email requis" });
    }

    // 🔎 Vérifier si un OTP existe déjà pour cet email
    const existingOTP = await OTPModel.findOne({ email });

    // 🕒 Si l'OTP existe et n'a pas encore expiré, empêcher une nouvelle génération
    if (existingOTP && existingOTP.expiresAt > Date.now()) {
      return res.status(400).json({ success: false, msg: "Un OTP est déjà actif, vérifiez votre email !" });
    }

    // 🔄 Générer un nouvel OTP (ex: "12345")
    const otp = otpGenerator.generate(5, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    console.log(`OTP généré pour ${email}: ${otp}`); // 🛠️ Debugging

    // 🔒 Hasher l'OTP avant de le stocker
    const hashedOTP = await bcrypt.hash(otp, 10);

    // 🗑️ Supprimer l'ancien OTP et enregistrer le nouveau
    await OTPModel.findOneAndDelete({ email });
    await OTPModel.deleteMany({ email }); 
    const newOTP = await OTPModel.create({ email, otp: hashedOTP, expiresAt: Date.now() + 5 * 60 * 1000 });

    console.log("OTP sauvegardé en base de données:", newOTP); // 🛠️ Debugging

    // 📩 Envoyer l'OTP par e-mail
await sendOTP(email, otp);
    

    return res.status(200).json({ success: true, msg: "OTP envoyé avec succès !" });

  } catch (err) {
    console.error("Erreur lors de la génération de l'OTP:", err);
    return res.status(500).json({ success: false, msg: "Erreur serveur" });
  }
};


exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Rechercher l'OTP associé à l'e-mail
    const otpRecord = await OTPModel.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ msg: "OTP invalide ou expiré" });
    }

    // Vérifier si l'OTP est expiré
    if (Date.now() > otpRecord.expiresAt){
      await OTPModel.deleteOne({ email });
      return res.status(400).json({ msg: "OTP expiré" });
    }

    // Vérifier si l'OTP est correct
    const isMatch = otpRecord.otp === otp || await bcrypt.compare(otp, otpRecord.otp);
    
    if (!isMatch) {
      return res.status(400).json({ msg: "OTP incorrect" });
    }

    // Mettre à jour `verifie` dans UserModel
    const user = await UserModel.findOneAndUpdate(
      { email },
      { $set: { verifie: true } },
      { new: true } // ✅ Retourner le document mis à jour
    );

    // Supprimer l'OTP après vérification réussie
    await OTPModel.deleteOne({ email });

    const val1 = generateAccessToken(user._id);
    
    
    res.json({ msg: "OTP vérifié avec succès !",user,val1});
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur serveur" });
  }
};




