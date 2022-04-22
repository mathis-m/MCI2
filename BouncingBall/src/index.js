import Phaser from 'phaser';
import {config, snapshotConfig} from "./config";

export const game = new Phaser.Game(config);


export const snapshot = new Phaser.Game(snapshotConfig);
