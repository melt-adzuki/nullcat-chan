import Message from "@/message"
import Module from "@/module"
import autobind from "autobind-decorator"

export default class extends Module {
	public readonly name = "ping"

	@autobind
	public install() {
		return {
			mentionHook: this.mentionHook,
		}
	}

	@autobind
	private async mentionHook(msg: Message) {
		if (msg.text && msg.text.includes("ping")) {
			msg.reply("$[x2 :bibibi_nullcatchan:]", {
				immediate: true,
			})
			return true
		} else {
			return false
		}
	}
}
