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
import FollowModule from './modules/follow';
import ValentineModule from './modules/valentine';
import SleepReportModule from './modules/sleep-report';
import NotingModule from './modules/noting';
import ReminderModule from './modules/reminder';
import GomamayoModule from './modules/gomamayo';
import GitHubStatusModule from './modules/github-status'
import YarukotoModule from './modules/yarukoto'
import RoguboModule from './modules/rogubo'
import KiatsuModule from './modules/kiatsu'
import JihouModule from './modules/jihou'
import WhatModule from './modules/what'
import FeelingModule from './modules/feeling';

console.log('   __    ____  _____  ___ ');
console.log('  /__\\  (_  _)(  _  )/ __)');
console.log(' /(__)\\  _)(_  )(_)( \\__ \\');
console.log('(__)(__)(____)(_____)(___/\n');

function log(msg: string): void {
	_log(`[Boot]: ${msg}`);
}

log(chalk.bold(`Ai v${pkg._v}`));

promiseRetry(retry => {
	log(`Account fetching... ${chalk.gray(config.host)}`);

	// アカウントをフェッチ
	return request.post(`${config.apiUrl}/i`, {
		json: {
			i: config.i
		}
	}).catch(retry);
}, {
	retries: 3
}).then(account => {
	const acct = `@${account.username}`;
	log(chalk.green(`Account fetched successfully: ${chalk.underline(acct)}`));

	log('Starting AiOS...');

	// 藍起動
	new 藍(account, [
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
	]);
}).catch(e => {
	log(chalk.red('Failed to fetch the account'));
});
