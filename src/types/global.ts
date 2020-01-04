import { Workspace } from "@rbxts/services";

export const percentages = {
	stone: [0, 100],
};

export const remotes = {
	// client to server
	client: {},
	// server to client
	server: {
		destroyOre(ore: BasePart) {},
	},
};

export interface BaseOre extends BasePart {
	Parent: Folder;
}

export function isOre(value: unknown): value is BaseOre {
	if (value === undefined) return false;
	if (!typeIs(value, 'Instance')) return false;
	if (!value.IsA('BasePart')) return false;
	if (!value.Parent) return false;
	if (!(value.Parent.ClassName === 'Folder')) return false;
	if (value.Parent !== Workspace.Ores) return false;

	return true;
}
