import express from 'express'
import {setupAuth} from "./auth";
import {Express} from "express";
import db from "./db";
import {Mongoose} from "mongoose";
import {setupFrontent} from "./frontent";
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import {userRouter} from "./controller/user.controller";
import path from 'path'

import dotenv from 'dotenv'
import {beatmapsetRouter} from "./controller/beatmapset.controller";

dotenv.config()


class Server {
    private db: Mongoose | null = null

    constructor(public readonly port: number) {
        this.app = require('express-ws')(express()).app
    }

    app: Express

    async run() {

        this.db = await db()

        this.app.use(cookieParser())
        this.app.use(bodyParser.json())

        setupAuth(this.app)

        this.app.use('/user', userRouter)
        this.app.use('/beatmapset', beatmapsetRouter)
        this.app.use('/beatmap', require('./controller/beatmap.controller').beatmapRouter)

        this.app.use('/media', express.static(path.resolve(__dirname, '..', 'media')))
        setupFrontent(this.app)

        this.app.listen(this.port, () => `Server listening on port ${this.port}`)
    }

}

new Server(3000).run()