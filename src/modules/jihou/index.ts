import autobind from "autobind-decorator"
import Module from "@/module"

const accurateInterval = require("accurate-interval")

export default class extends Module {
	public readonly name = "jihou"

	@autobind
	public install() {
		accurateInterval(
			() => this.post(),
			1000 * 60 * 60,
			{ aligned: true, immediate: true }
		)

		return {}
	}

	@autobind
	private async post() {
		const date = new Date()
		const hour = date.getHours

		this.ai.post({
			text: `${hour}時だよ！`,
		})
	}
}
