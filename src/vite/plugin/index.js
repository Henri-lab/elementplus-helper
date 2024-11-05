import { useElementPlus } from "./autoImport";
import { useVuePlugin } from "./vue";
import { useCompress } from "./compress";

// export let pluginOption = [];
export const usePlugins = ({ isProd = false, base = '/', arg }) => {
    const arrOfArr = [
        useVuePlugin(),
        useElementPlus(),
        useCompress(),
    ]
    return arrOfArr.flat(1)
}


