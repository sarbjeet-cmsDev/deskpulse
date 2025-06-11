import * as mongoose from 'mongoose';

const FaqSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sort_order: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      enum: ['terms', 'payment', 'contact', 'help', 'support'],
      required: true,
    },
    videoUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

export default FaqSchema;
