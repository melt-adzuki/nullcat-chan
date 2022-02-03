import autobind from "autobind-decorator"
import fetch from "node-fetch"
import { z } from "zod"

import Module from "@/module"
import config from "@/config"

export default class extends Module {
	public readonly name = "github-status"

	private indicator = "none"
	private description = ""

	private readonly schema = z.object({
		page: z.object({
			id: z.string(),
			name: z.string(),
			url: z.string().url(),
			updatedAt: z.string(),
		}),
		status: z.object({
			description: z.string(),
			indicator: z.string(),
		}),
	})

	@autobind
	public install() {
		if (!config.serverMonitoring) return {}

		setInterval(this.getStatus, 60 * 60)

		return {}
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

				await this.checkStatus()
			} else {
				console.warn("GitHub Status Module: Validation failed.")
			}

		} catch (error) {
			console.warn("GitHub Status Module: Failed to fetch status from GitHub.")
		}
	}

	@autobind
	private async checkStatus() {
		if (this.indicator === "none") return

		this.warn()
	}

	@autobind
	private warn() {
		this.ai.post({
			text: `GitHub重いかもしれにゃい...\n\nじょうきょう: ${this.indicator}\nせつめい: ${this.description}`
		})
	}
}
