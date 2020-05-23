import { percentages, BaseOre } from 'types/global';
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

const ores: Map<string, Block> = new Map();
const oresMined: Array<string> = [];

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

		print(new Vector3(this.x, this.y, this.z));
		ores.set(`${this.x}:${this.y}:${this.z}`, this);
	}

	/** Destroys an ore, and generates ores around it (if they dont exist) */
	destroy() {
		// i dont really like this function, too copy pasta
		// i am really not proud of this please send help

		const oreLeft = ores.get(`${this.x - 1}:${this.y}:${this.z}`);
		const oreRight = ores.get(`${this.x + 1}:${this.y}:${this.z}`);
		const oreUp = ores.get(`${this.x}:${this.y}:${this.z - 1}`);
		const oreDown = ores.get(`${this.x}:${this.y}:${this.z + 1}`);
		const oreBelow = ores.get(`${this.x}:${this.y - 1}:${this.z}`);
		const oreAbove = ores.get(`${this.x}:${this.y + 1}:${this.z}`);

		oresMined.push(`${this.x}:${this.y}:${this.z}`);

		this.block.Destroy();
		ores.delete(`${this.x}:${this.y}:${this.z}`);

		if (!oreLeft && !(oresMined.find(val => val === `${this.x - 1}:${this.y}:${this.z}`) !== undefined))
			new Block(this.x - 1, this.y, this.z);
		if (!oreRight && !(oresMined.find(val => val === `${this.x + 1}:${this.y}:${this.z}`) !== undefined))
			new Block(this.x + 1, this.y, this.z);
		if (!oreUp && !(oresMined.find(val => val === `${this.x}:${this.y}:${this.z - 1}`) !== undefined))
			new Block(this.x, this.y, this.z - 1);
		if (!oreDown && !(oresMined.find(val => val === `${this.x}:${this.y}:${this.z + 1}`) !== undefined))
			new Block(this.x, this.y, this.z + 1);
		if (!oreBelow && !(oresMined.find(val => val === `${this.x}:${this.y - 1}:${this.z}`) !== undefined))
			new Block(this.x, this.y - 1, this.z);
		if (
			!oreAbove &&
			!(oresMined.find(val => val === `${this.x}:${this.y + 1}:${this.z}`) !== undefined) &&
			this.y <= -1
		)
			new Block(this.x, this.y + 1, this.z);
	}
}

export function getBlockFromOre(ore: BaseOre): Block | void {
	return ores.get(
		// eslint-disable-next-line prettier/prettier
		`${ore.Position.X / settings.blockSize}:${ore.Position.Y / settings.blockSize}:${ore.Position.Z / settings.blockSize}`,
	);
}
