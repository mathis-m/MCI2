import {level1Info} from "./level1"
import {level2Info} from "./level2";

export const debugLevel = level2Info;

export const getNextLevel = (currentKey) => {
    if(allLevels.length === currentKey + 1) {
        return null
    }

    return allLevels[currentKey + 1];
}

export const allLevels = [
    level1Info,
    level2Info
]
