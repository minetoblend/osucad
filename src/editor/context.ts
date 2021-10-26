import {Connector, ConnectorModule} from "@/editor/connector";
import {reactive, Ref, ref} from "vue";

interface SerializedBeatmapContext {
    metadata: {
        title: string
        artist: string
    }
}

interface BeatmapContext {
    metadata: {
        title: string
        artist: string
    }
}

declare module '@/editor/connector' {
    interface Connector {
        context: Ref<BeatmapContext | null>
    }
}

export const ContextModule: ConnectorModule = {
    setup(connector: Connector): void {
        connector.context = ref(null)
        connector.registerMessageHandler('context', onContext)
    }
}


function onContext(payload: SerializedBeatmapContext, connector: Connector) {
    connector.context.value = {
        metadata: reactive({
            title: payload.metadata.title,
            artist: payload.metadata.artist
        })
    }
}