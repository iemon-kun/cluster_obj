const restTime = 1.0; // 休止時間
const distance = 3.0; // 送信先を検知する半径距離

// 初期化
$.onStart(() => {
  $.state.items = null; // メッセージを送るアイテムの空リスト
  $.state.i = 0; // インデックス初期値
  $.state.currentTime = 0; // 経過時間初期値
});

// リストが空の状態でインタラクトするとdistance距離内のアイテムを検知しリストに格納
$.onInteract((player) => {
  if ($.state.items == null)
    $.state.items = $.getItemsNear($.getPosition(), distance);
  $.log($.state.items);
});

/*
時間処理
リストに中身がある状態で経過時間がrestTime以上になったらリストの中身一つ(index0)に
メッセージを送信し、インデックス番号を1増加させて、経過時間をリセット。
リスト内すべてのアイテムにメッセージを送ったら、経過時間とインデックスとリストを初期化。
*/
$.onUpdate((deltaTime) => {
  if ($.state.items != null) {
    $.state.currentTime += deltaTime;
    // $.log($.state.currentTime);
    if ($.state.currentTime >= restTime && $.state.i < $.state.items.length) {
      $.state.items[$.state.i].send("messageType", "arg");
      $.log(`${$.state.items[$.state.i]}${$.state.i}にメッセージを送りました`);
      $.state.i++;
      $.state.currentTime = 0;
    }
    if ($.state.i >= $.state.items.length) {
      $.state.i = 0;
      $.state.currentTime = 0;
      $.state.items = null;
      $.log("メッセージの送信が終了しました");
    }
  }
});
