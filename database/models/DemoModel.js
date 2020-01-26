import mongoose from "mongoose";
import beautifyUnique from "mongoose-beautiful-unique-validation";
import validator from "validator";

const DemoSchema = new mongoose.Schema({
  demoValue1: {
    type: String,
    required: true,
    minlength: [4, "The demoValue1 is too short."],
    maxlength: [50, "The demoValue1 is too long."],
    unique: "This demoValue1 already exists in the database, please try again with a different one."
  },
  demoValue2: {
    type: Number,
    min: [1, "The demoValue2 is too small."],
    max: [100, "The demoValue2 is too big."],
    default: 12
  },
  demoValue3: {
    type: String,
    minlength: [8, "The demoValue3 is too short."],
    maxlength: [100, "The demoValue3 is too long."],
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
      return validator.isEmail(value);
    }
  }
});

DemoSchema.statics = {
  create: function(data) {
    const user = new this(data);
    return user.save();
  },
  update: function(query, data) {
    return this.findOneAndUpdate(query, { ...data }, { new: true });
  },
  delete: function(query) {
    return this.findOneAndDelete(query);
  },
  getById: function(query) {
    return this.find({ demoValue1: query });
  }
};

DemoSchema.plugin(beautifyUnique);

export default mongoose.model("Demo", DemoSchema);
