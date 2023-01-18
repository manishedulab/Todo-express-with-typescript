import { Router } from "express"
import { getTodos, addTodo, updateTodo, deleteTodo } from "./Controller/Todos"
import { verifytoken } from './middleware/verify';

const router: Router = Router()


router.get("/getdata", verifytoken, getTodos)
router.post("/addtodo",verifytoken, addTodo)
router.put("/updatetodo",verifytoken, updateTodo)
router.delete("/deletetodo",verifytoken, deleteTodo)


export default router

