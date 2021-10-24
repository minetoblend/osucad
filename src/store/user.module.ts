import {Module} from 'vuex'
import type {RootState} from "@/store/index";
import axios from "axios";

interface User {
    displayName: string
    profileId: number
    avatarUrl: number
}

interface UserState {
    profile: User | null
}


export let userModule: Module<UserState, RootState> = {
    namespaced: true,
    state: () => ({
        profile: null
    }),
    mutations: {
        setProfile: (state, user: User) => state.profile = user
    },
    actions: {
        loadUser: async ({commit}) => {
            axios.get('/user/me')
                .then(res => commit('setProfile', res.data))
                .catch()
        }
    }
}
