import {Router} from 'express'
import {requireUser} from "../auth";
import {User} from "../user.repository";

const router = Router()

import axios from 'axios'

router.get('/me', requireUser, (req, res) => {
    res.json(getProfile(req.user as User))
})

router.get('/me/beatmaps', requireUser, async (req, res) => {

    try {
        // @ts-ignore
        const beatmaps = await axios.get(`https://osu.ppy.sh/api/v2/beatmapsets/search?m=0&s=mine`, {

            headers: {
                //@ts-ignore
                Authorization: `Bearer ${req.user.accessToken}`
            }
        })

        res.json(beatmaps.data)
    }
    catch (e) {
        res.status(403).json(e)
    }

})

export function getProfile(user: User) {
    return {
        displayName: user.displayName,
        profileId: user.profileId,
        avatarUrl: user.avatarUrl
    }
}

export let userRouter = router