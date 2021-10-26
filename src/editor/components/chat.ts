import {Connector, ConnectorModule} from "@/editor/connector";
import {ref, Ref} from "vue";

interface Message {
    uuid: string
    user: {
        id: string
        displayName: string
        avatarUrl: string | null
    }
    message: string
}

declare module '@/editor/connector' {
    interface Connector {
        messages: Ref<Message[]>

        sendChatMessage(message: string): void
    }
}

export const ChatModule :  ConnectorModule  = {
    setup(connector: Connector): void {
        connector.messages = ref([])
        connector.registerMessageHandler('chat-message', onChatMessage)

        connector.sendChatMessage = (message: string) => {
            connector.sendRaw({
                message: 'chat-message',
                payload: {
                    message
                }
            })
        }
    }

}

function onChatMessage(payload: Message, connector: Connector) {
    connector.messages.value = [
        ...connector.messages.value,
        payload
    ]
}