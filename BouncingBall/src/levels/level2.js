import {BouncingBallLevel, InitialBallVelocity} from "./Level";
import {WorldHeight, WorldWidth} from "../world";

const level2 = new BouncingBallLevel(
    {
        ballDropLocationX: 20,
        ballDropLocationY: 0,
        initialBallVelocity: InitialBallVelocity.Low
    },
    (scene) => {
        const height = WorldHeight / 3;
        const midX = WorldWidth / 2;
        const lowerY = WorldHeight - (height / 2);
        const higherY = (height / 2);
        const simpleWall = scene.add.rectangle(midX, lowerY, 148, height, 0xB86F2A);
        const simple2Wall = scene.add.rectangle(midX, higherY, 148, height, 0xB86F2A);
        return [
            scene.matter.add.gameObject(simpleWall)
                .setStatic(true),
            scene.matter.add.gameObject(simple2Wall)
                .setStatic(true)
        ];
    },
    {
        rimLocationX: WorldWidth * 0.8,
        rimLocationY: WorldHeight * 0.4,
    }
)

export const level2Info = {
    name: "Level 2",
    key: 1,
    levelObj: level2
}
