import autobind from "autobind-decorator"
import Module from "@/module"
import Message from "@/message"
import serifs from "@/serifs"
import * as seedrandom from "seedrandom"
import { genItem } from "@/vocabulary"

export const blessing = ["にゃん吉🐈", "みゃ～吉🐾", "ぬるきゃっと吉:love_nullcatchan:", "なんかすごい吉✨", "特大吉✨", "大大吉🎊", "大吉🎊", "吉🎉", "中吉🎉", "小吉🎉", "凶🗿", "大凶🗿"]

export default class extends Module {
	public readonly name = "fortune"

	@autobind
	public install() {
		return {
			mentionHook: this.mentionHook,
		}
	}

	@autobind
	private async mentionHook(msg: Message) {
		if (msg.includes(["占", "うらな", "運勢", "おみくじ"])) {
			const date = new Date()
			const seed = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}@${msg.userId}`
			const rng = seedrandom(seed)
			const omikuji = blessing[Math.floor(rng() * blessing.length)]
			const item = genItem(rng)
			msg.reply(`**${omikuji}**\nラッキーアイテム: ${item}`, {
				cw: serifs.fortune.cw(msg.friend.name),
			})
			return true
		} else {
			return false
		}
	}
}
