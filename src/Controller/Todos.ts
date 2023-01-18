import express, { Request, Response, NextFunction, Application } from "express";
import { databasemodel, todomodel } from "../Models/Todomodel";
const app: Application = express();
app.use(express.json());
// import {userID} from "../index"
let index = require("../index");

declare module "express" {
  export interface Request {
    useridfortodoevent: number;
  }
}
const getTodos = async (req: Request, res: Response) => {
  req.useridfortodoevent = index.userID;
  try {
    const tabledata = await todomodel.find({ userId: req.useridfortodoevent });
    if (tabledata) {
      res.json({
        status: 200,
        data: tabledata,
      });
    } else {
      res.json({
        message: "User not found",
      });
    }
  } catch (err) {
    res.json({
      message: "something went wrong user not found",
    });
  }
};

const addTodo = async (req: Request, res: Response) => {
  try {
    req.useridfortodoevent = index.userID;
    const title = req.body.name;
    const desc = req.body.description;
    const user = req.useridfortodoevent;
    const db = await new todomodel({
      title: title,
      description: desc,
      userId:user
    });
    const forverify = await db.save();
    if (forverify) {
      res.json({
        status: 200,
        message: "Data saved successfully",
        data: forverify,
      });
    }
  } catch (error) {
    res.send("something went wrong please try again");
  }
};

const updateTodo = async (req: Request, res: Response) => {
  const userid = req.query.id;
  const title = req.body.name;
  const description = req.body.description;
  try {
    const updatetabledata = await todomodel
      .findByIdAndUpdate(
        userid,
        { title: title, description: description },
        { new: true },
        (err, data) => {
          if (data) {
            res.json({
              status: 200,
              data: data,
            });
          } else {
            res.json({
              message: "Todo is not updated",
            });
          }
        }
      )
      .clone();
  } catch (err) {
    res.json({
      message: "something went wrong please try again later",
    });
  }
};

const deleteTodo = async (req: Request, res: Response) => {
  const userid = req.query.id;
  try {
    const updatetabledata = await todomodel.deleteOne({ _id: userid });
    if (updatetabledata) {
      res.json({
        status: 200,
      });
    } else {
      res.json({
        message: "Todo is not not deleted",
      });
    }
  } catch (err) {
    res.json({
      message: "something went wrong todo is not deleted",
    });
  }
};

export { getTodos, addTodo, updateTodo, deleteTodo };
