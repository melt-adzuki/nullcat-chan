import Module from "@/module"
import serifs from "@/serifs"
import autobind from "autobind-decorator"

const accurateInterval = require("accurate-interval")

export default class extends Module {
	public readonly name = "rogubo"

	@autobind
	public install() {
		accurateInterval(this.post, 1000 * 60 * 60, { aligned: true, immediate: true })

		return {}
	}

	@autobind
	private async post() {
		const date = new Date()
		date.setMinutes(date.getMinutes() + 1)

		if (!(date.getHours() === 6)) return

		const data = this.getData()
		const localDateString = date.toLocaleDateString()

		if (data.lastPostDate === localDateString) {
			this.log("Already posted today.")
			return
		}

		data.lastPostDate = localDateString
		this.setData(data)

		setTimeout(() => {
			this.nullcatChan.post({
				text: serifs.rogubo,
			})
		}, 1000 * 60 * 60 * Math.random())
	}
}
