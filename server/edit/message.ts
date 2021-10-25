export interface RoomMessage<Message extends String, Payload> {
    message: Message
    payload: Payload
}

interface SerializedUser {
    profileId: number,
    displayName: string,
    avatarUrl: string | null
}

export interface UserListMessage extends RoomMessage<'user-list', SerializedUser[]> {

}