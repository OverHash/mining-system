import { Players, UserInputService, Workspace, RunService } from '@rbxts/services';
import t = require('@rbxts/t');
import { settings } from 'types/settings';
import { createClientRemoteEvents, createServerRemoteEvents } from '@rbxts/remoteevent';
import { remotes } from 'types/global';

const player = Players.LocalPlayer;
const backpack = player.WaitForChild('Backpack');
const mouse = player.GetMouse();

interface BasePickaxe extends Tool {
	Handle: BasePart;
}
const pickaxeCheck = t.intersection(
	t.Instance,
	t.instanceIsA('Tool'),
	t.children({
		Handle: t.instanceIsA('BasePart'),
	}),
);

interface BaseOre extends BasePart {
	Parent: Folder;
}

function isOre(value: unknown): value is BaseOre {
	if (value === undefined) return false;
	if (!typeIs(value, 'Instance')) return false;
	if (!value.IsA('BasePart')) return false;
	if (!value.Parent) return false;
	if (!(value.Parent.ClassName === 'Folder')) return false;
	print(value.GetFullName());
	if (value.Parent !== Workspace.Ores) return false;
	print('correct parent');

	return true;
}

const mainRemote = createClientRemoteEvents(remotes);

function getPickaxe(): BasePickaxe | void {
	const character = player.Character || player.CharacterAdded.Wait()[0];

	const backpackPickaxe = backpack.FindFirstChild('pickaxe');
	const characterPickaxe = character ? character.FindFirstChild('pickaxe') : undefined;

	if (pickaxeCheck(backpackPickaxe)) return backpackPickaxe;
	if (pickaxeCheck(characterPickaxe)) return characterPickaxe;
}

UserInputService.InputBegan.Connect((key, gameProcessedEvent) => {
	const pickaxe = getPickaxe();
	if (gameProcessedEvent) return;
	if (!pickaxe) return;
	if (!(key.UserInputType === Enum.UserInputType.MouseButton1)) return;

	const character = player.Character;
	if (!character) return;

	const humanoid = character.WaitForChild('Humanoid');
	if (!humanoid.IsA('Humanoid')) return;

	const currentCamera = Workspace.CurrentCamera;
	if (!currentCamera) return;

	const humanoidRootPart = humanoid.RootPart;
	if (!humanoidRootPart) return;

	const hit = mouse.Target;

	if (hit && isOre(hit)) {
		const oreDistance = humanoidRootPart.Position.sub(hit.Position).Magnitude;

		if (oreDistance < settings.clickDistance) {
			mainRemote.server.destroyOre(hit);
		}
	}
});

function createSelectionBox(): SelectionBox {
	const selection = new Instance('SelectionBox');
	selection.Name = 'selection';
	selection.LineThickness = 0.05;

	return selection;
}

const selectionBox: SelectionBox = createSelectionBox();

function displayHitbox() {
	const character = player.Character;
	if (!character) return;

	const humanoid = character.WaitForChild('Humanoid');
	if (!humanoid.IsA('Humanoid')) return;

	const currentCamera = Workspace.CurrentCamera;
	if (!currentCamera) return;

	const humanoidRootPart = humanoid.RootPart;
	if (!humanoidRootPart) return;

	const hit = mouse.Target;

	if (hit && isOre(hit)) {
		print('hit exists');
		const oreDistance = humanoidRootPart.Position.sub(hit.Position).Magnitude;

		// reparent old selection box
		selectionBox.Parent = hit;
		selectionBox.Adornee = hit;

		if (oreDistance < settings.clickDistance) {
			// make green
			selectionBox.Color3 = settings.onValidHover;
		} else {
			selectionBox.Color3 = settings.onInvalidHover;
		}
	}
}

RunService.RenderStepped.Connect(() => {
	const pickaxe = getPickaxe();
	if (pickaxe && pickaxe.IsDescendantOf(Workspace)) {
		displayHitbox();
	} else {
		selectionBox.Adornee = undefined;
		selectionBox.Parent = undefined;
	}
});

export {};
