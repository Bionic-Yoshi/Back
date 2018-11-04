/* eslint-disable class-methods-use-this */
import config from '../config/db';
import User from '../models/user.model';

const jwt = require('jsonwebtoken');

class Auth {
  signUp(req, res) {
    if (!req.body.email || !req.body.password) {
      res
        .status(422)
        .json({ success: false, msg: 'Please pass username and password.' });
    } else {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password,
      });
      // save the user
      newUser.save(err => {
        if (err) {
          return res
            .status(409)
            .json({ success: false, msg: 'Username already exists.' });
        }
        const token = jwt.sign(newUser.toJSON(), config.secret, {
          expiresIn: '7d',
        });
        // return the information including token as JSON
        return res.status(201).json({
          success: true,
          msg: 'Successful created new user.',
          token: `JWT ${token}`,
        });
      });
    }
  }

  signIn(req, res) {
    if (!req.body.email || !req.body.password) {
      res
        .status(422)
        .json({ success: false, msg: 'Please pass username and password.' });
    } else {
      User.findOne(
        {
          email: req.body.email,
        },
        (err, user) => {
          if (err) throw err;

          if (!user) {
            res.status(401).send({
              success: false,
              msg: 'Authentication failed. User not found.',
            });
          } else {
            // check if password matches
            user.comparePassword(
              req.body.password,
              (errComparePassword, isMatch) => {
                if (isMatch && !errComparePassword) {
                  // if user is found and password is right create a token
                  const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: '7d',
                  });
                  // return the information including token as JSON
                  res
                    .status(200)
                    .json({ success: true, token: `JWT ${token}` });
                } else {
                  res.status(401).send({
                    success: false,
                    msg: 'Authentication failed. Wrong password.',
                  });
                }
              },
            );
          }
        },
      );
    }
  }
}

export default new Auth();
