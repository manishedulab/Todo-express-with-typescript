"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todomodel = exports.databasemodel = exports.todoschema = exports.databaseschema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AutoIncrement = require('mongoose-sequence')(mongoose_1.default);
exports.databaseschema = new mongoose_1.Schema({
    UserId: {
        type: Number,
    },
    fullName: {
        type: String,
        required: [true, "cant be empty fullname"],
        maxlength: 30
    },
    email: {
        type: String,
        required: [true, "email should be unique"],
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 60
    },
}, { timestamps: { createdAt: 'created_at' } });
exports.todoschema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "please enter title"]
    },
    description: {
        type: String,
        required: [true, "please enter description"]
    },
    userId: {
        type: Number,
        ref: "users",
        required: true
    }
}, { timestamps: { createdAt: 'created_at' } });
exports.databaseschema.plugin(AutoIncrement, { id: 'UserId_seq', inc_field: 'UserId' });
exports.databasemodel = mongoose_1.default.model('users', exports.databaseschema);
exports.todomodel = mongoose_1.default.model('todolist', exports.todoschema);
