import {readonly, ref} from "vue";


export class EditorClock {
    private _time = ref(0);
    time = readonly(this._time)

    constructor() {

    }
}