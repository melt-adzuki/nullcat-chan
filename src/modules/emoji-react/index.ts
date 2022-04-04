import { Note } from "@/misskey/note"
import Module from "@/module"
import Stream from "@/stream"
import includes from "@/utils/includes"
import autobind from "autobind-decorator"
const delay = require("timeout-as-promise")

const gomamayo = require("gomamayo-js")

export default class extends Module {
	public readonly name = "emoji-react"

	private htl: ReturnType<Stream["useSharedConnection"]>

	@autobind
	public install() {
		this.htl = this.nullcatChan.connection.useSharedConnection("homeTimeline")
		this.htl.on("note", this.onNote)

		return {}
	}

	@autobind
	private async onNote(note: Note) {
		if (note.reply != null) return
		if (note.text == null) return
		if (note.text.includes("@")) return // (自分または他人問わず)メンションっぽかったらreject

		const react = async (reaction: string, immediate = false) => {
			if (!immediate) {
				await delay(1500)
			}
			this.nullcatChan.api("notes/reactions/create", {
				noteId: note.id,
				reaction: reaction,
			})
		}

		if (await gomamayo.find(note.text)) return react(":bikkuribikkuri_:")
		if (includes(note.text, ["ぬるきゃっとちゃん", "Nullcat chan", "ぬるきゃぼっとちゃん！", "ぬるきゃっとぼっとちゃん"])) return react(":bibibi_nullcatchan:")
		if (
			includes(note.text, [
				"ねむい",
				"ねむたい",
				"ねたい",
				"ねれない",
				"ねれん",
				"ねれぬ",
				"ふむ",
				"むふ",
				"つらい",
				"つらすぎ",
				"死にたい",
				"つかれた",
				"疲れた",
				"しにたい",
				"きえたい",
				"消えたい",
				"やだ",
				"いやだ",
				"なきそう",
				"泣きそう",
				"辛い",
			])
		)
			return react(":nadenade_neko:")
		if (includes(note.text, ["理解した", "りかいした", "わかった", "頑張った", "がんばった"])) return react(":erai:")
		if (note.text.match(/う[～|ー]*んこ/) || note.text.match(/unko/)) return react(":anataima_unkotte_iimashitane:")
		if (note.text.match(/う[～|ー]*ん$/) || note.text.match(/un$/)) return react(":ti_:")
	}
}
