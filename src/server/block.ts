import { BlockType } from 'types/global';
import { ReplicatedStorage, Workspace } from '@rbxts/services';
import { settings } from 'types/settings';

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
	/** The part that is used to simulate this block */
	public readonly block: BasePart;

	constructor(x: number, y: number, z: number, blockType: BlockType) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.type = blockType;

		const baseBlock = blocks.WaitForChild(BlockType[this.type]);
		if (!baseBlock.IsA('BasePart')) throw 'Block ' + baseBlock.GetFullName() + ' is not a BasePart.';

		this.block = baseBlock.Clone();
		this.block.CFrame = new CFrame(
			this.x * settings.blockSize,
			this.y * settings.blockSize,
			this.z * settings.blockSize,
		);
		this.block.Name = `${x}:${y}:${z}`;
		this.block.Parent = Workspace;
	}
}

export {};
