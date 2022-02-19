import { z } from "zod"
import Module from "@/module"
import autobind from "autobind-decorator"
import Message from "@/message"
import fetch from "node-fetch"


export default class extends Module {
    public readonly name = "trace-moe"

    private readonly itemSchema = z.object({
        anilist: z.number(),
    })

    private readonly schema = z.object({
        error: z.string(),
        result: z.array(this.itemSchema),
    })

		private readonly aniListSchema = z.object({
				errors: z.array(
					z.object({
						message: z.string(),
						status: z.number(),
					}),
				).optional(),
				data: z.object({
					Media: z.object({
						title: z.object({
							native: z.string(),
						}),
					}),
				}).nullable(),
		})

		@autobind
		private getImageUrl(message: Message) {
			const filteredImageFiles = message.files.filter(file => file.type.startsWith("image"))

			if (!filteredImageFiles.length) {
				this.log("ファイルが不良品")
				return null
			}

			return filteredImageFiles[0].url
		}

		@autobind
		private async getAniListId(imageUrl: string) {
			try {
				const response = await fetch(`https://api.trace.moe/search?url=${encodeURIComponent(imageUrl)}`)

				const data = await response.json()
				const result = this.schema.safeParse(data)

				if (!result.success) {
					this.log("Validation failed in getting AniListId.")
					this.log(JSON.stringify(data))
					console.warn(result.error)

					return null
				}

				return result.data.result[0].anilist

			} catch (error) {
				this.log("Failed to fetch status from Trace Moe.")
				console.warn(error)

				return null
			}
		}

		@autobind
		private async getAnimeTitle(id: number) {
				const query = `query ($id: Int) {
						Media (id: $id, type: ANIME) {
							title { native }
						}
				}`

				const variables = { id }

				const options = {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Accept": "application/json",
						},
						body: JSON.stringify({ query, variables }),
				} as const

				try {
					const response = await fetch("https://graphql.anilist.co/", options)

					const data = await response.json()
					const result = this.aniListSchema.safeParse(data)

					if (!result.success) {
						this.log("Validation failed in getting anime title.")
						this.log(JSON.stringify(data))
						console.warn(result.error)

						return null
					}

					if (typeof result.data.errors !== "undefined") {
						this.log("The API has returned a response with some error(s).")
						console.warn(result.data.errors[0].message)

						return null
					}

					if (!result.data.data) {
						this.log("No data returned from AniList.")
						return null
					}

					return result.data.data.Media.title.native

				} catch (error) {
					this.log("Failed to get an anime title from AniList.")
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

				const imageUrl = this.getImageUrl(message)
				if (!imageUrl) return false

				const aniListId = await this.getAniListId(imageUrl)
				if (!aniListId) return false

				const animeTitle = await this.getAnimeTitle(aniListId)
				if (!animeTitle) return false

				message.reply(`このアニメはたぶん『${animeTitle}』だよ！`)
				return true
    }
}
