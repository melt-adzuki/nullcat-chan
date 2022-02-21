import Message from "@/message"
import Module from "@/module"
import autobind from "autobind-decorator"

export default class extends Module {
	public readonly name = "follow"

	@autobind
	public install() {
		return {
			mentionHook: this.mentionHook,
		}
	}

	@autobind
	private async mentionHook(msg: Message) {
		if (msg.text && msg.includes(["フォロー", "フォロバ", "follow me"])) {
			if (!msg.user.isFollowing) {
				this.nullcatChan.api("following/create", {
					userId: msg.userId,
				})
				msg.reply("これからよろしくね！", { immediate: true })
				return {
					reaction: msg.friend.love >= 0 ? ":love_nullcat:" : null,
				}
			} else {
				return {
					reaction: msg.friend.love >= 0 ? ":love_nullcat:" : null,
				}
			}
		} else {
			return false
		}
	}
}
