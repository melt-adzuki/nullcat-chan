import autobind from 'autobind-decorator';
import Module from '../../module';
import Message from '../../message';
//import serifs from '../../serifs';

/**
 * バージョン情報
 */
interface Version {
	/**
	 * サーバーバージョン(meta.version)
	 */
	server: string;
	/**
	 * クライアントバージョン(meta.clientVersion)
	 */
	client: string;
}

export default class extends Module {
	public readonly name = 'version';

	private latest?: Version;

	@autobind
	public install() {
		this.versionCheck();
		setInterval(this.versionCheck, 60 * 1000);

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
					v += (serverChanged ? '**' : '') + `${this.latest.server} → ${this.mfmVersion(fetched.server)}\n` + (serverChanged ? '**' : '');

					this.log(`Version changed: ${v}`);

					this.nullcatChan.post({ text: `【バージョンが変わりました】\n${v}` });
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

		const query = msg.text.match(/バージョン/);

		if (query == null) return false;

		this.nullcatChan.api('meta').then(meta => {
			msg.reply(`${this.mfmVersion(meta.version)} みたいです。`)
		}).catch(() => {
			msg.reply(`取得失敗しました`)
		});

		return true;
	}

	/**
	 * バージョンを取得する
	 */
	private getVersion = (): Promise<Version> => {
		return this.nullcatChan.api('meta').then(meta => {
			return {
				server: meta.version,
				client: meta.clientVersion
			};
		});
	}

	private mfmVersion = (v): string => {
		if (v == null) return v;
		return v.match(/^\d+\.\d+\.\d+$/)
			? `[${v}](https://github.com/syuilo/misskey/releases/tag/${v})`
			: v;
	}

	private wait = (ms: number): Promise<void> => {
		return new Promise(resolve => {
			setTimeout(() => resolve(), ms);
		})
	}
}
