// 子オブジェクトを取得
const allObj = $.subNode("All");
const BeamOnObj = $.subNode("BeamOn");
const beamsObj = $.subNode("Beams");
const beamLObj= $.subNode("BeamL");
const beamRObj = $.subNode("BeamR");

// 定数などの設定
const speed = 36.0;
const axis = new Vector3(0.0, 0.0, 1.0);

// インタラクト時の処理
$.onInteract(() => {
  $.state.enabled = !$.state.enabled;
  BeamOnObj.setEnabled($.state.enabled);
})

// 時間処理
$.onUpdate(deltaTime => {
  // 初期化
  if (!$.state.initialized) {
    $.state.initialized = true;
    $.state.enabled = BeamOnObj.getEnabled();
  }

  // スイッチオンの状態のとき、ビームを回転させる
  if ($.state.enabled){
    $.state.time += deltaTime;
    beamLObj.setRotation(beamLObj.getRotation().multiply(new Quaternion().setFromAxisAngle(axis, speed * deltaTime)));
    beamRObj.setRotation(beamRObj.getRotation().multiply(new Quaternion().setFromAxisAngle(axis, speed * deltaTime)));
    }
});