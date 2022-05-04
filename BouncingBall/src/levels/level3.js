import {WorldHeight, WorldWidth} from "../world";
import {BouncingBallLevel, InitialBallVelocity} from "./BouncingBallLevel";


const centerX = WorldWidth / 2;
const centerY = WorldHeight / 2;
const radius = WorldHeight < WorldWidth ? WorldHeight / 4 : WorldWidth / 4

const level3 = new BouncingBallLevel(
    {
        ballDropLocationX: 20,
        ballDropLocationY: 0,
        initialBallVelocity: InitialBallVelocity.Low
    },
    (scene) => {

        const circle = scene.add.circle(centerX, centerY, radius, 0x6A08E7);

        return [
            scene.matter.add.gameObject(circle)
                .setCircle(radius)
                .setOrigin(0.5)
                .setStatic(true)
        ];
    },
    {
        rimLocationX: WorldWidth * 0.8,
        rimLocationY: WorldHeight * 0.8,
    },
    [
        {
            x: centerX,
            y: WorldHeight - centerY - radius - 50
        },
        {
            x: centerX,
            y: (WorldHeight - centerY) + radius + 50
        },
        {
            x: WorldWidth * 0.8,
            y: WorldHeight * 0.6
        }
    ]
)

export const level3Info = {
    name: "Level 3",
    key: 2,
    levelObj: level3
}
