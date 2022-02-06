import autobind from 'autobind-decorator';
import Module from '@/module';
import Message from '@/message';
import * as seedrandom from 'seedrandom';

const yarukotoList = [
	'勉強する',
	'コード書く',
	'お絵描きする',
	'とりあえずトイレ行く',
	'とりあえずお水とってくる',
	'寝る',
	'ゲームする',
	'通話する',
	'とりあえずAmazon見る',
	'そんなことより薬飲んだ？',
	'ご飯食べる',
	'VRやる',
	'部屋掃除する',
	'Notionのやることリストのやつやる',
	'お風呂入る',
	'とりあえず今はmisskeyやっとく',
	'落書きする',
	'掃除機かける',
	'ごろごろする',
	'YouTube見る',
	'爪切る',
];

export default class extends Module {
	public readonly name = 'yarukoto';

	@autobind
	public install() {
		return {
			mentionHook: this.mentionHook
		};
	}

	@autobind
	private async mentionHook(msg: Message) {
		if (msg.includes(['やる事', 'やること', 'なにしよ', 'なにやろ', 'にゃにしよ', 'にゃにやろ'])) {
			const date = new Date();
			const seed = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}@${msg.userId}`;
			const rng = seedrandom(seed);

			const yarukoto = yarukotoList[Math.floor(rng() * yarukotoList.length)];

			msg.reply(yarukoto);
			return true;
		} else {
			return false;
		}
	}
}
