import Message from '@/message';
import Module from '@/module';
import autobind from 'autobind-decorator';
const gomamayo = require('gomamayo-js');

export default class extends Module {
	public readonly name = 'gomamayo';

	@autobind
	public install() {
		return {
			mentionHook: this.mentionHook
		};
	}

	@autobind
	private async mentionHook(msg: Message) {
		if (msg.text && msg.text.includes('ゴママヨ')) {
			const notetext = msg.renotedText != null ? msg.renotedText : msg.text;
			const gomamayoResult = await gomamayo.find(notetext.replace(/ゴママヨ/g, ''));
			let resBodyText, resCwText;
			if (gomamayoResult) {
				resCwText = 'ゴママヨかもしれない';
				resBodyText = JSON.stringify(gomamayoResult, undefined, 2);
			} else {
				resBodyText = 'ゴママヨじゃないかも';
			}
			msg.reply(resBodyText, {
				immediate: true,
				cw: resCwText
			});
			return true;
		} else {
			return false;
		}
	}
}
