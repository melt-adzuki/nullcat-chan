import autobind from 'autobind-decorator';
import * as loki from 'lokijs';
import Message from '@/message';
import Module from '@/module';
import NGWord from '@/ng-words';
import config from '@/config';
import serifs from '@/serifs';
import { mecab } from './mecab';

function kanaToHira(str: string) {
	return str.replace(/[\u30a1-\u30f6]/g, (match) => {
		const chr = match.charCodeAt(0) - 0x60;
		return String.fromCharCode(chr);
	});
}

export default class extends Module {
	public readonly name = 'keyword';

	private learnedKeywords: loki.Collection<{
		keyword: string;
		learnedAt: number;
	}>;

	private ngWord = new NGWord();

	@autobind
	public install() {
		if (!config.keywordEnabled) return {};

		this.learnedKeywords = this.ai.getCollection('_keyword_learnedKeywords', {
			indices: ['userId']
		});

		setInterval(this.learn, 1000 * 60 * 45);

		return {
			mentionHook: this.mentionHook
		};
	}

	@autobind
	private async learn() {
		const tl = await this.ai.api('notes/hybrid-timeline', {
			limit: 30
		});

		const interestedNotes = tl.filter((note) => note.userId !== this.ai.account.id && note.text != null && note.cw == null);

		let keywords: string[][] = [];

		for (const note of interestedNotes) {
			const tokens = await mecab(note.text, config.mecab, config.mecabDic);
			const keywordsInThisNote = tokens.filter((token) => token[2] == '固有名詞' && token[8] != null);
			keywords = keywords.concat(keywordsInThisNote);
		}

		if (keywords.length === 0) return;

		const rnd = Math.floor((1 - Math.sqrt(Math.random())) * keywords.length);
		const keyword = keywords.sort((a, b) => (a[0].length < b[0].length ? 1 : -1))[rnd];

		const exist = this.learnedKeywords.findOne({
			keyword: keyword[0]
		});

		let text: string;

		if (exist) {
			return;
		} else {
			this.learnedKeywords.insertOne({
				keyword: keyword[0],
				learnedAt: Date.now()
			});

			const isNGWord = this.ngWord.get.some((word) => keyword[0] === word);
			if (isNGWord) return;

			text = serifs.keyword.learned(keyword[0], kanaToHira(keyword[8]));
		}

		this.ai.post({
			text: text
		});
	}

	@autobind
	private async mentionHook(msg: Message) {
		if (msg.includes(['覚えて', 'おぼえて'])) {
			this.log('Keyword learn requested');
			msg.reply('がんばってみるね');
			this.learn();
			return {
				reaction: ':bikkuri_nullcatchan:'
			};
		} else {
			return false;
		}
	}
}
