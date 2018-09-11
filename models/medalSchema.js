let mongoose = require('mongoose');

let medalSchema = mongoose.Schema({
    name:{
      type: String,
      required: true
   },
   sex:{
    type: String,
    required: true
   },
    year:{
      type: Number,
      required: true
   },
    location:{
      type: String,
      required: true
   },
    sport:{
      type: String,
      required: true
   },
    note:{
      type: String,
      required: true
   }
  });
  let Medal = module.exports = mongoose.model('Medal', medalSchema);
  