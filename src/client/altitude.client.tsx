import * as Roact from '@rbxts/roact';
import { Players, RunService } from '@rbxts/services';
import { settings } from 'types/settings';

const player = Players.LocalPlayer;

const playerGui = player.WaitForChild('PlayerGui');

let currentDepth = '0';

interface AltitudeProps {
	depth: string;
}

function Altitude({ depth }: AltitudeProps) {
	return (
		<screengui ZIndexBehavior={Enum.ZIndexBehavior.Sibling} Key="AltitudeGui" ResetOnSpawn={false}>
			<textlabel
				Font={Enum.Font.SourceSans}
				Text={`Depth: ${depth}`}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled
				TextSize={14}
				TextWrapped
				BackgroundTransparency={1}
				Position={new UDim2(0, 0, 0.925, 0)}
				Size={new UDim2(0.15, 0, 0.075, 0)}
				Key="depthLabel"
			/>
		</screengui>
	);
}

function createAltitudeComponent(): Roact.Element {
	return <Altitude depth={currentDepth} />;
}

let handle = Roact.mount(createAltitudeComponent(), playerGui, 'depthDisplay');

RunService.RenderStepped.Connect(() => {
	const character = player.Character;
	if (!character) return;

	const humanoidRootPart = character.FindFirstChild('HumanoidRootPart');
	if (!humanoidRootPart || !humanoidRootPart.IsA('BasePart')) return;

	// calculate humanoid height adjusting it based on values
	const humanoidRootCenter = humanoidRootPart.Position.Y - humanoidRootPart.Size.Y / 2;

	const characterDepth = math.clamp(humanoidRootCenter - settings.blockSize / 2, -math.huge, 0);
	const characterBlockDepth = math.abs(characterDepth / settings.blockSize);

	currentDepth = tostring('%0.0f').format(math.clamp(characterBlockDepth, 0, math.huge));

	// update roact display
	handle = Roact.update(handle, createAltitudeComponent());
});
