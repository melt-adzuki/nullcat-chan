import Message from '@/message';
import Module from '@/module';
import autobind from 'autobind-decorator';

export default class extends Module {
	public readonly name = 'what';

	@autobind
	public install() {
		return {
			mentionHook: this.mentionHook
		};
	}

	@autobind
	private async mentionHook(message: Message) {
		if (!message.includes(['って何', 'ってなに', 'ってにゃに', ':is_nani:'])) return false;

		const match = message.extractedText.match(/(.+?)って(何|なに|にゃに)/);

		if (match) {
			message.reply(`Google先生に聞いてみた！！！\n${match[1]} 検索`);
		}

		return true;
	}
}
