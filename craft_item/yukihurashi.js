// 子オブジェクトを取得
const snowObj = $.subNode("snow");
const snow = []; 
for (let i = 1; i <= 30; i++) {
  let num = i.toString().padStart(3, "0");
  snow.push($.subNode(`snow_${num}`));
}

// 定数などの設定
const snowVec = new Vector3(0,-1,0);
const snowRespown = 0;

//インタラクト時の処理
$.onInteract(() => {
    $.state.snowfall =!$.state.snowfall;
    snowObj.setEnabled($.state.snowfall);
});

//時間処理
$.onUpdate(deltaTime => {
  if(!$.state.initialized){
    $.state.snowfall ??= false;
    snowObj.setEnabled($.state.snowfall);
  }

  if($.state.snowfall){
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
  }
});
