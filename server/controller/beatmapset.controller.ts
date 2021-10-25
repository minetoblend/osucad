import {Router} from "express";
import {requireUser} from "../auth";
import {BeatmapModel, BeatmapSetModel} from "../repository/beatmap.repository";
import {User} from "../repository/user.repository";

const router = Router()

router.get('/', requireUser, async (req, res) => {
    const beatmapsets = await BeatmapSetModel.find({user: (req.user as User).profileId})

    res.json(beatmapsets)
})

router.post('/create', requireUser, async (req, res) => {
    const beatmap = new BeatmapModel({
        difficultyName: '',
        timingPoints: [],
        hitObjects: [],
    })

    await beatmap.save()

    const beatmapSet = new BeatmapSetModel({
        metadata: {
            title: '',
            titleUnicode: '',
            artist: '',
            artistUnicode: '',
            tags: [],
            source: ''
        },
        user: (req.user as User).profileId,
        difficulties: [beatmap._id],
        sharedWith: []
    })

    beatmapSet.save()

    res.send(beatmapSet)
})




export let beatmapsetRouter = router