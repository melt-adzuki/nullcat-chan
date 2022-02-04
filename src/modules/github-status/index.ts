import autobind from "autobind-decorator"
import fetch from "node-fetch"
import { z } from "zod"

import Module from "@/module"
import Message from "@/message"
import config from "@/config"

export default class extends Module {
	public readonly name = "github-status"

	private readonly schema = z.object({
		status: z.object({
			description: z.string(),
			indicator: z.enum(["none", "minor", "major", "critical"]),
		}),
	})

	private indicator: z.infer<typeof this.schema>["status"]["indicator"]
	private description: z.infer<typeof this.schema>["status"]["description"]

	@autobind
	public install() {
		if (config.serverMonitoring) {
			setInterval(this.getStatus, 60 * 60 * 1000)
		}

		return {
			mentionHook: this.mentionHook
		}
	}

	@autobind
	private async getStatus() {
		try {
			const response = await fetch("https://www.githubstatus.com/api/v2/status.json")
			const data = await response.json()

			const result = this.schema.safeParse(data)

			if (result.success) {
				this.indicator = result.data.status.indicator
				this.description = result.data.status.description

				this.checkStatus()
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
	private checkStatus() {
		switch (this.indicator) {
			case "minor":
			case "major":
			case "critical":
				this.warn()
				break
			
			default:
				break
		}
	}

	@autobind
	private warn() {
		this.ai.post({
			text: `GitHub重いかもしれにゃい...\n\nじょうきょう: ${this.indicator}\nせつめい: ${this.description}`
		})

		this.log("Report posted.")
	}

	@autobind
	private async mentionHook(msg: Message) {
		if (msg.text?.includes("GitHub Status")) {

			msg.reply(`indicator: ${this.indicator}\ndescription: ${this.description}`, {
				immediate: true,
			})
			return true

		} else {
			return false
		}
	}
}
