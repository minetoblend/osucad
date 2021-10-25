import {model, ObjectId, Schema} from 'mongoose'

export interface BeatmapSet {
    metadata: BeatmapSetMetadata
    user: number
    difficulties: ObjectId[]
    sharedWith: number[]
}

export interface BeatmapSetMetadata {
    title: string
    titleUnicode: string

    artist: string
    artistUnicode: string

    tags: string[]
    source: string
}

export interface Beatmap {
    difficultyName: string
    timingPoints: TimingPoint[]
    hitObjects: HitObject[]
}

export interface TimingPoint {

}

export enum HitObjectType {
    HitCircle
}

export interface HitObject {
    type: HitObjectType
    time: number
    x: number
    y: number
}

export interface HitCircle extends HitObject {
    type: HitObjectType.HitCircle
}

const beatmapSchema = new Schema<Beatmap>({
    hitObjects: [],
    timingPoints: [],
    difficultyName: [],
})

const beatmapSetSchema = new Schema<BeatmapSet>({
    metadata: new Schema<BeatmapSetMetadata>({
        title: String,
        titleUnicode: String,
        artist: String,
        artistUnicode: String,
        tags: [String],
        source: String
    }),
    user: Number,
    difficulties: [Schema.Types.ObjectId],
    sharedWith: [Number]
})

export const BeatmapSetModel = model<BeatmapSet>('BeatmapSet', beatmapSetSchema)

export const BeatmapModel = model<Beatmap>('Beatmap', beatmapSchema)