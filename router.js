// import projectController from "controllers/project.controller";
import passportManager from './config/passport';
import authController from './controllers/auth.controller';
import roomController from './controllers/room.controller';

// Route Exports
module.exports = app => {
  // Protected route that requires you to pass through requireAuth
  app.get('/', passportManager.authenticate, (req, res) => {
    res.status(200);
    res.send({ message: `Server authentication home route ${req.user.email}` });
  });

  app.post('/signin', authController.signIn);
  app.post('/signup', authController.signUp);

  app.post('/addroom', passportManager.authenticate, roomController.add);
  app.get('/getrooms', passportManager.authenticate, roomController.get);
  app.get('/join/:slug', passportManager.authenticate, roomController.join);
  app.get(
    '/getroom/:slug',
    passportManager.authenticate,
    roomController.getRoom,
  );
};
