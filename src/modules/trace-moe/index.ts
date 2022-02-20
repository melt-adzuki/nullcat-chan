import { z } from "zod"
import Module from "@/module"
import autobind from "autobind-decorator"
import Message from "@/message"
import fetch from "node-fetch"

const humanizeDuration = require("humanize-duration")

export default class extends Module {
    public readonly name = "trace-moe"

    private readonly itemSchema = z.object({
        anilist: z.object({
						title: z.object({
								native: z.string(),
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

				const filteredImageFiles = message.files.filter(file => file.type.startsWith("image"))

				if (!filteredImageFiles.length) {
						this.log("No vaid images found.")
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
            mentionHook: this.mentionHook
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

				if (typeof traceMoe.episode === "string") traceMoe.episode = traceMoe.episode.replace("|", "か")
				else if (Array.isArray(traceMoe.episode)) traceMoe.episode = traceMoe.episode.join("話と")

				if (traceMoe.from && traceMoe.to) {
						const options = { language: "ja", round: true, delimiter: "", spacer: "" }

						traceMoe.from = humanizeDuration(traceMoe.from * 1000, options)
						traceMoe.to = humanizeDuration(traceMoe.to * 1000, options)
				}

				const pronoun = traceMoe.episode || (traceMoe.from && traceMoe.to) ? "これは" : "このアニメは"

				const prefix =
						traceMoe.similarity >= 0.9
						? `${pronoun}`
						: traceMoe.similarity >= 0.8
						? `${pronoun}たぶん`
						: "よくわかんないけど、強いて言うなら"

				const suffix =
						traceMoe.similarity >= 0.9
						? "だよ！"
						: traceMoe.similarity >= 0.8
						? `だと思う！`
						: "に似てるかな"

				const time =
						(traceMoe.from && traceMoe.to) && (traceMoe.from === traceMoe.to)
						? traceMoe.from
						: `${traceMoe.from}から${traceMoe.to}`

				const animeTitle = traceMoe.anilist.title.native

				const content =
						traceMoe.episode && traceMoe.from && traceMoe.to
						? `『${animeTitle}』第${traceMoe.episode}話の${time}`
						: traceMoe.from && traceMoe.to
						? `『${animeTitle}』の${time}`
						: traceMoe.episode
						? `『${animeTitle}』の第${traceMoe.episode}話`
						: `『${animeTitle}』`

				const messageToReply = `${prefix}${content}${suffix}`

				if (traceMoe.anilist.isAdult) {
						message.reply(messageToReply, { cw: "そぎぎ" })
				} else {
						message.reply(messageToReply)
				}

				return true
    }
}
