import {createStore} from 'vuex'
import {userModule} from "@/store/user.module";

export interface RootState {

}

export default createStore<RootState>({
    state: {},
    mutations: {},
    actions: {
        init: ({dispatch}) => {
            dispatch('user/loadUser')
        }
    },
    modules: {
        user: userModule
    }
})
