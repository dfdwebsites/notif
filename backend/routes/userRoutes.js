import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../Models/userModel.js';
import { formatTime, generateToken, isAuth } from '../utils.js';
import moment from 'moment';

const userRouter = express.Router();

userRouter.put(
  '/:id/todos',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const userFound = await User.findById(userId);
    if (userFound) {
      const todoObj = {};
      const { todo, todoId, date, time } = req.body;
      todoObj.todo = todo;
      todoObj.todoId = todoId;
      if (date) {
        todoObj.date = moment(date).format('MMMM Do YYYY');
      }
      if (time) {
        todoObj.time = formatTime(time);
      }
      userFound.todos.push(todoObj);
      const updatedUsersTodos = await userFound.save();
      const { _id, username, isAdmin } = updatedUsersTodos;
      res.send({
        _id,
        username,
        isAdmin,
        token: generateToken(userFound),
        todos: updatedUsersTodos.todos || [],
        expenses: [...updatedUsersTodos.expenses]
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
        todos: updatedUsersTodos.todos,
        expenses: [...updatedUsersTodos.expenses]
      });
    } else {
      res.status(401).send({ message: 'No user found' });
    }
  })
);

userRouter.put(
  '/:id/addexpense',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const userFound = await User.findById(userId);
    if (userFound) {
      let month = moment().format('MMMM');
      let monthObj = userFound.expenses.filter((exp) => exp.month === month);
      if (!monthObj.length) {
        if (!req.body.expense) {
          res.status(401).send({ message: 'something went wrong' });
        }
        let newObj = {
          month: month,
          expense: [req.body.expense],
          income: []
        };
        userFound.expenses.push(newObj);
      } else {
        userFound.expenses
          .filter((exp) => exp.month === month)[0]
          .expense.push(req.body.expense);
      }

      const updatedUsersExpenses = await userFound.save();
      const { _id, username, isAdmin } = updatedUsersExpenses;
      res.send({
        _id,
        username,
        isAdmin,
        token: generateToken(userFound),
        todos: updatedUsersExpenses.todos,
        expenses: [...updatedUsersExpenses.expenses]
      });
    } else {
      res.status(401).send({ message: 'No user found' });
    }
  })
);

userRouter.put(
  '/:id/addincome',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const userFound = await User.findById(userId);
    if (userFound) {
      let month = moment().format('MMMM');
      let monthObj = userFound.expenses.filter((exp) => exp.month === month);
      if (!monthObj.length) {
        if (!req.body.income) {
          res.status(401).send({ message: 'something went wrong' });
        }
        let newObj = {
          month: month,
          expense: [],
          income: [req.body.income]
        };
        userFound.expenses.push(newObj);
      } else {
        userFound.expenses
          .filter((exp) => exp.month === month)[0]
          .income.push(req.body.income);
      }

      const updatedUsersExpenses = await userFound.save();
      const { _id, username, isAdmin } = updatedUsersExpenses;
      res.send({
        _id,
        username,
        isAdmin,
        token: generateToken(userFound),
        todos: updatedUsersExpenses.todos,
        expenses: [...updatedUsersExpenses.expenses]
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
    let month = moment().format('MMMM');
    let expnseObj = {
      month: month,
      expense: [],
      income: []
    };
    res.send({
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
      token: generateToken(user),
      expenses: [expnseObj],
      todos: []
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
          todos: userFound.todos || [],
          expenses: userFound.expenses || []
        });
        return;
      }
    }
    res.status(401).send({ message: 'invalid username or password' });
  })
);

export default userRouter;
