import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const { Schema } = mongoose;
mongoose.set('useCreateIndex', true);
const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

UserSchema.pre('save', function preSave(next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    // eslint-disable-next-line consistent-return
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }
      // eslint-disable-next-line consistent-return
      bcrypt.hash(user.password, salt, null, (errHash, hash) => {
        if (errHash) {
          return next(errHash);
        }
        user.password = hash;
        next();
      });
    });
  }
  return next();
});

UserSchema.methods.comparePassword = function comparePassword(passw, cb) {
  // eslint-disable-next-line consistent-return
  bcrypt.compare(passw, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

export default mongoose.model('User', UserSchema);
