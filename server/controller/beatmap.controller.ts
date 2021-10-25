import {Router} from "express";
import {requireUser} from "../auth";
import {BeatmapModel, BeatmapSetModel} from "../repository/beatmap.repository";
import {getRoom} from "../edit/room";
import * as expressWs from "express-ws";
import {User} from "../repository/user.repository";

const router = Router() as expressWs.Router

router.get('/:id/metadata', requireUser, async (req, res) => {
    const beatmap = await BeatmapModel.findById(req.params.id)
    if (!beatmap)
        return res.sendStatus(404)


    return {
        _id: beatmap!._id,
        difficultyName: beatmap!.difficultyName,
    }
})

//@ts-ignore
router.ws('/:id/room', async (ws, req) => {
    if (!req.user) {
        ws.send('no user')
        ws.close()
        return
    }
    const room = await getRoom(req.params.id)
    console.log(req.user)
    room.onJoin(req.user as User, ws)
})


export let beatmapRouter = router