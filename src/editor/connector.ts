import {ref} from "vue";

interface SerializedUser {
    profileId: number
    displayName: string
    avatarUrl: string | null
}

export class Connector {

    private ws: WebSocket;

    status = ref<ConnectorStatus>(ConnectorStatus.Connecting)

    users = ref<SerializedUser[]>([])

    private messageHandlers: { [key: string]: MessageHandler<any> } = {}

    constructor(id: string) {
        this.ws = new WebSocket(`ws://localhost:3000/beatmap/${id}/room`)
        this.ws.onopen = () => this.onOpen()
        this.ws.onmessage = (evt) => this.onMessage(evt)
        this.init()
    }

    onOpen() {
        this.status.value = ConnectorStatus.Ready
    }

    onMessage(evt: MessageEvent) {
        const message = JSON.parse(evt.data)
        const handler = this.messageHandlers[message.message]
        if (handler) {
            handler.handleMessage(message.payload, this)
        } else {
            console.error(`Could not find message handler for ${message.message}`)
        }
    }

    onClose() {
        this.status.value = ConnectorStatus.Closed
    }

    sendRaw(payload: any) {
        this.ws.send(JSON.stringify(payload))
    }

    registerMessageHandler(id: string, handler: MessageHandler<any>) {
        if (this.messageHandlers[id])
            console.error(`Duplicate messageHandler '${id}' detected`)
        else
            this.messageHandlers[id] = handler
    }

    init() {

        this.registerMessageHandler('user-list', userListMessageHandler)
    }
}

export enum ConnectorStatus {
    Connecting,
    Ready,
    Closed
}

export interface MessageHandler<T> {
    handleMessage(payload: T, connector: Connector): void
}

const userListMessageHandler: MessageHandler<SerializedUser[]> = {
    handleMessage(payload: SerializedUser[], connector: Connector) {
        connector.users.value = payload
    }
}