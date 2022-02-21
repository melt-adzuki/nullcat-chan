import config from "@/config"
import Friend from "@/friend"
import { User } from "@/misskey/user"
import NullcatChan from "@/nullcat-chan"
import includes from "@/utils/includes"
import or from "@/utils/or"
import autobind from "autobind-decorator"
import * as chalk from "chalk"
const delay = require("timeout-as-promise")

interface MisskeyFile {
	id: string
	createdAt: string
	name: string
	type: string
	md5: string
	size: number
	isSensitive: boolean
	blurhash: string | null
	properties: {
		width?: number
		height?: number
	}
	url: string
	thumbnailUrl: string | null
	comment?: unknown | null // FIXME
	folderId: string | null
	folder?: unknown | null // FIXME
	userId: string | null
	user: User | null
}

export default class Message {
	private nullcatChan: NullcatChan
	private messageOrNote: any
	public isDm: boolean

	public get id(): string {
		return this.messageOrNote.id
	}

	public get user(): User {
		return this.messageOrNote.user
	}

	public get userId(): string {
		return this.messageOrNote.userId
	}

	public get text(): string {
		return this.messageOrNote.text
	}

	public get renotedText(): string | null {
		return this.messageOrNote.renote.text
	}

	public get quoteId(): string | null {
		return this.messageOrNote.renoteId
	}

	public get files(): MisskeyFile[] | undefined {
		return this.messageOrNote.files
	}
	/**
	 * メンション部分を除いたテキスト本文
	 */
	public get extractedText(): string {
		const host = new URL(config.host).host.replace(/\./g, "\\.")
		return this.text
			.replace(new RegExp(`^@${this.nullcatChan.account.username}@${host}\\s`, "i"), "")
			.replace(new RegExp(`^@${this.nullcatChan.account.username}\\s`, "i"), "")
			.trim()
	}

	public get replyId(): string {
		return this.messageOrNote.replyId
	}

	public friend: Friend

	constructor(nullcatChan: NullcatChan, messageOrNote: any, isDm: boolean) {
		this.nullcatChan = nullcatChan
		this.messageOrNote = messageOrNote
		this.isDm = isDm

		this.friend = new Friend(nullcatChan, { user: this.user })

		// メッセージなどに付いているユーザー情報は省略されている場合があるので完全なユーザー情報を持ってくる
		this.nullcatChan
			.api("users/show", {
				userId: this.userId,
			})
			.then((user) => {
				this.friend.updateUser(user)
			})
	}

	@autobind
	public async reply(
		text: string | null,
		opts?: {
			file?: any
			cw?: string
			renote?: string
			immediate?: boolean
		}
	) {
		if (text == null) return

		this.nullcatChan.log(`>>> Sending reply to ${chalk.underline(this.id)}`)

		if (!opts?.immediate) {
			await delay(2000)
		}

		if (this.isDm) {
			return await this.nullcatChan.sendMessage(this.messageOrNote.userId, {
				text: text,
				fileId: opts?.file?.id,
			})
		} else {
			return await this.nullcatChan.post({
				replyId: this.messageOrNote.id,
				text: text,
				fileIds: opts?.file ? [opts?.file.id] : undefined,
				cw: opts?.cw,
				renoteId: opts?.renote,
			})
		}
	}

	@autobind
	public includes(words: string[]): boolean {
		return includes(this.text, words)
	}

	@autobind
	public or(words: (string | RegExp)[]): boolean {
		return or(this.text, words)
	}
}
