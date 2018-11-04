/* eslint-disable class-methods-use-this */
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.model';
import config from './db'; // get db config file

class PassportManager {
  initialize() {
    const opts = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      secretOrKey: config.secret,
    };
    passport.use(
      new Strategy(opts, (jwtPayload, done) => {
        User.findOne({ email: jwtPayload.email }, (err, user) => {
          if (err) {
            return done(err, false);
          }
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        });
      }),
    );
    return passport.initialize();
  }

  authenticate(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        if (!info) {
          return res.status(401).json({ message: 'Your token has expired.' });
        }
        if (info.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Your token has expired.' });
        }
        return res.status(401).json({ message: info.message });
      }
      req.user = user;
      return next();
    })(req, res, next);
  }
}

export default new PassportManager();
