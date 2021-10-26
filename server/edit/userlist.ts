import {User} from "../repository/user.repository";
import {RoomMessage, UserListMessage} from "./message";
import {v4 as uuid} from 'uuid'
import {Room} from "./room";

export class UserList {

    constructor(public readonly room: Room) {
    }

    users: OnlineUser[] = []

    add(user: User, socket: WebSocket) {
        const onlineUser = new OnlineUser(user, socket)

        socket.onmessage = evt => {
            const data = JSON.parse(evt.data)
            this.room.onMessage(data.message, data.payload, onlineUser)
        }
        this.users.push(onlineUser)
        this.broadcastUserList()
        socket.onclose = () => {
            this.leave(onlineUser)
        }

        this.room.ctx.sendContext(onlineUser)
    }

    leave(user: OnlineUser) {
        this.users = this.users.filter(u => u.id !== user.id)
        this.broadcastUserList()
    }

    broadcast<T extends RoomMessage<any, any>>(message: T) {
        this.users.forEach(user => user.send(message))
    }

    broadcastUserList() {
        this.broadcast<UserListMessage>({
            message: 'user-list',
            payload: this.users.map(user => ({
                uuid: user.id,
                profileId: user.user.profileId,
                displayName: user.user.displayName,
                avatarUrl: user.user.avatarUrl,
            }))
        })
    }
}

export class OnlineUser {
    readonly id = uuid()

    constructor(public readonly user: User, public socket: WebSocket) {
    }

    send<T extends RoomMessage<any, any>>(message: T) {
        this.socket.send(JSON.stringify(message))
    }
}