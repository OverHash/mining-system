import { percentages } from 'types/global';
import { ReplicatedStorage, Workspace } from '@rbxts/services';
import { settings } from 'types/settings';

const blocks = ReplicatedStorage.WaitForChild('blocks');

const randomObject = new Random();
function generateBlockType(): string {
	const totalChance = randomObject.NextNumber(0, 100);

	for (const [oreName, [startPercentage, endPercentange]] of Object.entries(percentages)) {
		if (totalChance >= startPercentage && totalChance < endPercentange) {
			return oreName;
		}
	}

	return 'stone';
}

const ores: Array<Array<Array<Block | undefined>>> = [];

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
	public readonly type: string;
	/** The part that is used to simulate this block */
	public readonly block: BasePart;

	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.type = generateBlockType();

		const baseBlock = blocks.WaitForChild(this.type);
		if (!baseBlock.IsA('BasePart')) throw 'Block ' + baseBlock.GetFullName() + ' is not a BasePart.';

		this.block = baseBlock.Clone();
		this.block.CFrame = new CFrame(
			this.x * settings.blockSize,
			this.y * settings.blockSize,
			this.z * settings.blockSize,
		);
		this.block.Name = `${x}:${y}:${z}`;
		this.block.Parent = Workspace.Ores;

		if (!ores[this.x]) {
			ores[this.x] = [];
		}
		if (!ores[this.x][this.y]) {
			ores[this.x][this.y] = [];
		}
		ores[this.x][this.y][this.z] = this;
	}

	/** Destroys an ore, and generates ores around it (if they dont exist) */
	destroy() {
		const oreLeft = ores[this.x][this.y][this.z - 1];

		print(oreLeft);
	}
}

export {};
