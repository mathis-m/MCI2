class PersistService {


    persistWin(levelKey, {score, winImage}) {
        const wins = this.getPersistedWins();
        const index = wins.findIndex(w => w.levelKey === levelKey || w.levelKey.toString() === levelKey.toString());
        const win = {
            score: score,
            imageBase64: winImage.src,
            levelKey
        };
        if(index === -1) {
            wins.push(win)
        } else {
            wins[index] = win
        }
        const winsStr = JSON.stringify(wins);
        localStorage.setItem("wonLevels", winsStr);
    }

    getPersistedWins() {
        const wins = localStorage.getItem("wonLevels") || "[]";

        return JSON.parse(wins).map(w => {
            return ({
                score: w.score,
                levelKey: w.levelKey,
                imageBase64: w.imageBase64
            });
        });
    }
}

export const persistService = new PersistService();