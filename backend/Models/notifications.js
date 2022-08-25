import mongoose from 'mongoose';

const notificationModel = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.ObjectId },
  toUser: { type: mongoose.Schema.ObjectId },
  notific: { type: Object }
});

const Notification = new mongoose.model('Notification', notificationModel);

export default Notification;
