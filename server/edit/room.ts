import {ObjectId} from 'mongoose'
import {User} from "../repository/user.repository";
import {BeatmapModel, BeatmapSetModel} from "../repository/beatmap.repository";
import {OnlineUser, UserList} from "./userlist";
import {userStatusHandler} from "./user.status";
import {chatMessageHandler} from "./chat";
import {BeatmapContextManager} from "./context";

export class Room {
    initialized: Promise<void>
    users = new UserList(this)
    private readonly messageHandlers: { [key: string]: MessageHandler<any> } = {}
    private contextManager: BeatmapContextManager | null = null;

    constructor(public readonly id: string) {
        this.initialized = this.init()
        this.registerMessageHandlers()
    }

    async init() {
        const beatmap = await BeatmapModel.findById(this.id).exec()
        if (!beatmap) throw Error()
        const beatmapSet = await BeatmapSetModel.findOne({difficulties: {$in: beatmap._id}}).exec()
        if (!beatmapSet) throw Error()
        this.contextManager = new BeatmapContextManager(this, beatmap, beatmapSet)
    }

    async get() {
        await this.initialized
        return this
    }

    onJoin(user: User, ws: any) {
        this.users.add(user, ws)
    }

    onMessage(message: string, payload: any, user: OnlineUser) {
        const handler = this.messageHandlers[message]
        if (handler) {
            handler.handleMessage(payload, user, this)
        }
    }

    private registerMessageHandlers() {
        this.messageHandlers['user-status'] = userStatusHandler
        this.messageHandlers['chat-message'] = chatMessageHandler
    }

    addMessageHandler<T>(id: string, handler: MessageHandler<T>) {
        this.messageHandlers[id] = handler
    }

    get ctx() {
        return this.contextManager!
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
    //todo: close room
}

export interface MessageHandler<T> {
    handleMessage(message: T, user: OnlineUser, room: Room): void
}