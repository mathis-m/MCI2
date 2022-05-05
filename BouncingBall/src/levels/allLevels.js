import {level1Info} from "./level1"
import {level2Info} from "./level2";
import {level3Info} from "./level3";
import {level4Info} from "./level4";
import {level5Info} from "./level5";

export const debugLevel = level1Info;

export const getNextLevel = (currentKey) => {
    if(allLevels.length === currentKey + 1) {
        return null
    }

    return allLevels[currentKey + 1];
}

export const allLevels = [
    level1Info,
    level2Info,
    level3Info,
    level4Info,
    level5Info
]
