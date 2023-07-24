// 子オブジェクトを取得
const rootObj = $.subNode("Lightroot");
const blueObj = $.subNode("Blue");
const redObj = $.subNode("Red");
const greenObj = $.subNode("Green");

// 定数などの設定
let count = $.state.count || 0;

// オブジェクトと関数の設定
const objStateMap = [
  { obj: rootObj, stateKey: "rootOnOff" },
  { obj: blueObj, stateKey: "blueOnOff" },
  { obj: redObj, stateKey: "redOnOff" },
  { obj: greenObj, stateKey: "greenOnOff" },
];

function settingEnabled(obj, stateKey, enabled) {
  obj.setEnabled(enabled);
  $.state[stateKey] = enabled;
}

// インタラクト時の処理
$.onInteract(() => {
  count = (count + 1) % 5;

  if (count === 0 || count >= 4) {
    for (const { obj, stateKey } of objStateMap) {
      settingEnabled(obj, stateKey, false);
    }
  } else if (count === 1) {
    settingEnabled(rootObj, "rootOnOff", true);
    settingEnabled(blueObj, "blueOnOff", true);
    settingEnabled(redObj, "redOnOff", false);
    settingEnabled(greenObj, "greenOnOff", false);
  } else if (count === 2) {
    settingEnabled(rootObj, "rootOnOff", true);
    settingEnabled(blueObj, "blueOnOff", false);
    settingEnabled(redObj, "redOnOff", true);
    settingEnabled(greenObj, "greenOnOff", false);
  } else if (count === 3) {
    settingEnabled(rootObj, "rootOnOff", true);
    settingEnabled(blueObj, "blueOnOff", false);
    settingEnabled(redObj, "redOnOff", false);
    settingEnabled(greenObj, "greenOnOff", true);
  }
});
