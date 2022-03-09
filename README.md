## これってなに？
Misskey用の[Aiベース](https://github.com/syuilo/ai)のBotです。
 ```
     _   __      ____           __  ________                __
    / | / /_  __/ / /________ _/ /_/ ____/ /_  ____ _____  / /
   /  |/ / / / / / / ___/ __ `/ __/ /   / __ \/ __ `/ __ \/ /
  / /|  / /_/ / / / /__/ /_/ / /_/ /___/ / / / /_/ / / / /_/
/_/ |_/\__,_/_/_/\___/\__,_/\__/\____/_/ /_/\__,_/_/ /_(_)
```

## 大きな変更点
- 自動投稿の内容
- pingに対する返答の内容
- 自動返信の内容
- ゴママヨに反応([ここ](https://github.com/ThinaticSystem/gomamayo.js)から持ってきた)
- ゲーム機能と絵文字を自動生成するやつがない
- GitHubのStatusがわかる
- やることを決めてくれる
- 気圧の状況を教えてくれる
- 時報機能
- 天気機能(気象庁API)
- シェル芸機能([ここ](https://github.com/sim1222/shellgei-misskey)から持ってきた)

## 導入方法
> Node.js と npm と MeCab がインストールされている必要があります。

まず適当なディレクトリに `git clone` します。
次にそのディレクトリに `config.json` を作成します。中身は次のようにします:
``` json
{
	"host": "https:// + あなたのインスタンスのURL (末尾の / は除く)",
	"i": "ぬるきゃっとちゃん！として動かしたいアカウントのアクセストークン",
	"master": "管理者のユーザー名(オプション)",
	"notingEnabled": "ランダムにノートを投稿する機能。true(on) or false(off)",
	"keywordEnabled": "キーワードを覚える機能 (MeCab が必要) true or false",
	"serverMonitoring": "サーバー監視の機能（重かったりすると教えてくれるよ。）true or false",
	"mecab": "MeCab のインストールパス (ソースからインストールした場合、大体は /usr/local/bin/mecab) true or false",
	"mecabDic": "MeCab の辞書ファイルパス (オプション)",
	"memoryDir": "memory.jsonの保存先（オプション、デフォルトは'.'（レポジトリのルートです））",
	"shellgeiUrl": "シェル芸BotのAPIのURLです（デフォルトではhttps://websh.jiro4989.com/api/shellgei）"
}
```
`npm install` して `npm run build` して `npm start` すれば起動できます。

### Dockerで動かす
まず適当なディレクトリに `git clone` します。<br>
次にそのディレクトリに `config.json` を作成します。中身は次のようにします:
（MeCabの設定、memoryDirについては触らないでください）
``` json
{
	"host": "https:// + あなたのインスタンスのURL (末尾の / は除く)",
	"i": "ぬるきゃっとちゃん！として動かしたいアカウントのアクセストークン",
	"master": "管理者のユーザー名(オプション)",
	"notingEnabled": "ランダムにノートを投稿する機能。true(on) or false(off)",
	"keywordEnabled": "キーワードを覚える機能 (MeCab が必要) true or false",
	"mecab": "/usr/bin/mecab",
	"mecabDic": "/usr/lib/x86_64-linux-gnu/mecab/dic/mecab-ipadic-neologd/",
	"memoryDir": "data",
	"shellgeiUrl": "シェル芸BotのAPIのURLです（デフォルトではhttps://websh.jiro4989.com/api/shellgei）"
}
```
`npm install` して `npm run docker` すれば起動できます。<br>
`docker-compose.yml` の `enable_mecab` を `0` にすると、MeCabをインストールしないようにもできます。（メモリが少ない環境など）

#### 一部の機能にはフォントが必要です。僕にはフォントは同梱されていないので、ご自身でフォントをインストールしてそのフォントを`font.ttf`という名前でインストールディレクトリに設置してください。
#### 僕は記憶の保持にインメモリデータベースを使用しており、僕のインストールディレクトリに `memory.json` という名前で永続化されます。
