import {MessageHandler, Room} from "./room";
import {OnlineUser} from "./userlist";
import {RoomMessage} from "./message";
import {v4 as uuid} from 'uuid'

interface ChatMessage {
    uuid: string
    user: {
        id: string
        displayName: string
        avatarUrl: string | null
    }
    message: string
}

interface ChatRoomMessage extends RoomMessage<'chat-message', ChatMessage> {

}

export const chatMessageHandler: MessageHandler<{ message: string }> = {
    handleMessage(message: { message: string }, user: OnlineUser, room: Room) {
        room.users.broadcast<ChatRoomMessage>({
            message: 'chat-message',
            payload: {
                uuid: uuid(),
                user: {
                    id: user.id,
                    displayName: user.user.displayName,
                    avatarUrl: user.user.avatarUrl
                },
                message: message.message
            }
        })
    }
}