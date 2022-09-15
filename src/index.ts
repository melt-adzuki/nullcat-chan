// AiOS bootstrapper

import 'module-alias/register';

import * as chalk from 'chalk';
import * as request from 'request-promise-native';
const promiseRetry = require('promise-retry');

import 藍 from './ai';
import config from './config';
import _log from './utils/log';
const pkg = require('../package.json');

import CoreModule from './modules/core';
import TalkModule from './modules/talk';
import BirthdayModule from './modules/birthday';
import PingModule from './modules/ping';
import EmojiReactModule from './modules/emoji-react';
import FortuneModule from './modules/fortune';
import KeywordModule from './modules/keyword';
import TimerModule from './modules/timer';
import ServerModule from './modules/server';
import FollowModule from './modules/follow';
import ValentineModule from './modules/valentine';
import SleepReportModule from './modules/sleep-report';
import NotingModule from './modules/noting';
import ReminderModule from './modules/reminder';

// Additional modules
import FeelingModule from './modules/feeling';
import GitHubStatusModule from './modules/github-status';
import CloudflareStatus from './modules/cloudflare-status';
import GomamayoModule from './modules/gomamayo';
import JihouModule from './modules/jihou';
import KiatsuModule from './modules/kiatsu';
import RoguboModule from './modules/rogubo';
import TraceMoeModule from './modules/trace-moe';
import WhatModule from './modules/what';
import YarukotoModule from './modules/yarukoto';
import ShellGeiModule from './modules/shellgei';
import SversionModule from './modules/Sversion';
import AyashiiModule from './modules/ayashii';

console.log('    _   __      ____           __  ________                __     ');
console.log('   / | / /_  __/ / /________ _/ /_/ ____/ /_  ____ _____  / /     ');
console.log('  /  |/ / / / / / / ___/ __ `/ __/ /   / __ \\/ __ `/ __ \\/ /    ');
console.log(' / /|  / /_/ / / / /__/ /_/ / /_/ /___/ / / / /_/ / / / /_/       ');
console.log('/_/ |_/\\__,_/_/_/\\___/\\__,_/\\__/\\____/_/ /_/\\__,_/_/ /_(_)\n');

function log(msg: string): void {
	_log(`[Boot]: ${msg}`);
}

log(chalk.bold(`Nullcat chan! v${pkg._v}`));

promiseRetry(
	(retry) => {
		log(`Account fetching... ${chalk.gray(config.host)}`);

		// アカウントをフェッチ
		return request
			.post(`${config.apiUrl}/i`, {
				json: {
					i: config.i
				}
			})
			.catch(retry);
	},
	{
		retries: 3
	}
)
	.then((account) => {
		const acct = `@${account.username}`;
		log(chalk.green(`Account fetched successfully: ${chalk.underline(acct)}`));

		log('Starting Nullcat chan...');

		// 藍起動
		new 藍(account, [
			new CoreModule(),
			new EmojiReactModule(),
			new FortuneModule(),
			new TimerModule(),
			new TalkModule(),
			new PingModule(),
			new ServerModule(),
			new FollowModule(),
			new BirthdayModule(),
			new ValentineModule(),
			new KeywordModule(),
			new SleepReportModule(),
			new NotingModule(),
			new ReminderModule(),
			new GomamayoModule(),
			new GitHubStatusModule(),
			new CloudflareStatus(),
			new YarukotoModule(),
			new RoguboModule(),
			new KiatsuModule(),
			new JihouModule(),
			new WhatModule(),
			new FeelingModule(),
			new TraceMoeModule(),
			new ShellGeiModule(),
			new SversionModule(),
			new AyashiiModule()
		]);
	})
	.catch((e) => {
		log(chalk.red('Failed to fetch the account'));
	});
