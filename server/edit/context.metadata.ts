import {OnlineUser} from "./userlist";
import {MessageHandler, Room} from "./room";

const metadataHandler: MessageHandler<any> = {
    handleMessage: (message, user: OnlineUser, room: Room) => {
        if (message.property === 'title') {
            room.ctx.context.metadata.title = message.value
            room.ctx.beatmapSetNeedsUpdate = true
        } else if (message.property === 'artist') {
            room.ctx.context.metadata.artist = message.value
            room.ctx.beatmapSetNeedsUpdate = true
        }
    }
}