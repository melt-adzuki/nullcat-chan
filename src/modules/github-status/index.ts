import config from "@/config"
import Message from "@/message"
import Module from "@/module"
import autobind from "autobind-decorator"
import fetch from "node-fetch"
import { z } from "zod"

export default class extends Module {
	public readonly name = "github-status"

	private readonly schema = z.object({
		status: z.object({
			description: z.string(),
			indicator: z.enum(["none", "minor", "major", "critical"]),
		}),
	})

	private indicator: z.infer<typeof this.schema>["status"]["indicator"] = "none"
	private description: z.infer<typeof this.schema>["status"]["description"] = ""

	@autobind
	public install() {
		if (config.serverMonitoring) {
			setInterval(this.updateStatus, 10 * 60 * 1000)
			setInterval(this.postStatus, 60 * 60 * 1000)

			this.updateStatus()
			this.postStatus()
		}

		return {
			mentionHook: this.mentionHook,
		}
	}

	@autobind
	private async updateStatus() {
		try {
			const response = await fetch("https://www.githubstatus.com/api/v2/status.json")
			const data = await response.json()

			const result = this.schema.safeParse(data)

			if (result.success) {
				this.indicator = result.data.status.indicator
				this.description = result.data.status.description
			} else {
				this.log("Validation failed.")
				console.warn(result.error)
			}
		} catch (error) {
			this.log("Failed to fetch status from GitHub.")
			console.warn(error)
		}
	}

	@autobind
	private postStatus() {
		switch (this.indicator) {
			case "minor":
			case "major":
			case "critical":
				this.nullcatChan.post({
					text: `GitHub重いかもしれにゃい...\n\nじょうきょう: ${this.indicator}\nせつめい: ${this.description}\nhttps://www.githubstatus.com/`,
				})

				this.log("Report posted.")
				break

			default:
				break
		}
	}

	@autobind
	private async mentionHook(msg: Message) {
		if (msg.text?.toLowerCase().includes("github")) {
			msg.reply(`いまのGitHubのステータスだよ！\n\nじょうきょう: ${this.indicator}\nせつめい: ${this.description}\nhttps://www.githubstatus.com`, {
				immediate: true,
			})
			return true
		} else {
			return false
		}
	}
}
