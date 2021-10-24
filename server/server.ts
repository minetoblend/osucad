import express from 'express'
import {setupAuth} from "./auth";
import {Express} from "express";
import db from "./db";
import {Mongoose} from "mongoose";
import {setupFrontent} from "./frontent";
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import {userRouter} from "./controller/user";

import dotenv from 'dotenv'
dotenv.config()


class Server {
    private db: Mongoose | null = null

    constructor(public readonly port: number) {
        this.app = express()
    }

    app: Express

    async run() {

        this.db = await db()

        this.app.use(cookieParser())
        this.app.use(bodyParser.json())

        setupAuth(this.app)

        this.app.use('/user', userRouter)

        setupFrontent(this.app)

        this.app.listen(this.port, () => `Server listening on port ${this.port}`)
    }

}

new Server(3000).run()