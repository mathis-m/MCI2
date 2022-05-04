import {WorldHeight, WorldWidth} from "../world";
import {BouncingBallLevel, InitialBallVelocity} from "./BouncingBallLevel";


const centerX = WorldWidth / 2;
const centerY = WorldHeight / 2;

const level5 = new BouncingBallLevel(
	{
		ballDropLocationX: centerX,
		ballDropLocationY: 0,
		initialBallVelocity: InitialBallVelocity.High
	},
	(scene) => {

		const rectangle = scene.add.rectangle(centerX - WorldWidth / 10, WorldHeight * 0.5, WorldWidth / 5, 20, 0xE7682A)
            .setOrigin(0.5);
        const matterRect = scene.matter.add.gameObject(rectangle);
		matterRect.angle = -45

		const rectangle2 = scene.add.rectangle(centerX + WorldWidth / 10, WorldHeight * 0.5, WorldWidth / 5, 20, 0xE7682A)
			.setOrigin(0.5);
		const matterRect2 = scene.matter.add.gameObject(rectangle2);
		matterRect2.angle = 45

		const rectangle3 = scene.add.rectangle(centerX - WorldWidth / 10, WorldHeight * 0.5, WorldWidth / 5, 20, 0xE7682A)
			.setOrigin(0.5);
		const matterRect3 = scene.matter.add.gameObject(rectangle3);
		matterRect3.angle = 45

		return [
            matterRect.setStatic(true),
			matterRect2.setStatic(true),
			matterRect3.setStatic(true)
		];
	},
	{
		rimLocationX: centerX,
		rimLocationY: centerY,
	},
	[
		{
			x: centerX - WorldWidth / 10,
			y: WorldHeight * 0.5 + 50
		},
		{
			x: (centerX - WorldWidth / 10) - 50,
			y: WorldHeight * 0.5
		},
		{
			x: centerX + 100,
			y: centerY
		},
	]
)

export const level5Info = {
	name: "Level 5",
	key: 4,
	levelObj: level5
}
