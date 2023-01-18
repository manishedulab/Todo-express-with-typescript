"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.addTodo = exports.getTodos = void 0;
const express_1 = __importDefault(require("express"));
const Todomodel_1 = require("../Models/Todomodel");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// import {userID} from "../index"
const index = require("../index");
const getTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = index.userID;
    console.log("userid of getting data ==>", userid);
    try {
        const tabledata = yield Todomodel_1.todomodel.find({ userId: userid });
        if (tabledata) {
            res.json({
                status: 200,
                data: tabledata
            });
        }
        else {
            res.json({
                message: "User not found"
            });
        }
    }
    catch (err) {
        res.json({
            message: "something went wrong user not found"
        });
    }
});
exports.getTodos = getTodos;
const addTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const title = req.body.data.name;
        const desc = req.body.data.description;
        const user = req.body.userid;
        const db = yield new Todomodel_1.todomodel({
            title: title,
            description: desc,
            userId: user
        });
        const forverify = yield db.save();
        if (forverify) {
            res.json({
                status: 200,
                message: "Data saved successfully",
                data: forverify
            });
        }
    }
    catch (error) {
        res.send("something went wrong please try again");
    }
});
exports.addTodo = addTodo;
const updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.query.id;
    const title = req.body.name;
    const description = req.body.description;
    try {
        const updatetabledata = yield Todomodel_1.todomodel.findByIdAndUpdate(userid, { title: title, description: description }, { new: true }, (err, data) => {
            if (data) {
                res.json({
                    status: 200,
                    data: data
                });
            }
            else {
                res.json({
                    message: "Todo is not updated"
                });
            }
        }).clone();
    }
    catch (err) {
        res.json({
            message: "something went wrong please try again later"
        });
    }
});
exports.updateTodo = updateTodo;
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.query.id;
    try {
        const updatetabledata = yield Todomodel_1.todomodel.deleteOne({ _id: userid });
        if (updatetabledata) {
            res.json({
                status: 200,
            });
        }
        else {
            res.json({
                message: "Todo is not not deleted"
            });
        }
    }
    catch (err) {
        res.json({
            message: "something went wrong todo is not deleted"
        });
    }
});
exports.deleteTodo = deleteTodo;
