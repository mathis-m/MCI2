import {WorldHeight, WorldWidth} from "../world";
import {BouncingBallLevel, InitialBallVelocity} from "./BouncingBallLevel";


const centerX = WorldWidth / 2;
const centerY = WorldHeight / 2;

const level4 = new BouncingBallLevel(
	{
		ballDropLocationX: centerX,
		ballDropLocationY: 0,
		initialBallVelocity: InitialBallVelocity.Medium
	},
	(scene) => {

		const rectangle = scene.add.rectangle(centerX, WorldHeight * 0.25, WorldWidth * 0.25, 50, 0xE7682A)
            .setOrigin(0.5);
        const matterRect = scene.matter.add.gameObject(rectangle);
		matterRect.angle = 45

		const rectangle2 =  scene.matter.add.gameObject(scene.add.rectangle(centerX / 2, (WorldHeight * 0.75), 50, WorldHeight * 0.5, 0xE7682A));
		const rectangle3 = scene.matter.add.gameObject(scene.add.rectangle(centerX, (WorldHeight * 0.75), 50, WorldHeight * 0.5, 0xE7682A));
		return [
            matterRect.setStatic(true),
			rectangle2.setStatic(true),
			rectangle3.setStatic(true)
		];
	},
	{
		rimLocationX: centerX / 4,
		rimLocationY: WorldHeight * 0.8,
	},
	[
		{
			x: centerX * 0.75,
			y: WorldHeight * 0.8
		},
		{
			x: WorldWidth - 100,
			y: 100
		},
		{
			x: centerX / 4,
			y: WorldHeight * 0.5
		}
	]
)

export const level4Info = {
	name: "Level 4",
	key: 3,
	levelObj: level4
}
