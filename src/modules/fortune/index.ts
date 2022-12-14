import autobind from 'autobind-decorator';
import Module from '@/module';
import Message from '@/message';
import serifs from '@/serifs';
import * as seedrandom from 'seedrandom';
import { genItem } from '@/vocabulary';

export const blessing = ['γ«γγεπ', 'γΏγο½επΎ', 'γ¬γγγγ£γ¨ε:love_nullcatchan:', 'γͺγγγγγεβ¨', 'ηΉε€§εβ¨', 'ε€§ε€§επ', 'ε€§επ', 'επ', 'δΈ­επ', 'ε°επ', 'εΆπΏ', 'ε€§εΆπΏ'];

export default class extends Module {
	public readonly name = 'fortune';

	@autobind
	public install() {
		return {
			mentionHook: this.mentionHook
		};
	}

	@autobind
	private async mentionHook(msg: Message) {
		if (msg.includes(['ε ', 'γγγͺ', 'ιε’', 'γγΏγγ'])) {
			const date = new Date();
			const seed = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}@${msg.userId}`;
			const rng = seedrandom(seed);
			const omikuji = blessing[Math.floor(rng() * blessing.length)];
			const item = genItem(rng);
			msg.reply(`**${omikuji}**\nγ©γγ­γΌγ’γ€γγ : ${item}`, {
				cw: serifs.fortune.cw(msg.friend.name)
			});
			return true;
		} else {
			return false;
		}
	}
}
