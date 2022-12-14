import mongoose from 'mongoose';
import moment from 'moment';

const userModel = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    todos: [
      {
        todo: { type: String, required: true },
        todoId: { type: String, required: true },
        date: { type: String, default: moment().format('MMMM Do YYYY') },
        time: { type: String, default: moment().format('LT') },
        createdAt: { type: Date, default: Date.now() }
      }
    ],
    expenses: [
      {
        month: { type: String },
        income: [{ value: Number, label: String }],
        expense: [{ value: Number, label: String }]
      }
    ]
  },
  { timestamps: true }
);

const User = new mongoose.model('User', userModel);
export default User;
