import { BlockType } from 'types/global';
import { ReplicatedStorage } from '@rbxts/services';
import { validateTree } from '@rbxts/validate-tree';
import { blocksLayout } from 'types/settings';

const blocks = ReplicatedStorage.WaitForChild('blocks');

/**
 * A class to determine a block
 */
export class Block {
	/** The x coordinate of the block */
	public x: number;
	/** The y coordinate of the block */
	public y: number;
	/** The z coordinate of the block */
	public z: number;
	/** The type of block */
	public readonly type: BlockType;

	constructor(x: number, y: number, z: number, blockType: BlockType) {
		if (!blocksLayout(blocks)) throw 'stones is invalid comfig';
		this.x = x;
		this.y = y;
		this.z = z;
		this.type = blockType;
	}
}

export {};
