import Module from "@/module"
import serifs from "@/serifs"
import autobind from "autobind-decorator"

export default class extends Module {
	public readonly name = "sleepReport"

	@autobind
	public install() {
		this.report()

		return {}
	}

	@autobind
	private report() {
		const now = Date.now()

		const sleepTime = now - this.nullcatChan.lastSleepedAt

		const sleepHours = sleepTime / 1000 / 60 / 60

		if (sleepHours < 0.1) return

		if (sleepHours >= 1) {
			this.nullcatChan.post({
				text: serifs.sleepReport.report(Math.round(sleepHours)),
			})
		} else {
			this.nullcatChan.post({
				text: serifs.sleepReport.reportUtatane,
			})
		}
	}
}
