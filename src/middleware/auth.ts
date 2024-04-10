import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import User  from "../model/userModel";
import { jwtsecret } from '../config/config';


export async function auth(req: Request | any, res: Response, next: NextFunction) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return res.status(401).json({ error: 'Kindly Log in as a User' })
        }

        const token = authorization?.slice(7, authorization.length);

        let verified = jwt.verify(token, jwtsecret);

        if (!verified) {
            return res.status(401).send({ error: "Token not available on this route" });
        }

        const { id, role } = verified as { id: string, role: string }; // Assuming the role is included in the JWT payload

        // Find user by id
        const user = await User.findOne({ where: { id } });

        if (user && role !== 'admin') {
            return res.status(401).json({ Error: "Details not correct or insufficient permissions, Kindly sign in as an admin"});
        }

        req.user = verified;
        next();

    } catch (err) {
        return res.status(400).send("User not Logged in");
    }
}
