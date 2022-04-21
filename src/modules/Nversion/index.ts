import autobind from 'autobind-decorator';
import Module from '../../module';
import Message from '../../message';
//import serifs from '../../serifs';

/**
 * バージョン情報
 */
interface Version {
	/**
	 * サーバーバージョン(meta.Sversion)
	 */
	server: string;
	/**
	 * クライアントバージョン(meta.clientVersion)
	 */
	client: string;
}

export default class extends Module {
	public readonly name = 'Nversion';

	private latest?: Version;

	@autobind
	public install() {
		this.versionCheck();
		setInterval(this.versionCheck, 1000 * 60 * 60 * 1);

		return {
			mentionHook: this.mentionHook
		};
	}

	public versionCheck = () => {
		// バージョンチェック
		this.getVersion().then(fetched => {
			this.log(`Version fetched: ${JSON.stringify(fetched)}`);

			if (this.latest != null && fetched != null) {
				const serverChanged = this.latest.server !== fetched.server;

				if (serverChanged) {
					let v = '';
					v += (serverChanged ? '**' : '') + `${this.latest.server} → ${fetched.server}\n` + (serverChanged ? '**' : '');

					this.log(`Version changed: ${v}`);

					this.nullcatChan.post({ text: `ぼくが${v}にバージョンアップしたよ！！` });
				} else {
					// 変更なし
				}
			}

			this.latest = fetched;
		}).catch(e => this.log(`warn: ${e}`));
	}

	@autobind
	private async mentionHook(msg: Message) {
		if (msg.text == null) return false;

		const query = msg.text.match(/ぬるきゃっとちゃん！バージョン/);

		if (query == null) return false;

		this.nullcatChan.api('meta').then(async meta => {
			msg.reply(`${(await this.getVersion()).client} みたいだよ！`)
		}).catch(() => {
			msg.reply(`取得失敗しちゃった:cry_nullcatchan:`)
		});

		return true;
	}

	/**
	 * バージョンを取得する
	 */
	private getVersion = (): Promise<Version> => new Promise(resolve => {
		resolve({
				server: process.env.npm_package_version || '',
				client: process.env.npm_package_version || '',
			})
		})

	private wait = (ms: number): Promise<void> => {
		return new Promise(resolve => {
			setTimeout(() => resolve(), ms);
		})
	}
}
