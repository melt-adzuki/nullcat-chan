import autobind from 'autobind-decorator';
import Module from '@/module';
import Message from '@/message';
import serifs from '@/serifs';
import * as seedrandom from 'seedrandom';
import { genItem } from '@/vocabulary';

export const feelings = [
  'つらい',
  'ねむい',
  'るんるん',
  '虚無'
];

export default class extends Module {
	public readonly name = 'feeling';

	@autobind
	public install() {
		return {
			mentionHook: this.mentionHook
		};
	}

	@autobind
	private async mentionHook(msg: Message) {
		if (msg.includes(['気分', 'きぶん'])) {
			const date = new Date();
			const seed = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}/${date.getHours()}/${msg.userId}`;
			const rng = seedrandom(seed);
			const feeling = feelings[Math.floor(rng() * feelings.length)];
			msg.reply(`**今は${feeling}かも**`);
			return true;
		} else {
			return false;
		}
	}
}
