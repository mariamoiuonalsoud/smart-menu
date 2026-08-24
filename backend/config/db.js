// connect to the MongoDB Atlas database using Mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define a schema for the "Mydata" collection in the database
const artfactSchema = new Schema({
  meal_name: { type: String, required: true },
  meal_description: { type: String, required: true },
  meal_size: { type: String, required: true },
  meal_price: { type: Number, required: true },
  category: { type: String, required: true, index: true },
  isHidden: { type: Boolean, default: true },
});

//  Create a Mongoose model based on the defined schema
const Menudata = mongoose.model("Menudata", artfactSchema);

// Export the model for use in other parts of the application
module.exports = Menudata;
