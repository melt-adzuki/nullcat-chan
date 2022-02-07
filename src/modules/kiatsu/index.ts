import autobind from "autobind-decorator"
import fetch from "node-fetch"
import { z } from "zod"

import Module from "@/module"
import Message from "@/message"

export default class extends Module {
	public readonly name = "kiatsu"

	private readonly itemSchema = z.object({
		time: z.enum(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]),
		weather: z.string(),
		temp: z.string(),
		pressure: z.string(),
		pressure_level: z.enum(["0", "1", "2", "3", "4"]),
	})

	private readonly schema = z.object({
		place_name: z.literal("東京都中央区"),
		place_id: z.literal("102"),
		prefectures_id: z.literal("13"),
		dateTime: z.string(),
		yesterday: z.array(this.itemSchema).optional(),
		today: z.array(this.itemSchema),
		tomorrow: z.array(this.itemSchema).optional(),
		dayaftertomorrow: z.array(this.itemSchema).optional(),
	})

	private currentPressureLevel: z.infer<typeof this.itemSchema>["pressure_level"] = "0"

	private readonly stringPressureLevel: { [K in typeof this.currentPressureLevel]: string } = {
		0: "問題ないかも。無理しないでね。",
		1: "問題ないかも。無理しないでね。",
		2: "気圧ちょっとやばいかも。無理しないでね。",
		3: "気圧やばいかも。無理しないでね。",
		4: "気圧かなりやばいかも。無理しないでね。",
	} as const

	@autobind
	public install() {
		setInterval(this.update, 10 * 60 * 1000)
		setInterval(this.post, 60 * 60 * 1000)

		this.update()

		return {
			mentionHook: this.mentionHook,
		}
	}

	@autobind
	private async update() {
		try {
			const response = await fetch("https://zutool.jp/api/getweatherstatus/13102")
			const data = await response.json()

			const result = this.schema.safeParse(data)

			if (!result.success) {
				this.log("Validation failed.")
				console.warn(result.error)

				return
			}

			const date = new Date()
			const hour = this.itemSchema.shape.time.parse(date.getHours().toString())

			this.currentPressureLevel = result.data.today[hour].pressure_level

		} catch (error) {
			this.log("Failed to fetch status.")
			console.warn(error)
		}
	}

	@autobind
	private post() {
		if (this.currentPressureLevel === "0" || this.currentPressureLevel === "1") return

		this.ai.post({
			text: this.stringPressureLevel[this.currentPressureLevel],
		})
	}

	@autobind
	private async mentionHook(message: Message) {
		if (!message.includes(["気圧", "きあつ"])) return false

		message.reply(this.stringPressureLevel[this.currentPressureLevel], {
			immediate: true,
		})
		
		return true
	}
}
