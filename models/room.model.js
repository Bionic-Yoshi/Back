/* eslint-disable no-console */
import mongoose from 'mongoose';
import wss from '../wss';

const { Schema } = mongoose;

const RoomSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: String,
    required: true,
  },
  player1: {
    type: String,
    required: true,
  },
  player2: {
    type: String,
    required: false,
    default: null,
  },
  isFull: {
    type: Boolean,
    required: false,
    default: false,
  },
  close: {
    type: Boolean,
    required: false,
    default: false,
  },
  winner: {
    type: String,
    required: false,
    default: null,
  },
  submitDate: {
    type: Date,
    required: true,
  },
});

RoomSchema.post('save', room => {
  // eslint-disable-next-line consistent-return
  wss.clients.forEach(client => {
    if (client.user) {
      client.send(JSON.stringify({ type: 'updateRoom', payload: room }));
    }
  });
});

RoomSchema.post('update', room => {
  // eslint-disable-next-line consistent-return
  wss.clients.forEach(client => {
    if (client.user) {
      client.send(JSON.stringify({ type: 'updateRoom', payload: room }));
    }
  });
});

RoomSchema.post('remove', room => {
  // eslint-disable-next-line consistent-return
  wss.clients.forEach(client => {
    if (client.user) {
      client.send(JSON.stringify({ type: 'deleteRoom', payload: room }));
    }
  });
});

RoomSchema.methods.joinRoom = function joinRoom(player, cb) {
  // eslint-disable-next-line consistent-return
  try {
    this.player2 = player;
    this.isFull = true;
    this.save();
    cb(null);
  } catch (err) {
    cb(err);
  }
};

// export const cleanCollection = () => model.deleteMany({}).exec();

const Room = mongoose.model('Room', RoomSchema);

export default Room;

if (process.env.NODE_ENV === 'production') {
  setInterval(() => {
    console.log('CHECK DELETE');
    const tenMinutesOld = new Date();
    tenMinutesOld.setSeconds(tenMinutesOld.getSeconds() - 30);
    console.log(tenMinutesOld);
    Room.find(
      {
        isFull: false,
        submitDate: { $lt: tenMinutesOld }, // 5 minutes
      },
      (err, result) => {
        if (err) {
          console.log(err);
          return null;
        }
        result.forEach(element => {
          console.log('REMOVE : ', element.slug);
          element.remove();
        });
        return null;
      },
    );
  }, 10000);
}
//
// module.exports = {
//   Room:
// };
