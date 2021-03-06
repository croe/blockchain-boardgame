# ルール
## 0.アプリ設定
* Require
  * node.js >= 6.0
  * ssl

```js
git clone this
cd app && npm i
npm run release
```

```js
cd market && npm i
node server.js
```

## 1.準備
まずはプレイヤーカードを１枚ずつ配り、それぞれがアプリで初期設定を行います。

次に、アセットカードをよく混ぜ、プレイヤーの人数x2の枚数ずつ配ります（例えば4人なら8枚）。残ったアセットカードは、チップの横に置きます。

国際情勢チップは全て左から３枚が表になった状態で始めます。イベントカードはよく混ぜ、チップの横に置きます。

プレイヤーの中で一番騙されやすそうな人が、ターンプレイヤーとなり、ゲームがスタートします。

## 2.ターンの流れ
毎ターン一人いるターンプレイヤーと、その他のプレイヤーのターンの流れを説明します。

### 2-1.ターンプレイヤー

1. 手元にあるアセットカードから１枚選んで、自分の前に裏向きで出す。残ったアセットカードは自分の左隣のプレイヤー前に裏側のまま置く。
2. 自分の前に置いてある選んだアセットカードを購入する。購入できない/しないカード、購入が完了したカードは裏側にして捨て札にする。イベントカードの効果がある場合はその通り実行する。
3.サイコロを振り、変化する情勢を決定する。１・２なら赤。３・４なら黄、５・６なら青のチップを１枚表にする。（６個全て表になっている場合はしない）情勢が決定したら情勢チップでアセットを売却できる。
  * チップを受け取り、イベントカードを１枚引く。このときチップは右側からしか受け取れない。
  * イベントカードの効果がある場合はその通り実行する。
  * チップを読み取り売却完了する。
  * 売却したチップは裏にして元の場所に戻す。
4.左隣のプレイヤーが次のターンプレイヤーとなり、手元にあるアセットカードを受け取り、ターンを実行する。

### 2-2.ターンプレイヤー以外のプレイヤー
1. 手元にあるアセットカードから１枚選んで、自分の前に裏向きで出す。残ったアセットカードは自分の左隣のプレイヤー前に裏側のまま置く。
2. 自分の前に置いてある選んだアセットカードを購入する。購入できない/しないカード、購入が完了したカードは裏側にして捨て札にする。イベントカードの効果がある場合はその通り実行する。
3. 手元にあるウォレットで、自由にアセットを出品したり、購入できる。
4. 手元にあるアセットカードを受け取り、ターンを実行する。

## 3.ゲームの終了
手元のアセットカードが０になったらもう一度プレイヤーの人数x２枚を配り、それを使い切った時点でゲーム終了。コインを一番多く持っているプレイヤーの勝利となります。
