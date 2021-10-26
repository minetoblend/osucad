import {MessageHandler, Room} from "./room";
import {OnlineUser} from "./userlist";
import {RoomMessage} from "./message";

interface UserStatusMessage extends RoomMessage<'user-status', { user: string, inactive: boolean }> {

}

export const userStatusHandler: MessageHandler<{ inactive: boolean }> = {
    handleMessage(message: { inactive: boolean }, user: OnlineUser, room: Room) {
        room.users.broadcast<UserStatusMessage>({
            message: 'user-status',
            payload: {
                user: user.id,
                inactive: message.inactive
            }
        })
    }
}