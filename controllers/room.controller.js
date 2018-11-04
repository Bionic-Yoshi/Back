/* eslint-disable class-methods-use-this,consistent-return,no-console */
import slugify from 'slugify';
import Room from '../models/room.model';

class RoomController {
  async add(req, res) {
    if (req.user && req.user.email) {
      if (req.body.title) {
        const newRoom = new Room({
          title: req.body.title,
          slug: slugify(req.body.title),
          owner: req.user.email,
          submitDate: new Date(),
          player1: req.user.email,
        });
        try {
          await newRoom.save();
          return res.status(201).json({
            success: true,
            msg: 'New Room is created successfully.',
          });
        } catch (err) {
          if (err.code === 11000) {
            return res
              .status(409)
              .json({ success: false, msg: 'Room Name Already Exist.' });
          }
          return res
            .status(500)
            .json({ success: false, msg: 'Save Room failed.' });
        }
      } else {
        return res
          .status(422)
          .json({ success: false, msg: 'Please pass title Room.' });
      }
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
  }

  async get(req, res, next) {
    if (req.user && req.user.email) {
      try {
        const projects = await Room.find({
          $or: [
            { owner: req.user.email },
            { player2: null },
            { player2: req.user.email },
          ],
        })
          .lean()
          .exec();
        return res.status(200).json(projects);
      } catch (err) {
        return next(err);
      }
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
  }

  async getRoom(req, res, next) {
    if (req.user && req.user.email) {
      if (req.params.slug) {
        try {
          Room.findOne({ slug: req.params.slug }, (err, room) => {
            if (err) {
              return res
                .status(404)
                .json({ success: false, msg: "Room doesn't exist." });
            }
            return res.status(200).json(room);
          });
        } catch (err) {
          return next(err);
        }
      } else {
        return res
          .status(422)
          .json({ success: false, msg: 'Please pass slug Room.' });
      }
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
  }

  async join(req, res) {
    if (req.user && req.user.email) {
      try {
        Room.findOne({ slug: req.params.slug }, (err, room) => {
          if (err) throw err;

          if (!room) {
            return res.status(404).json({
              success: true,
              msg: 'Room Not Found',
            });
          }
          if (room.isFull) {
            return res.status(409).json({
              success: true,
              msg: `Room ${room.title} is Already Full`,
            });
          }
          if (
            room.owner === req.user.email ||
            room.player2 === req.user.email
          ) {
            return res.status(409).json({
              success: true,
              msg: `You are already in Room ${room.title}`,
            });
          }

          room.joinRoom(req.user.email, errJoin => {
            if (errJoin) {
              console.log(errJoin);
              // if user is found and password is right create a token
              // return the information including token as JSON
              return res.status(500).send({
                success: false,
                msg: 'Join Room failed.',
              });
            }
            return res.status(200).json({
              success: true,
              msg: `You have Join Room ${room.title}`,
            });
          });
        });
      } catch (err) {
        return res
          .status(500)
          .json({ success: false, msg: 'Join Room failed.' });
      }
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
  }
}

export default new RoomController();
