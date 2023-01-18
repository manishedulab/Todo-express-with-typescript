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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Todomodel_1 = require("./Models/Todomodel");
const Routes_1 = __importDefault(require("./Routes"));
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json());
app.use(Routes_1.default);
mongoose_1.default.connect('mongodb://localhost:27017/app').then(() => {
    console.log('connection established');
}).catch((err) => {
    console.log('connection error  :' + err);
});
// registration form
app.post('/register', body('email').isEmail(), body('fullname').isLength({ max: 30 }), body('password').isLength({ min: 6, max: 60 }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const verify = yield Todomodel_1.databasemodel.findOne({ email: req.body.email });
        if (verify) {
            res.json({
                status: 400,
                message: "user is already registered"
            });
        }
        else {
            // const hash=await bcrypt.hash(req.body.password,10)
            const db = yield new Todomodel_1.databasemodel({
                fullName: req.body.fullname,
                email: req.body.email,
                password: req.body.password,
            });
            const forverify = yield db.save();
            console.log("for verifty", forverify, "db===>", db);
            if (forverify) {
                yield jsonwebtoken_1.default.sign({ db }, 'privatekey', { expiresIn: '2h' }, (error, token) => {
                    if (token) {
                        console.log("token: ", token);
                        res.json({
                            token,
                            status: 200
                        });
                    }
                    else {
                        res.json({
                            message: "somthing went wrong please try again in a few minutes"
                        });
                    }
                });
            }
        }
    }
    catch (err) {
        res.json({ message: "somthing went wrong " });
    }
}));
// login form
app.post('/login', body('email').isEmail(), body('password').isLength({ min: 6, max: 14 }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const verify = yield Todomodel_1.databasemodel.findOne({ email: req.body.email, password: req.body.password });
        if (verify) {
            const password = verify.password;
            //    const comparePass=await bcrypt.compare(req.body.password,password)
            if (!verify) {
                res.json({
                    message: "please check your credentials",
                });
            }
            else {
                const data = verify;
                req.user = data.UserId;
                const userID = req.user;
                module.exports.userID = userID;
                console.log("this is req userid", req.user);
                yield jsonwebtoken_1.default.sign({ data }, 'privatekey', { expiresIn: '2h' }, (error, token) => {
                    if (token) {
                        res.send({
                            token,
                            data,
                            status: 200
                        });
                    }
                    else {
                        res.json({
                            message: "somthing went wrong please try again in a few minutes"
                        });
                    }
                });
            }
        }
    }
    catch (error) {
        console.log("hello I'm error", error);
        throw error;
    }
}));
app.listen(PORT, () => {
    console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
