import {ObjectId} from 'mongoose'
import {User} from "../repository/user.repository";
import {BeatmapModel} from "../repository/beatmap.repository";
import {UserList} from "./userlist";

export class Room {
    private readonly createdAt = new Date();
    initialized: Promise<void>
    users = new UserList()

    constructor(public readonly id: string) {
        this.initialized = this.init()
    }

    async init() {
        const beatmap = await BeatmapModel.findById(this.id).exec()
        console.log(this.id)
        if (!beatmap) throw Error()
    }

    async get() {
        await this.initialized
        return this
    }

    onJoin(user: User, ws: any) {
        this.users.add(user, ws)
    }
}

const rooms: { [key: string]: Room } = {}

export async function getRoom(id: string) {
    if (rooms[id]) {
        return await rooms[id].get()
    }
    const room = new Room(id)
    rooms[id] = room
    return await room.get()
}

export function closeRoom(id: ObjectId) {

}