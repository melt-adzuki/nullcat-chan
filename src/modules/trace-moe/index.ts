import Message from "@/message"
import Module from "@/module"
import autobind from "autobind-decorator"
import fetch from "node-fetch"
import { z } from "zod"
import humanizeDuration = require("humanize-duration")

export default class extends Module {
	public readonly name = "trace-moe"

	private readonly itemSchema = z.object({
		anilist: z.object({
			title: z.object({
				native: z.string().nullable(),
				romaji: z.string().nullable(),
				english: z.string().nullable(),
			}),
			isAdult: z.boolean(),
		}),
		episode: z.number().or(z.string()).or(z.array(z.number())).nullable(),
		from: z.number().nullable(),
		to: z.number().nullable(),
		similarity: z.number(),
	})

	private readonly schema = z.object({
		error: z.string(),
		result: z.array(this.itemSchema),
	})

	@autobind
	private getImageUrl(message: Message) {
		if (!message.files) {
			this.log("No files found.")
			return null
		}

		const filteredImageFiles = message.files.filter((file) => file.type.startsWith("image"))

		if (!filteredImageFiles.length) {
			this.log("No valid images found.")
			return null
		}

		return filteredImageFiles[0].url
	}

	@autobind
	private async getFromTraceMoe(imageUrl: string) {
		try {
			const response = await fetch(`https://api.trace.moe/search?anilistInfo&url=${encodeURIComponent(imageUrl)}`)

			const data = await response.json()
			const result = this.schema.safeParse(data)

			if (!result.success) {
				this.log("Validation failed.")
				this.log(JSON.stringify(data))
				console.warn(result.error)

				return null
			}

			return result.data.result[0]
		} catch (error) {
			this.log("Failed to fetch data from Trace Moe.")
			console.warn(error)

			return null
		}
	}

	@autobind
	public install() {
		return {
			mentionHook: this.mentionHook,
		}
	}

	@autobind
	private async mentionHook(message: Message) {
		if (!message.includes(["アニメ"])) return false

		if (message.isDm) {
			message.reply("僕にアニメのシーンの画像を添付して「アニメ教えて」ってメンションすると、何のアニメか教えるよ！")
			return true
		}

		const imageUrl = this.getImageUrl(message)

		if (!imageUrl) {
			message.reply("画像を添付してね！")
			return true
		}

		const traceMoe = await this.getFromTraceMoe(imageUrl)

		if (!traceMoe) {
			message.reply("みゃ～～～、いまはめんどくさいかも…")
			return true
		}

		const animeTitle = traceMoe.anilist.title.native || traceMoe.anilist.title.english
		
		if (!animeTitle) {
			message.reply("ごめんね、わかんないや…")
			return true
		}
		
		if (typeof traceMoe.episode === "string") traceMoe.episode = traceMoe.episode.replace(/\|/g, "か")
		else if (Array.isArray(traceMoe.episode)) traceMoe.episode = traceMoe.episode.join("話と")

		const options = {
			language: "ja",
			round: true,
			delimiter: "",
			spacer: "",
		}
		const fromText = traceMoe.from !== null ? humanizeDuration(traceMoe.from * 1000, options) : null
		const toText = traceMoe.to !== null ? humanizeDuration(traceMoe.to * 1000, options) : null

		const pronoun = traceMoe.episode || (traceMoe.from && traceMoe.to) ? "これは" : "このアニメは"

		const prefix = (() => {
			if (traceMoe.similarity >= 0.9) return pronoun
			if (traceMoe.similarity >= 0.8) return `${pronoun}たぶん`
			return "よくわかんないけど、強いて言うなら"
		})()

		const suffix = (() => {
			if (traceMoe.similarity >= 0.9) return "だよ！"
			if (traceMoe.similarity >= 0.8) return "だと思う！"
			return "に似てるかな"
		})()

		const time = fromText && toText && fromText === toText ? fromText : `${fromText}から${toText}`


		const detail = (() => {
			if (traceMoe.episode && traceMoe.from && traceMoe.to) return `第${traceMoe.episode}話の${time}`
			if (traceMoe.from && traceMoe.to) return `の${time}`
			if (traceMoe.episode) return `の第${traceMoe.episode}話`
			return ""
		})()
		const content = `『${animeTitle}』${detail}`

		const messageToReply = `${prefix}${content}${suffix}`

		if (traceMoe.anilist.isAdult) {
			message.reply(messageToReply, { cw: "そぎぎ" })
		} else {
			message.reply(messageToReply)
		}

		return true
	}
}
