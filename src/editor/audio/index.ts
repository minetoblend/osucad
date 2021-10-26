import {ref, watch} from "vue";

export class AudioEngine {
    readonly context = new AudioContext()


    destroy() {
        this.context.close()
    }

    async createSound(buffer: ArrayBuffer): Promise<Sound> {
        const audioBuffer = await this.context.decodeAudioData(buffer)
        return new Sound(audioBuffer, this)
    }
}

export class Sound {

    source: AudioBufferSourceNode | null = null

    constructor(readonly buffer: AudioBuffer, readonly engine: AudioEngine) {

        watch(this.playbackRate, value => {
            if (this.isPlaying.value) {
                this.lastTime = this.currentTime
                this.startTime = this.context.currentTime
                this.source!.playbackRate.value = value
            }
        })
    }

    private lastTime = 0
    private startTime = 0
    readonly playbackRate = ref<number>(1)
    readonly isPlaying = ref<boolean>(false)

    play() {
        this.context.resume()
        this.source = this.context.createBufferSource()
        this.source.buffer = this.buffer
        this.source.connect(this.context.destination)

        this.source.playbackRate.value = this.playbackRate.value

        const offset = this.lastTime

        this.source.start(0, offset)

        this.startTime = this.context.currentTime
        this.isPlaying.value = true // it's the raw value here
    }

    stop() {
        if (this.source) {
            this.lastTime = 0
            this.source.stop(0)
            this.source.disconnect()
            this.source = null
        }
        this.isPlaying.value = false
    }

    pause() {
        const time = this.currentTime
        this.stop()
        this.lastTime = time
    }


    get currentTime() {
        if (!this.isPlaying.value)
            return this.lastTime
        const elapsed = this.context.currentTime - this.startTime

        return this.lastTime + (elapsed * this.playbackRate.value)
    }

    get context() {
        return this.engine.context
    }
}

