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

    persistLevelPreview(levelKey, image) {
        const previews = this.getPersistedPreviews();
        const index = previews.findIndex(w => w.levelKey === levelKey || w.levelKey.toString() === levelKey.toString());
        const win = {
            imageBase64: image.src,
            levelKey
        };
        if(index === -1) {
            previews.push(win)
        } else {
            previews[index] = win
        }
        const winsStr = JSON.stringify(previews);
        localStorage.setItem("previewLevels", winsStr);
    }


    getPersistedPreviews() {
        const wins = localStorage.getItem("previewLevels") || "[]";

        return JSON.parse(wins).map(w => {
            return ({
                levelKey: w.levelKey,
                imageBase64: w.imageBase64
            });
        });
    }
}

export const persistService = new PersistService();