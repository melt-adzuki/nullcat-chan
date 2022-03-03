// Nullcat chan! bootstrapper

import * as chalk from "chalk"
import "module-alias/register"
import * as request from "request-promise-native"
import config from "./config"
import BirthdayModule from "./modules/birthday"
import CoreModule from "./modules/core"
import EmojiReactModule from "./modules/emoji-react"
import FeelingModule from "./modules/feeling"
import FollowModule from "./modules/follow"
import FortuneModule from "./modules/fortune"
import GitHubStatusModule from "./modules/github-status"
import GomamayoModule from "./modules/gomamayo"
import JihouModule from "./modules/jihou"
import KeywordModule from "./modules/keyword"
import KiatsuModule from "./modules/kiatsu"
import NotingModule from "./modules/noting"
import PingModule from "./modules/ping"
import ReminderModule from "./modules/reminder"
import RoguboModule from "./modules/rogubo"
import ServerModule from "./modules/server"
import SleepReportModule from "./modules/sleep-report"
import TalkModule from "./modules/talk"
import TimerModule from "./modules/timer"
import TraceMoeModule from "./modules/trace-moe"
import ValentineModule from "./modules/valentine"
import WeatherModule from "./modules/weather"
import WhatModule from "./modules/what"
import YarukotoModule from "./modules/yarukoto"
import NullcatChan from "./nullcat-chan"
import _log from "./utils/log"
import ShellGeiModule from './modules/shellgei';

const promiseRetry = require("promise-retry")

const pkg = require("../package.json")

console.log("    _   __      ____           __  ________                __     ")
console.log("   / | / /_  __/ / /________ _/ /_/ ____/ /_  ____ _____  / /     ")
console.log("  /  |/ / / / / / / ___/ __ `/ __/ /   / __ \\/ __ `/ __ \\/ /    ")
console.log(" / /|  / /_/ / / / /__/ /_/ / /_/ /___/ / / / /_/ / / / /_/       ")
console.log("/_/ |_/\\__,_/_/_/\\___/\\__,_/\\__/\\____/_/ /_/\\__,_/_/ /_(_)\n")

function log(msg: string): void {
	_log(`[Boot]: ${msg}`)
}

log(chalk.bold(`Nullcat chan! v${pkg._v}`))

promiseRetry(
	(retry) => {
		log(`Account fetching... ${chalk.gray(config.host)}`)

		// アカウントをフェッチ
		return request
			.post(`${config.apiUrl}/i`, {
				json: {
					i: config.i,
				},
			})
			.catch(retry)
	},
	{
		retries: 3,
	}
)
	.then((account) => {
		const acct = `@${account.username}`
		log(chalk.green(`Account fetched successfully: ${chalk.underline(acct)}`))

		log("Starting Nullcat chan...")

		// ぬるきゃっとちゃん起動
		new NullcatChan(account, [
			new CoreModule(),
			new EmojiReactModule(),
			new FortuneModule(),
			new TimerModule(),
			new TalkModule(),
			new PingModule(),
			new FollowModule(),
			new BirthdayModule(),
			new ValentineModule(),
			new KeywordModule(),
			new SleepReportModule(),
			new NotingModule(),
			new ReminderModule(),
			new GomamayoModule(),
			new GitHubStatusModule(),
			new YarukotoModule(),
			new RoguboModule(),
			new KiatsuModule(),
			new JihouModule(),
			new WhatModule(),
			new FeelingModule(),
			new TraceMoeModule(),
			new WeatherModule(),
			new ServerModule(),
			new ShellGeiModule(),
		])
	})
	.catch((e) => {
		log(chalk.red("Failed to fetch the account"))
	})
