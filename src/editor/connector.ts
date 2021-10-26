import {ref} from "vue";
import {UserStatusModule} from "@/editor/user.status";
import {ChatModule} from "@/editor/components/chat";
import {ContextModule} from "@/editor/context";

export interface SerializedUser {
    profileId: number
    displayName: string
    avatarUrl: string | null
    uuid: string
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
            handler(message.payload, this)
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
        else {
            this.messageHandlers[id] = handler
        }
    }

    registerModule(module: ConnectorModule) {
        module.setup(this)
    }

    init() {
        this.registerMessageHandler('user-list', userListMessageHandler)
        this.registerModule(UserStatusModule)
        this.registerModule(ChatModule)
        this.registerModule(ContextModule)
    }

    close() {
        this.ws.close()
    }
}

export enum ConnectorStatus {
    Connecting,
    Ready,
    Closed
}

export type MessageHandler<T> =
    (payload: T, connector: Connector) => void


const userListMessageHandler: MessageHandler<SerializedUser[]> = (payload: SerializedUser[], connector: Connector) => {
    connector.users.value = payload
}

export interface ConnectorModule {
    setup(connector: Connector): void
}