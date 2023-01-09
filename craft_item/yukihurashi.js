// 子オブジェクトのsnowを取得
const snowObj = $.subNode("snow");

//配列snowに子オブジェクトを格納
const snow = []; 
for (let i = 1; i <= 30; i++) {
  let num = i.toString().padStart(3, "0");
  snow.push($.subNode(`snow_${num}`));
}

//インタラクト時の処理
$.onInteract(() => {
    let onoff = $.state.onoff;
    if(onoff == null) onoff = snowObj.getEnabled(); // 初期化されていなければ、現在のアクティブ状態で初期化
 
    onoff = !onoff; // onoffの値がtrueならfalseに、falseならtrueに変える
    snowObj.setEnabled(onoff); // snow_objのアクティブ状態を設定（onoffがtrueなら表示、falseなら非表示になる）
    $.state.onoff = onoff; // onoffの値を保存
});

//位置計算用の設定
const snowVec = new Vector3(0,-1,0);
const snowRespown = 0;

//雪の粒表示時の処理
$.onUpdate(deltaTime => {
    snow.forEach(function(element) {
        let pos = element.getPosition(); //要素の座標取得
        let randspeed = 1 - Math.random()/10; //ランダム要素のある下降スピード生成
        if(pos.y < snowRespown) {
            var randx = -Math.random()*11; //ランダム要素付きの座標生成
            var randy = Math.random()*2 + 8;
            var randz = Math.random()*11;     
            element.setPosition(new Vector3(randx,randy,randz)); //雪の粒を初期位置に
        } else {
        element.setPosition(pos.add(snowVec.clone().multiplyScalar(deltaTime*randspeed))); // 下降
        }
      });
});