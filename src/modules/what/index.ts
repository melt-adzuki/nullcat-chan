import autobind from "autobind-decorator"

import { Note } from "@/misskey/note"
import Module from "@/module"
import Stream from "@/stream"

export default class extends Module {
	public readonly name = "what"

	private htl: ReturnType<Stream["useSharedConnection"]>

	@autobind
	public install() {
		this.htl = this.ai.connection.useSharedConnection("homeTimeline")
		this.htl.on("note", this.onNote)

		return {}
	}

	@autobind
	private async onNote(note: Note) {
		if (note.reply != null) return
		if (note.text == null) return
		if (note.text.includes("@")) return

		if (note.text.includes("って何") || note.text.includes("ってなに") || note.text.includes("ってにゃに")) {
			const match = note.text.match(/(.+?)って(何|なに|にゃに)(.+?)/)

			if (match) note.reply(`自分で調べろ\n${match[1]} 検索`)
		}
	}
}
