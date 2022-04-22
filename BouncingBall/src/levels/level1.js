import {BouncingBallLevel, InitialBallVelocity} from "./Level";
import {WorldHeight, WorldWidth} from "../world";

const level1 = new BouncingBallLevel(
    {
        ballDropLocationX: 20,
        ballDropLocationY: 0,
        initialBallVelocity: InitialBallVelocity.Low
    },
    (scene) => {
        const height = WorldHeight / 2;
        const midX = WorldWidth / 2;
        const lowerY = WorldHeight - (height / 2);
        const simpleWall = scene.add.rectangle(midX, lowerY, 148, height, 0xB86F2A);
        return [
            scene.matter.add.gameObject(simpleWall)
                .setStatic(true)
        ];
    },
    {
        rimLocationX: WorldWidth * 0.8,
        rimLocationY: WorldHeight * 0.8,
    }
)

export const level1Info = {
    name: "Level 1",
    key: 0,
    levelObj: level1
}
