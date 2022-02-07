import autobind from "autobind-decorator"
import Module from "@/module"
import serifs from "@/serifs"

export default class extends Module {
	public readonly name = "rogubo"

	@autobind
	public install() {
		setInterval(this.post, 1000 * 60 * 60 * 12)
		this.post()

		return {}
	}

	@autobind
	private async post() {
		const data = this.getData()

		const date = new Date()
		const localDateString = date.toLocaleDateString()

		if (data.lastPostDate === localDateString) {
			this.log("Already posted today.")
			return
		}

		data.lastPostDate = localDateString
		this.setData(data)

		this.ai.post({
			text: serifs.rogubo,
		})
	}
}
