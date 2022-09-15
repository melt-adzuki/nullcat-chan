import Message from '@/message';
import Module from '@/module';
import autobind from 'autobind-decorator';
import { generate } from 'cjp';

export default class extends Module {
	public readonly name = 'ayashii';

	@autobind
	public install() {
		return {
			mentionHook: this.mentionHook
		};
	}

	@autobind
	private async mentionHook(message: Message) {
		if (message.includes(['#怪しい日本語'])) {
			const context = message.extractedText.replace('#怪しい日本語', '').trim();
			const cjp = generate(context);

			message.reply(cjp + ' #怪レい曰本语');
			return true;
		} else {
			return false;
		}
	}
}
