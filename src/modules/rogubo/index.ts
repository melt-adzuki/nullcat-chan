import autobind from 'autobind-decorator';
import Module from '@/module';
import serifs from '@/serifs';
import Message from '@/message';

export default class extends Module {
	public readonly name = 'rogubo';

	@autobind
	public install() {
		this.post();
		setInterval(this.post, 1000 * 60 * 1);
		return {
			mentionHook: this.mentionHook
		};
	}
	@autobind
	private async post() {
		const now = new Date();
		if (now.getHours() !== 6){if (now.getMinutes() !==1)return;}
		const date = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
		const data = this.getData();
		if (data.lastPosted == date) return;
		data.lastPosted = date;
		this.setData(data);

		this.log('Time to rogubo');

		this.log('Posting...');
		this.ai.post({
			text: serifs.rogubo.post,
		});
	}
	@autobind
	private async mentionHook(msg: Message) {
		if (msg.text && msg.text.includes('ping')) {
			msg.reply('ログボ！！', {
				immediate: true
			});
			return true;
		} else {
			return false;
		}
	}
}


