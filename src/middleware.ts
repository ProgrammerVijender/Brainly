import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// import { JWT_PASSWORD } from "./config";
const JWT_SECRET = "your_jwt_secret_key";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) =>  {
    // const token = req.headers.authorization?.split(' ')[1];
    const token = req.headers["authorization"];
    if (!token) {
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if(decoded)
        {

            console.log(decoded);
            //@ts-ignore
            req.userId = decoded.id;
            next();
        }
        else{
            res.status(403).json('Invalid token');
        }
    } catch (err) {
        res.status(401).send('Invalid token');
    }
}
