# Web dev environment for html codings

## はじめに

現状のgulpfile.jsとpackage.json、.jshintrcなどの設定ファイルを共有しますが、まだ最低限しか動いていませんorz

いまの時点では「とりあえずまず動くもの」というつもりで、これをベースに拡張します。

## 事前の確認

まず最初にコンソールで

	ruby -v
	sass -v
	node -v

を確認してください。

記載時点(2015/06/30)での環境はrubyがv2.2.2、sassはv3.4.14、nodeはv0.12.4のはずです。

このテのツールはバージョンの違いで動かないことが往々にしてあるので、まずそこをご注意ください。

わからない場合ググれば大体の情報は出てきますが、いくつか注意が必要です。

	・rubyはrbenv、nodeはnodebrewでバージョン管理されているので、「グローバル」にインストールされているrubyとは必ずしもバージョンが一致しません。
	・node.jsはnodebrewでバージョン管理されているので **「グローバル」にはインストールしていません** 。
	・gulp.jsも操作の煩雑さ、バージョン違いによるエラーを防ぐために **「グローバル」にはインストールしていません** 。

特にgulp.jsはほとんどのブログ記事でグローバルにインストールしているのが前提になっていますので、自分でgulpfile.jsを書き換えたりする場合注意してください。

## 共有するファイル群について

共有するファイルは下記の6つです。

	gulpfile.js
	package.json
	.editorconfig
	.gitignore
	.htmlhintrc
	.jshintrc

以前はsassの設定ファイルとして	config.rbを使っていましたが、このセットではgulp-sassをnode.jsで走らせているのでrubyは使いません。

初期状態での全体のディレクトリ構成は

	└ [work_today]
		└ [【クライアントサイトURL】]
			└ [source]
				└ [html]
					├ .editorconfig
					│
					├ .gitignore
					│
					├ .htmlhintrc
					│
					├ .jshintrc
					│
					├ package.json
					│
					├ gulpfile.js
					│
					└ [project]
						├ index.html
						│
						└ [resources]
							│
							├ [sass]
							│
							├ [raw-images]
							│
							├ [plugins]
							│
							└ [js]

のようになります。projectディレクトリがroot(htdocs)になります。

## 手順

1. ターミナルを起動してprojectディレクトリに移動します。

	$ cd path/to/source/html

- ちなみに、「cd + スペース」を入力したあと Finder から「html」ディレクトリをターミナルにドラッグ・アンド・ドロップすると、そのディレクトリまでのパスが表示されるので楽ができます。
- 「npm install」コマンドを入力するとパッケージ群がインストールされます。
- 「npm start」コマンドでタスクが走って「project」ディレクトリ以下が監視され、デフォルトのブラウザで「localhost:3000」が立ち上がります。

## タスクの内容について

### jsのソースチェック

1. 「resources」の「js」ディレクトリ内に.jsファイルを配置します。
- デフォルトのタスクが走る際、まず最初に「gulp-jshint」がjsのソースをチェックしてターミナルにlogを出します。

### jsのminify

1. 「resources」の「js」ディレクトリ内にsetting.jsファイルを配置します。
- 「resources」の「plugins」ディレクトリ内にjQueryのプラグインの.jsファイルを配置します。
- 「resources > plugins」ディレクトリにある.jsファイル群を「script.js」1つにまとめます。また、プラグインの先頭に記述してあるライセンスのコメントは圧縮後も残ります。
- まとめたscript.jsファイルとsetting.jsをそれぞれ圧縮します。
- 「project」ディレクトリ直下に「js」ディレクトリを生成し、その中に圧縮したscript.jsとsetting.jsを書き出します。
- 以後「gulp」が動作中は.jsファイルの書き換えごとに読み込み→圧縮→生成が自動で行われ、ブラウザがリロードされます。

### 画像のminify

1. 「resources」の「raw-images」ディレクトリ内に画像ファイルを配置します。
- 対応しているファイル形式は.jpg、.gif、.png、.svgです。
- 「resources > raw-images」内の新しいファイルだけを「images」ディレクトリに移動します。
- 追加された画像を圧縮します。
- 以後「gulp」が動作中は.「raw-images」に画像が追加されるごとに圧縮が自動で行われ、ブラウザがリロードされます。

### sassのコンパイル

1. 「resources」の「sass」ディレクトリ内に.scssファイルを配置します。
- .scssファイルを変更するとgulpのタスクでコンパイルが行われます。（コンパイルはgulp-sassを使っています）
- 各ブラウザに対応するプレフィックスを自動で付与します。
- コンパイルされた.cssファイルが「resources」ディレクトリ直下の「css」ディレクトリに生成されます。（extendedで生成されます）
- 「resources > css」ディレクトリに.cssファイルが複数あった場合はstyle.css1つにまとめられます。

		※現状では圧縮するファイルの順番を指定できません。

- メディアクエリの記述をまとめます。
- style.cssファイルを圧縮します。
- 「project」ディレクトリ直下にstyle.cssを書き出します。
- 以後「gulp」が動作中は.scssファイルの書き換えごとにコンパイル→圧縮→生成が自動で行われ、ブラウザがリロードされます。

### browser-syncでライブリロード

1. 「npm start」コマンドで自動でブラウザが立ち上がり、.htmlファイル、.scssファイル、.jsファイルの書き換えごとにブラウザが自動でリロードします。

		browser-syncが立ち上げているサーバはnode.jsで動いているので、.phpファイルは動作しません…。

2. 詳細は<a href="http://wp-e.org/2014/12/18/5385/" target="_blank">こちら</a>をご覧ください（ステマ）。

稼働状態での全体のディレクトリ構成は以下のようになります。

	└ [work_today]
		└ [【クライアントサイトURL】]
			└ [source]
				└ [html]
					├ .editorconfig
					│
					├ .gitignore
					│
					├ .htmlhintrc
					│
					├ .jshintrc
					│
					├ package.json
					│
					├ gulpfile.js
					│
					└ [project]
						│
						├ index.html
						│
						├ style.css
						│
						├ [js]
						│  │
						│  ├ script.js
						│  │
						│  └ setting.js
						│
						├ config.rb
						│
						└ [resources]
							│
							├ [css]
							│
							├ [sass]
							│
							├ [raw-images]
							│
							├ [plugins]
							│
							└ [js]

## 既知の問題

	・スプライト画像の生成をしていないorz
		-> いずれ gulp.spritesmith を使用する予定
	・source mapを書き出しているのに使えないorz
	・sasslintでsassファイルの記述チェックをしたい
	・.jsファイルの書き出しを1ファイルにまとめたい

などがありますorz メンテするまとまった時間がほしい今日このごろです…。

## Changelog

### 1.0.0
#### 2015.07.15
- version番号を変更

### 0.1.0
#### 2015.06.30
- first commit
- private v0.1.10から移植
