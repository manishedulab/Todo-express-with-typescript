import express,{Request,Response,NextFunction,Application} from 'express';
import  jwt from 'jsonwebtoken';

export function verifytoken(req: Request, res: Response, next: NextFunction):void {
    const barertoken = req.query.privatekey;
    try{
    if (typeof barertoken !== "undefined") {
    //   @ts-ignore
      jwt.verify(barertoken, "privatekey", async(error: unknown, user) => {
        if (error) {
          res.sendStatus(403);
        } else {
          next();
        }
      });
    } else {
      res.status(401).json({
        message: "Unauthorized",
      });
    }
    } catch (err) {
        res.json({ 
            message:"token is invalid",
        })
    }   
   
}