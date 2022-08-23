import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../Models/userModel.js';
import { generateToken, isAuth } from '../utils.js';

const userRouter = express.Router();

userRouter.put(
  '/:id/todos',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const userFound = await User.findById(userId);
    if (userFound) {
      userFound.todos.push({ todo: req.body.todo, todoId: req.body.todoId });
      const updatedUsersTodos = await userFound.save();
      const { _id, username, isAdmin } = updatedUsersTodos;
      res.send({
        _id,
        username,
        isAdmin,
        token: generateToken(userFound),
        todos: updatedUsersTodos.todos || []
      });
    } else {
      res.status(401).send({ message: 'No user found' });
    }
  })
);
userRouter.put(
  '/:id/removetodo',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const userFound = await User.findById(userId);
    if (userFound) {
      let newTodosList = userFound.todos.filter((todo) => {
        return todo.todoId !== req.body.todo.todoId;
      });
      userFound.todos = newTodosList;
      const updatedUsersTodos = await userFound.save();
      const { _id, username, isAdmin } = updatedUsersTodos;
      res.send({
        _id,
        username,
        isAdmin,
        token: generateToken(userFound),
        todos: updatedUsersTodos.todos
      });
    } else {
      res.status(401).send({ message: 'No user found' });
    }
  })
);

userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password)
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
      token: generateToken(user)
    });
  })
);
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const userFound = await User.findOne({ username: req.body.username });
    if (userFound) {
      if (bcrypt.compareSync(req.body.password, userFound.password)) {
        const { _id, username, isAdmin } = userFound;
        res.send({
          _id,
          username,
          isAdmin,
          token: generateToken(userFound),
          todos: userFound.todos || []
        });
        return;
      }
    }
    res.status(401).send({ message: 'invalid username or password' });
  })
);

export default userRouter;
