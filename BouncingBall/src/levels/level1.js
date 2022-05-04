import {WorldHeight, WorldWidth} from "../world";
import {BouncingBallLevel, InitialBallVelocity} from "./BouncingBallLevel";

const wallHeight = WorldHeight / 2;
const wallYMid = WorldHeight - (wallHeight / 2);
const midX = WorldWidth / 2;

const rimLocationX = WorldWidth * 0.8;
const rimLocationY = WorldHeight * 0.8;

const level1 = new BouncingBallLevel(
    {
        ballDropLocationX: 20,
        ballDropLocationY: 0,
        initialBallVelocity: InitialBallVelocity.Low
    },
    (scene) => {

        const simpleWall = scene.add.rectangle(midX, wallYMid, 148, wallHeight, 0xB86F2A);
        return [
            scene.matter.add.gameObject(simpleWall)
                .setStatic(true)
        ];
    },
    {
        rimLocationX,
        rimLocationY,
    },
    [
        {
            x: midX,
            y: WorldHeight - wallHeight - 100
        },
        {
            x: rimLocationX,
            y: WorldHeight * 0.2
        },
        {
            x: 150,
            y: WorldHeight * 0.5
        }
    ]
)

export const level1Info = {
    name: "Level 1",
    key: 0,
    levelObj: level1
}
