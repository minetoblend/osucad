import {Schema, model} from 'mongoose';


export interface User {
    displayName: string
    profileId: number
    avatarUrl: string
    accessToken: string
    refreshToken: string
}

const schema = new Schema<User>({
    displayName: {type: String, required: true, unique: true},
    profileId: {type: Number, required: true, unique: true, index: true},
    avatarUrl: {type: String, required: false},
    accessToken: {type: String, required: true},
    refreshToken: {type: String, required: true}
})

export const UserModel = model<User>('User', schema)

export async function getOrCreateUser(profile: any, accessToken: string, refreshToken: string) {
    let user = await UserModel.findOne({profileId: profile.id})

    if (user) {
        await UserModel.updateOne({profileId: profile.id}, {
            $set: {
                accessToken,
                refreshToken
            }
        })
        return user

    }
    user = new UserModel({
        displayName: profile.displayName,
        profileId: profile.id,
        avatarUrl: profile._json.avatar_url,
        accessToken,
        refreshToken,
    })
    await user.save()
    return user
}