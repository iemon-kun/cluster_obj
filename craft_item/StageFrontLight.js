// 子オブジェクトを取得
const rootObj = $.subNode("Lightroot");
const blueObj = $.subNode("Blue");
const redObj= $.subNode("Red");
const greenObj = $.subNode("Green");

// 定数などの設定
let count = $.state.count;
if(count == null) count = 0;

//インタラクト時の処理
$.onInteract(() => {
  count += 1;

  let rootOnOff = $.state.rootOnOff;
  if(rootOnOff == null) rootOnOff = rootObj.getEnabled();

  let blueOnOff = $.state.blueOnOff;
  if(blueOnOff == null) blueOnOff = blueObj.getEnabled();

  let redOnOff = $.state.redOnOff;
  if(redOnOff == null) redOnOff = redObj.getEnabled();

  let greenOnOff = $.state.greenOnOff;
  if(greenOnOff == null) greenOnOff = greenObj.getEnabled();


  if(count == 0 || count >= 4){
    rootObj.setEnabled(false);
    $.state.rootOnOff = false;

    blueObj.setEnabled(false);
    $.state.blueOnOff = false;
    redObj.setEnabled(false);
    $.state.redOnOff = false;
    greenObj.setEnabled(false);
    $.state.greenOnOff = false;

    count = 0
  }else if(count == 1){
    rootObj.setEnabled(true);
    $.state.rootOnOff = true;

    blueObj.setEnabled(true);
    $.state.blueOnOff = true;
    redObj.setEnabled(false);
    $.state.redOnOff = false;
    greenObj.setEnabled(false);
    $.state.greenOnOff = false;
  }else if(count == 2){
    rootObj.setEnabled(true);
    $.state.rootOnOff = true;

    blueObj.setEnabled(false);
    $.state.blueOnOff = false;
    redObj.setEnabled(true);
    $.state.redOnOff = true;
    greenObj.setEnabled(false);
    $.state.greenOnOff = false;
  }else if(count == 3){
    rootObj.setEnabled(true);
    $.state.rootOnOff = true;
 
    blueObj.setEnabled(false);
    $.state.blueOnOff = false;
    redObj.setEnabled(false);
    $.state.redOnOff = false;
    greenObj.setEnabled(true);
    $.state.greenOnOff = true;
  }
});
