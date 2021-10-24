import express, {Express} from 'express'
import passport from 'passport'
import session from 'express-session'

import OsuStrategy from 'passport-osu';
import {getOrCreateUser, UserModel} from "./user.repository";

export function setupAuth(app: Express) {
    app.use(session({secret: '1234'}))
    app.use(passport.initialize())
    app.use(passport.session())

    passport.use(new OsuStrategy({
        type: 'StrategyOptions',
        clientID: process.env.OSU_CLIENT_ID!,
        clientSecret: process.env.OSU_CLIENT_SECRET!,
        callbackURL: process.env.OSU_CLIENT_CALLBACK!,
        scope: ['public', 'identify']
    }, async (accessToken: any, refreshToken: string, profile: any, done: Function) => {

        const user = await getOrCreateUser(profile, accessToken, refreshToken)

        done(null, user)
    }))

    passport.serializeUser((user: any, done: any) => {
        done(null, user.profileId);
    });

    passport.deserializeUser(async (id: number, done: any) => {
        const user = await UserModel.findOne({profileId: id})
        done(null, user)
    });

    app.get('/login/osu', passport.authenticate('osu'))

    app.get('/callback', passport.authenticate('osu', {failureRedirect: '/login/error'}), (req, res) => {
        res.redirect('/')
    })
}

export function requireUser(req: express.Request, res: express.Response, next: Function) {
    if (!req.user) {
        res.sendStatus(403)
    } else next()
}