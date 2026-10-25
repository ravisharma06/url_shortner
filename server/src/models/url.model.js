import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2048,
      validate: {
        validator(value) {
          try {
            const { protocol } = new URL(value);
            return protocol === 'http:' || protocol === 'https:';
          } catch {
            return false;
          }
        },
        message: 'originalUrl must be a valid HTTP or HTTPS URL',
      },
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Url = mongoose.model('Url', urlSchema);

export default Url;
