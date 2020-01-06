import { createServerRemoteEvents } from '@rbxts/remoteevent';
import { remotes, isOre } from 'types/global';
import { settings } from 'types/settings';
import { getBlockFromOre } from './block';

const mainRemote = createServerRemoteEvents(remotes);

mainRemote.server.destroyOre((player, ore) => {
	if (!isOre(ore)) return;

	const character = player.Character;
	if (!character) return;

	const humanoid = character.WaitForChild('Humanoid');
	if (!(humanoid && classIs(humanoid, 'Humanoid'))) return;

	const humanoidRootPart = humanoid.RootPart;
	if (!humanoidRootPart) return;

	const distance = humanoidRootPart.Position.sub(ore.Position).Magnitude;

	// check if out of reach
	if (distance > settings.clickDistance) return;

	// it's in reach, destroy.
	const block = getBlockFromOre(ore);

	if (block) {
		block.destroy();
	}
});
