import {Beatmap, BeatmapModel, BeatmapSet, BeatmapSetModel} from "../repository/beatmap.repository";
import {OnlineUser} from "./userlist";
import {RoomMessage} from "./message";
import {Room} from "./room";

export class BeatmapContextManager {
    readonly context: BeatmapContext
    private updateInterval: NodeJS.Timer;

    beatmapNeedsUpdate = false
    beatmapSetNeedsUpdate = false

    constructor(public readonly room: Room, public readonly beatmap: Beatmap, public readonly beatmapSet: BeatmapSet) {
        this.context = {
            metadata: {
                title: beatmapSet.metadata.title,
                artist: beatmapSet.metadata.artist,
            }
        }

        this.updateInterval = setInterval(() => {
            this.update()
        }, 5000)

        //room.addMessageHandler<{ property: 'title' | 'artist', value: string }>('update-metadata',)
    }

    update() {
        if (this.beatmapSetNeedsUpdate) {
            this.beatmapNeedsUpdate = false
            this.beatmapSet.metadata.artist = this.context.metadata.artist
            this.beatmapSet.metadata.title = this.context.metadata.title
            new BeatmapSetModel(this.beatmapSet).save()

        }
        if (this.beatmapNeedsUpdate) {
            this.beatmapNeedsUpdate = false
            new BeatmapModel(this.beatmap).save()
        }
    }

    destroy() {
        clearInterval(this.updateInterval)
    }


    sendContext(user: OnlineUser) {
        user.send<BeatmapContextRoomMessage>({
            message: 'context',
            payload: this.context
        })
    }
}

export interface BeatmapContext {
    metadata: {
        title: string
        artist: string
    }
}

export interface BeatmapContextRoomMessage extends RoomMessage<'context', BeatmapContext> {
}