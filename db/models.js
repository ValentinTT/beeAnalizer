const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataSchema = new Schema({
  time: {
    type: Date,
    required: true
  },
  innerTemperature: {
    type: Number,
    required: true
  },
  innerHumidity: {
    type: Number,
    required: true
  },
  entrance: {
    type: Number,
    required: true
  },
  outterTemperature: {
    type: Number,
    required: false
  },
  outterHumidity: {
    type: Number,
    required: false
  },
  safe: {
    type: Number,
    required: true
  },
  fumes: {
    type: Number,
    required: false
  }
});
const hiveSchema = new Schema({
  id: {
    type: Number
  },
  data: [dataSchema]
});
const apiarySchema = new Schema({
  apiaryName: {
    type: String,
    required: true
  },
  hives: [hiveSchema]
});
const beekeeperSchema = new Schema({
  googleId: {
    type: String,
    required: true
  },
  googleName: {
    type: String,
    required: true
  },
  googlePhotoUrl: {
    type: String,
    required: true
  },
  apiaries: [apiarySchema]
});

export const Beekeeper = mongoose.model("Beekeeper", beekeeperSchema);