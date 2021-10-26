import {Connector, ConnectorModule} from "@/editor/connector";
import {ref, Ref} from "vue";

declare module '@/editor/connector' {
    interface Connector {
        inactiveUsers: Ref<string[]>

        setInactive(inactive: boolean): void
    }
}

export const UserStatusModule: ConnectorModule = {
    setup(connector: Connector) {
        connector.inactiveUsers = ref([])

        connector.setInactive = (inactive: boolean) => {
            connector.sendRaw({message: 'user-status', payload: {inactive}})
        }

        connector.registerMessageHandler('user-status', onUserStatus)
    }
}

function onUserStatus(payload: { user: string; inactive: boolean }, connector: Connector) {
    console.log(`setting user ${payload.user} to ${payload.inactive}`)
    if (payload.inactive) {
        connector.inactiveUsers.value = [...connector.inactiveUsers.value, payload.user]
    } else {
        connector.inactiveUsers.value = connector.inactiveUsers.value.filter(it => it !== payload.user)
    }
}