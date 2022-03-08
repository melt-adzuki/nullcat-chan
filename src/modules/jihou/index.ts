import Module from "@/module"
import autobind from "autobind-decorator"

const accurateInterval = require("accurate-interval")

export default class extends Module {
	public readonly name = "jihou"

	@autobind
	public install() {
		accurateInterval(this.post, 1000 * 60 * 60, { aligned: true, immediate: true })

		return {}
	}

	@autobind
	private async post() {
		const date = new Date()
		date.setMinutes(date.getMinutes() + 1)

		const hour = date.getHours()

		switch (hour) {

			default:
				this.nullcatChan.post({
					text: `${hour}時だよ！`,
				})
				break

			case 7:
				this.nullcatChan.post({
					text: `みんなおはよ！${hour}時だよ！`,
				})
				break

			case 1:
				this.nullcatChan.post({
					text: `${hour}時だよ！みんなそろそろ寝る時間かな？`,
				})
				break

			case 5:
				this.nullcatChan.post({
					text: `${hour}時だよ！ログボリセットの時間だよ！！`,
				})
				break
		}
	}
}
