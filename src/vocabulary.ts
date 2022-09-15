import * as seedrandom from 'seedrandom';

export const itemPrefixes = [
	'そこらへんの',
	'使用済み',
	'壊れた',
	'市販の',
	'オーダーメイドの',
	'業務用の',
	'Microsoft製',
	'Apple製',
	'高級',
	'腐った',
	'人工知能搭載',
	'携帯型',
	'透明な',
	'光る',
	'動く',
	'USBコネクタ付きの',
	'いにしえの',
	'呪われた',
	'幻の',
	'仮想的な',
	'異世界の',
	'異星の',
	'謎の',
	'時空を歪める',
	'究極の',
	'異臭を放つ',
	'得体の知れない',
	'四角い',
	'暴れ回る',
	'夢の',
	'闇の',
	'暗黒の',
	'封印されし',
	'凍った',
	'魔の',
	'禁断の',
	'ホログラフィックな',
	'次世代',
	'3G対応',
	'消費期限切れ',
	'消える',
	'もちもち',
	'冷やし',
	'あつあつ',
	'巨大',
	'ナノサイズ',
	'やわらかい',
	'人の手に負えない',
	'バグった',
	'人工',
	'天然',
	'超',
	'中古の',
	'新品の',
	'ぷるぷる',
	'ぐにゃぐにゃ',
	'多目的',
	'いい感じ™の',
	'激辛',
	'先進的な',
	'レトロな',
	'合法',
	'違法',
	'プレミア付き',
	'怪しい',
	'妖しい',
	'やばい',
	'すごい',
	'かわいい',
	'デジタル',
	'アナログ',
	'100年に一度の',
	'食用',
	'THE ',
	'解き放たれし',
	'大きな',
	'小さな',
];

export const items = [
	'右足',
	'左足',
	'お金',
	'金パブ',
	'ブロン',
	'ぬるきゃっとちゃん！',
	'この世のすべて',
	'量子コンピューター',
	'スマホ',
	'PC',
	'モンスター',
	'好きなもの',
	'ぬいぐるみ',
	'おふとん',
	'森羅万象',
	'めがね',
];

export const and = [
	'に擬態した',
	'入りの',
	'が埋め込まれた',
	'を連想させる',
	'っぽい',
	'に見せかけて',
	'を虐げる',
	'を侍らせた',
	'が上に乗った',
	'のそばにある',
];

export function genItem(seedOrRng?: (() => number) | string | number) {
	const rng = seedOrRng
		? typeof seedOrRng === 'function'
			? seedOrRng
			: seedrandom(seedOrRng.toString())
		: Math.random;

	let item = '';
	if (Math.floor(rng() * 5) !== 0) item += itemPrefixes[Math.floor(rng() * itemPrefixes.length)];
	item += items[Math.floor(rng() * items.length)];
	if (Math.floor(rng() * 10) === 0) {
		item += and[Math.floor(rng() * and.length)];
		if (Math.floor(rng() * 5) !== 0) item += itemPrefixes[Math.floor(rng() * itemPrefixes.length)];
		item += items[Math.floor(rng() * items.length)];
	}
	return item;
}
