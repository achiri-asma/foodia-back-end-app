const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    photoProfil: {
      type: String,
      default: "./src/images/default-profile.png"
    },
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    prenom: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
    },
    motpasse:{
      type: String,
      minlength: 8,
    },
  
    nombreScan: {
      type: Number,
      default: 0,
    },
    nombrePoint: {
      type: Number,
      default: 0,
    },
    verifie: {
      type: Boolean,
      default: false, 
    },
    longitude: {
      type: Number, 
    },
    latitude: {
      type: Number,
    },
    link:{
      type: String,
    }
  },
  {timestamps:true}
);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
