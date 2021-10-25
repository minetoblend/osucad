import {User} from "../repository/user.repository";
import {RoomMessage, UserListMessage} from "./message";

export class UserList {

    users: OnlineUser[] = []

    add(user: User, socket: WebSocket) {
        const onlineUser = new OnlineUser(user, socket)
        this.users.push(onlineUser)
        this.broadcastUserList()
        socket.onclose = () => {
            this.leave(onlineUser)
        }
    }

    leave(user: OnlineUser) {
        this.users = this.users.filter(u => u !== user)
        this.broadcastUserList()
    }

    broadcast<T extends RoomMessage<any, any>>(message: T) {
        this.users.forEach(user => user.socket.send(JSON.stringify(message)))
    }

    broadcastUserList(){
        this.broadcast<UserListMessage>({
            message: 'user-list',
            payload: this.users.map(user => ({
                profileId: user.user.profileId,
                displayName: user.user.displayName,
                avatarUrl: user.user.avatarUrl,
            }))
        })
    }

}

export class OnlineUser {
    constructor(public readonly user: User, public socket: WebSocket) {
    }
}