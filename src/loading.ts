import {readonly, ref} from "vue";

let loadCount = 0
const isLoading = ref(false)

export const showLoading = readonly(isLoading)

export async function load<T>(block: () => Promise<T>): Promise<T> {
    loadCount++
    isLoading.value = true

    try {
        const result = await block()
        loadCount--
        if (loadCount === 0)
            isLoading.value = false
        return result
    } catch (e) {
        loadCount--
        if (loadCount === 0)
            isLoading.value = false
        throw e
    }
}