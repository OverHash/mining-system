import { ReplicatedStorage } from '@rbxts/services';
import t = require('@rbxts/t');

export const settings = {
	blockSize: 6.5,
};

export const blocksLayout = t.intersection(
	t.instanceOf('Folder'),
	t.children({
		stone: t.instanceIsA('BasePart'),
	}),
);
