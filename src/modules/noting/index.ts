import autobind from 'autobind-decorator';
import Module from '@/module';
import serifs from '@/serifs';
import config from '@/config';

export default class extends Module {
	public readonly name = 'noting';

	@autobind
	public install() {
		if (config.notingEnabled === false) return {};

		setInterval(() => {
			if (Math.random() < 0.1) {
				this.post();
			}
		}, 1000 * 60 * 10);

		return {};
	}

	@autobind
	private post() {
		const notes = serifs.noting.notes;

		const note = notes[Math.floor(Math.random() * notes.length)];

		// TODO: 季節に応じたセリフ

		this.ai.post({
			text: note
		});
	}
}
