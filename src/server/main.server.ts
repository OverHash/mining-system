import { makeHello } from 'shared/module';
import { Block } from './block';

print(makeHello('main.server.ts'));

for (let x = -5; x <= 5; x++) {
	for (let y = 0; y >= -2; y--) {
		for (let z = -5; z <= 5; z++) {
			new Block(x, y, z);
		}
	}
}
