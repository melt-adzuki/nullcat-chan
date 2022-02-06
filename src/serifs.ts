// せりふ

export default {
	core: {
		setNameOk: name => `わかった！今度から${name}って呼ぶね！`,

		san: 'さん付けした方がいいかな？',

		yesOrNo: '僕「はい」か「いいえ」しかわからないんだ...',

		hello: name => name ? `やっほぉ${name}` : `やっほぉ！`,

		helloNight: name => name ? `こんばんわ${name}！` : `こんばんわ～！`,

		goodMorning: (tension, name) => name ? `おはよ${name}！${tension}` : `おはよ！${tension}`,

		/*
		goodMorning: {
			normal: (tension, name) => name ? `おはようございます、${name}！${tension}` : `おはようございます！${tension}`,

			hiru: (tension, name) => name ? `おはようございます、${name}！${tension}もうお昼ですよ？${tension}` : `おはようございます！${tension}もうお昼ですよ？${tension}`,
		},
*/

		goodNight: name => name ? `おやすみ${name}！` : 'おやすみ！',

		omedeto: name => name ? `ありがと～${name}！` : 'ありがと～！',

		erait: {
			general: name => name ? [
				`${name}、今日もえらい！`,
				`${name}、今日もえらいね！`
			] : [
				`今日もえらい！`,
				`今日もえらいね！`
			],

			specify: (thing, name) => name ? [
				`${name}、${thing}てえらい！`,
				`${name}、${thing}てえらいね！`
			] : [
				`${thing}てえらい！`,
				`${thing}てえらいね！`
			],

			specify2: (thing, name) => name ? [
				`${name}、${thing}でえらい！`,
				`${name}、${thing}でえらいね！`
			] : [
				`${thing}でえらい！`,
				`${thing}でえらいね！`
			],
		},

		okaeri: {
			love: name => name ? [
				`おかえり${name}！`,
				`おかえりぃ${name}～`
			] : [
				'おかえり！',
				'おかえりぃ～'
			],

			love2: name => name ? `にゃぁ～♡♡おかえり♡♡♡${name}今日も偉いね♡♡♡` : 'にゃぁ～♡♡おかえり♡♡♡今日も偉いね♡♡♡',

			normal: name => name ? `おかえり${name}！` : 'おかえり！',
		},

		itterassyai: {
			love: name => name ? `いってらっしゃい${name}！` : 'いってらっしゃい！',

			normal: name => name ? `いってらっしゃい${name}！` : 'いってらっしゃい！',
		},

		tooLong: '長すぎる..',

		invalidName: '発音が難しいよぉ...',

		nadenade: {
			normal: 'うにゃ…？！ びっくりした...',

			love2: ['あぅ… 恥ずかしいよぉ', 'あぅ… 恥ずかしぃ…', 'ふみゃ…！？'],

			love3: ['んへへぇ♡ ありがと♡♡♡', 'にへぇ～～', 'んみゅっ… ', 'もっともっとぉ...'],

			hate1: 'やめて',

			hate2: '触んないで',

			hate3: 'きもい',

			hate4: '..？',
		},

		kawaii: {
			normal: ['そんなことないよ？', 'えへへへうれしい。'],

			love: ['えへへ。うれしいな', 'んむぅ～～...うれしい。'],

			hate: 'は？きも。'
		},

		suki: {
			normal: 'えへへ。ありがと～！',

			love: name => `僕も${name}のこと好き！`,

			hate: null
		},

		hug: {
			normal: 'ぎゅー...',

			love: 'ぎゅーっ♪',

			hate: '離れてください...'
		},

		humu: {
			love: 'もふもふ！ふみふみ！',

			normal: 'ふみふみ！',

			hate: '？'
		},

		batou: {
			love: 'ば～か♡♡♡',

			normal: 'きっしょ',

			hate: '？'
		},

		itai: name => name ? `${name}大丈夫？なでなで` : '大丈夫？なでなで',

		turai: {
			love: name => name ? `${name}なでなで ぽんぽんぎゅ～！` : 'なでなで ぽんぽんぎゅ～！',

			normal: name => name ? `${name}なでなで` : 'なでなで',

			hate: 'ん～。がんばって',
		},

		kurusii: {
			love: name => name ? `${name}なでなで ぽんぽんぎゅ～！` : 'なでなで ぽんぽんぎゅ～！',

			normal: name => name ? `${name}なでなで` : 'なでなで',

			hate: 'ん～。がんばって',
		},

		ote: {
			normal: '犬じゃないんだが！！',

			love1: 'にゃ～！ぼくは犬じゃないよぉ',

			love2: 'にゃにゃにゃ！',
		},

		shutdown: 'ぼくまだ眠くない...',

		transferNeedDm: 'わかった！二人っきりでお話ししたいな',

		transferCode: code => `わかった！\n合言葉は「${code}」だよ！`,

		transferFailed: 'うーん、合言葉違うみたい',

		transferDone: name => name ? `んみゃ..！ おかえり${name}！` : `んみゃ...！ おかえりなさい！`,
	},

	keyword: {
		learned: (word, reading) => `え～っと...${word}...${reading}...僕覚えた！！！`,

		remembered: (word) => `${word}`
	},

	birthday: {
		happyBirthday: name => name ? `お誕生日おめでと～～～！！！${name}！！！！！！` : 'お誕生日おめでと～～～～～！！！',
	},

	/**
	 * 占い
	 */
	fortune: {
		cw: name => name ? `今日の${name}の運勢を占ったよ！` : '今日のきみの運勢を占ったよ！',
	},

	/**
	 * タイマー
	 */
	timer: {
		set: 'OK！',

		invalid: 'うむむ？',

		tooLong: '長すぎる…',

		notify: (time, name) => name ? `${name}！！${time}経ったよ！` : `${time}経ったよ！`
	},

	/**
	 * リマインダー
	 */
	reminder: {
		invalid: 'うむむ？',

		reminds: 'やること一覧だよ！',

		notify: (name) => name ? `${name}これやった？` : `これやった？`,

		notifyWithThing: (thing, name) => name ? `${name}「${thing}」やった？` : `「${thing}」やった？`,

		done: (name) => name ? [
			`すごい！！天才！！${name}えらい！！`,
			`${name}さすがすぎる！！！`,
			`${name}えらすぎる！！`,
		] : [
			`すごい！！天才！！えらい！！`,
			`さすがすぎる！！！`,
			`えらすぎる！！`,
		],

		cancel: `OK！`,
	},

	/**
	 * バレンタイン
	 */
	valentine: {
		chocolateForYou: name => name ? `${name}！チョコあげる！` : 'チョコあげる！',
	},

	server: {
		cpu: 'CPUあっちあち！！'
	},

	sleepReport: {
		report: hours => `んみゃぁ、${hours}時間くらいねちゃってたかも`,
		reportUtatane: 'んみゃ... ',
	},

	noting: {
		notes: [
			'うみゅ',
			'んみゃぁ～',
			'ねむい',
			'さみしい',
			'なでてぇ',
			'なんもわからん',
			'う～～～',
			'ねみゅい',
			'つらいニダ',
			'うが～～～',
			'疲れた',
			'みゃ～',
			'うぅ',
			'ぬるきゃっとちゃんだよ！',
			'進捗どうですか',
			'おふとんふわふわ～',
		],
	},
};

export function getSerif(variant: string | string[]): string {
	if (Array.isArray(variant)) {
		return variant[Math.floor(Math.random() * variant.length)];
	} else {
		return variant;
	}
}
