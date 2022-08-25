import mongoose from 'mongoose';
import express from 'express';
import { isAuth } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';
import Notification from '../Models/notifications.js';

const notficationRouter = express.Router();

// notficationRouter.get('/seed', (req, res) => {
//   const newNotif = new Notification({
//     fromUser: '6304dc2f883026c7f7dc7191',
//     toUser: '63066ff91ca74abd46634540',
//     notific: {
//       message: 'be my friend'
//     }
//   });
//   newNotif.save();
//   res.send(newNotif);
// });

notficationRouter.get(
  '/:_id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let userId = req.params._id;
    let mynotif = await Notification.find({ toUser: userId });
    if (mynotif && mynotif.length) {
      res.send(mynotif);
    } else {
      res.send([
        {
          notific: {
            message: 'No new notifications'
          }
        }
      ]);
    }
  })
);

export default notficationRouter;
