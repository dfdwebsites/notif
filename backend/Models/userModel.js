import mongoose from 'mongoose';

const userModel = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    todos: [
      {
        todo: { type: String, required: true },
        todoId: { type: String, required: true },
        createdAt: { type: Date, default: Date.now() }
      }
    ]
  },
  { timestamps: true }
);

const User = new mongoose.model('User', userModel);
export default User;
