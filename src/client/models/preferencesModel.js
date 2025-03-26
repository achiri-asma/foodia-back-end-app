const mongoose = require("mongoose");

const preferenceSchema = new mongoose.Schema({
  nomPreference: {
    type: String,
    required: true,
    enum: ["allergenes","choix_alim","ethique"]
  },
  sousPreferences: [{ type: String }],
  client: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client"
    }
   
});

const Preference = mongoose.model("Preference", preferenceSchema);

module.exports = Preference;
