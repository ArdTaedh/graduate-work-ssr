import express, {NextFunction, Request, Response} from "express"
import {User} from "../models/User";
import {dummyData} from "../../dummyData";

export const userRouter = express.Router()

userRouter.get('/seed', async (req: Request, res: Response) => {
    await User.remove({})

    const newUsers = await User.insertMany(dummyData.users)

    return res.send({ newUsers })
})