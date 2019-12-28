import { makeHello } from 'shared/module';
import { Block } from './block';
import { BlockType } from 'types/global';

print(makeHello('main.server.ts'));

for (let x = -5; x <= 5; x++) {
	for (let z = -5; z <= 5; z++) {
		new Block(x, 0, z, BlockType.stone);
	}
}
