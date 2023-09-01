// NPC Uploaded ver1.0
/* 【アイテム構造】
NPCTake
┣Root
┃　┗Body
┃　　　┣Eyes
┃　　　┃　┣Eye_L
┃　　　┃　┗Eye_R
┃　　　┣Blink
┃　　　┃　┣Blink_L
┃　　　┃　┗Blink_R
┃　　　┣LArm
┃　　　┃　┗LHand
┃　　　┣RArm
┃　　　┃　┗RHand
┃　　　┣LFoot
┃　　　┗RFoot
┗Greeting
　┣Morning
　┣Hi
　┗Evening

*/
// 子オブジェクトを取得
const root = $.subNode("Root");
const body = $.subNode("Body");
const eyes = $.subNode("Eyes");
const eyeL = $.subNode("Eye_L");
const eyeR = $.subNode("Eye_R");
const blink = $.subNode("Blink");
const blinkL = $.subNode("Blink_L");
const blinkR = $.subNode("Blink_R");
const armL = $.subNode("LArm");
const handL = $.subNode("LHand");
const armR = $.subNode("RArm");
const handR = $.subNode("RHand");
const footL = $.subNode("LFoot");
const footR = $.subNode("RFoot");
const greeting = $.subNode("Greeting");
const morning = $.subNode("Morning");
const hi = $.subNode("Hi");
const evening = $.subNode("Evening");
const se = $.audio("Audio1");


// 定数などの設定
const actions = ["rest", "sleep", "greet", "move", "rotate"];
let currentTime = 0;
//let elapsedTime = 0;
let greetingTime = 0;
let desire = 0;
const axes =[
  new Vector3(1.0, 0.0, 0.0).normalize(),
  new Vector3(0.0, 1.0, 0.0).normalize(),
  new Vector3(0.0, 0.0, 1.0).normalize()
];
const vecZ = new Vector3(0.0, 0.0, 0.005);// 進行時の加算
$.state.startPos ??= $.getPosition(); // 初期位置座標
const centerX = $.state.startPos.x;  // 中心の x 座標
const centerZ = $.state.startPos.z;  // 中心の z 座標
const radius = 1.25;  // 円の半径


let wakeUpCount = 0;
let wakeUp = Math.floor(Math.random() * 11); // 0~10のランダムな値を生成
const greetFinishTime = 3.0;
let now = new Date();
let h = now.getHours();
let startTime = h;

let isBlinking = false;
const speed = 144.0;
let rotationTime = 0;
let rotationLimit = 0.3;


// 関数の設定
function setInit(){
  root.setPosition($.state.rootPivot);
  body.setPosition($.state.bodyPivot);
  armL.setRotation($.state.armLPivot);
  armR.setRotation($.state.armRPivot);
  footL.setRotation($.state.footLPivotRot);
  footR.setRotation($.state.footLPivotRot);
  elapsedBodyAnimeTime = 0;
  elapsedRootAnimeTime = 0;
  if($.state.status == actions[1]){
    blink.setEnabled(true);
    eyes.setEnabled(false);
  }else{
    blink.setEnabled(false);
    eyes.setEnabled(true);
  }
}

let blinkingTime = 0;
function blinking(minBlinkInterval = 2.0, maxBlinkInterval = 10.0, doubleBlinkInterval = 0.3, minBlinkingTime = 0.1, maxBlinkingTime = 0.3){
  $.state.blinkThreshold ??= 2.0; // 瞬き間隔の閾値（秒）
  if (blinkingTime >= $.state.blinkThreshold) {
    isBlinking = !isBlinking;
    blinkingTime = 0;

    // blinkとeyesの表示を切り替え
    blink.setEnabled(isBlinking);
    eyes.setEnabled(!isBlinking);

    // 次の瞬きまでの間隔をランダムに設定
    if(!isBlinking){
      let rand = Math.floor(Math.random() * 5); // 0~4のランダムな値を生成
      if(rand == 0){
        $.state.blinkThreshold = doubleBlinkInterval;
      }else{
        let nextBlinkInterval = Math.random() * (maxBlinkInterval - minBlinkInterval) + minBlinkInterval;
        $.state.blinkThreshold = nextBlinkInterval;
      }
    }else{
      $.state.blinkThreshold = Math.random() * (maxBlinkingTime - minBlinkingTime);
    }
  }
}

let elapsedBodyAnimeTime = 0;
function bodyAction(bodyAnimeTime = 3.0, range = 0.003){
  const nowBodyAnimeTime = elapsedBodyAnimeTime / bodyAnimeTime; // 1周の進行度（0〜1）
  const newY = Math.sin(nowBodyAnimeTime * Math.PI * 2) * range; // 1周分のsin波を生成
  body.setPosition($.state.bodyPivot.clone().add(axes[1].clone().multiplyScalar(newY).applyQuaternion(body.getRotation())));
}

let elapsedArmAnimeTime = 0;
function armAction(armAnimeTime = 1.5, minLRot = -30, maxLRot = -40, minRRot = 30, maxRRot = 40){
  let nowArmAnimeTime = elapsedArmAnimeTime / armAnimeTime;
  let minR = $.state.armRPivot.clone().setFromAxisAngle(axes[2], $.state.isOpen ? minRRot : maxRRot);
  let maxR = $.state.armRPivot.clone().setFromAxisAngle(axes[2], !$.state.isOpen ? minRRot : maxRRot);
  let minL = $.state.armLPivot.clone().setFromAxisAngle(axes[2], $.state.isOpen ? minLRot : maxLRot);
  let maxL = $.state.armLPivot.clone().setFromAxisAngle(axes[2], !$.state.isOpen ? minLRot : maxLRot);
  armR.setRotation(minR.clone().slerp(maxR, nowArmAnimeTime));
  armL.setRotation(minL.clone().slerp(maxL, nowArmAnimeTime));
  if(nowArmAnimeTime >= 1){
    $.state.isOpen = !$.state.isOpen;
    elapsedArmAnimeTime = 0;
  }
}

let elapsedRootAnimeTime = 0;
function rootAction(RootAnimeTime = 0.5, range = 0.005){
  const nowRootAnimeTime = elapsedRootAnimeTime / RootAnimeTime; // 1周の進行度（0〜1）
  const newY = Math.sin(nowRootAnimeTime * Math.PI * 2) * range; // 1周分のsin波を生成
  root.setPosition($.state.rootPivot.clone().add(axes[1].clone().multiplyScalar(newY).applyQuaternion(root.getRotation())));
}

let elapsedFootAnimeTime = 0;
function footAction(footAnimeTime = 0.5, minLRot = -35, maxLRot = 20, minRRot = -35, maxRRot = 20){
  let nowFootAnimeTime = elapsedFootAnimeTime / footAnimeTime;
  let minR = $.state.footRPivotRot.clone().setFromAxisAngle(axes[0], $.state.isOpen ? minRRot : maxRRot);
  let maxR = $.state.footRPivotRot.clone().setFromAxisAngle(axes[0], !$.state.isOpen ? minRRot : maxRRot);
  let minL = $.state.footLPivotRot.clone().setFromAxisAngle(axes[0], $.state.isOpen ? maxLRot : minLRot);
  let maxL = $.state.footLPivotRot.clone().setFromAxisAngle(axes[0], !$.state.isOpen ? maxLRot : minLRot);
  footR.setRotation(minR.clone().slerp(maxR, nowFootAnimeTime));
  footL.setRotation(minL.clone().slerp(maxL, nowFootAnimeTime));
  if(nowFootAnimeTime >= 1){
    $.state.isOpen = !$.state.isOpen;
    elapsedFootAnimeTime = 0;
  }
}

function greetingMessage(){
  now = new Date();
  h = now.getHours();
  se.play();
  if(h >= 6 && h < 11){
    morning.setEnabled(true);
    $.state.sleepy =false;
  }else if(h >= 11 && h < 18){
    hi.setEnabled(true);
    $.state.sleepy =false;
  }else if(h >= 18){
    evening.setEnabled(true);
    $.state.sleepy =false;
  }else {
    evening.setEnabled(true);
    $.state.sleepy = true;
  };
}



//初期化
const initialize = () => {
  $.state.inisialized = true;
  $.state.startPos = $.getPosition();
  $.state.startRot = $.getRotation();
  $.state.nowPos ??= $.getPosition();
  $.state.nowRot ??= $.getRotation();
  $.state.rootPivot = root.getPosition();
  $.state.bodyPivot = body.getPosition();
  $.state.armRPivot = armR.getRotation();
  $.state.armLPivot = armL.getRotation();
  $.state.footRPivotPos = footR.getPosition();
  $.state.footLPivotPos = footL.getPosition();
  $.state.footRPivotRot = footR.getRotation();
  $.state.footLPivotRot = footL.getRotation();
  now = new Date();
  h = now.getHours();
  startTime = h;
  if(startTime <= 5){
    $.state.status = actions[1];
    $.state.sleepy = true;
    blink.setEnabled(true);
    eyes.setEnabled(false);
  }else{
    $.state.status = actions[0];
    $.state.sleepy = false;
    blink.setEnabled(false);
    eyes.setEnabled(true);
  }
  $.state.isOpen = false;
  $.log(`起きるまでのカウント${wakeUp}`);
  $.log(h);
  $.log("生えました。");
}


// インタラクト時の処理
$.onInteract(() => {
  if($.state.status == actions[2]){
    $.state.status = actions[0];
    morning.setEnabled(false);
    hi.setEnabled(false);
    evening.setEnabled(false);
    greetingTime = 0;
  }else if($.state.status == actions[1]){
    wakeUpCount ++;
      if(wakeUpCount > wakeUp){
        wakeUpCount = 0;
        wakeUp = Math.floor(Math.random() * 11);
        $.state.status = actions[2];
        greetingMessage();
        $.log(`次起こすときのインタラクト回数${wakeUp}`);
      }
  }else{
    $.state.status = actions[2];
    greetingMessage();
  }
  setInit();
})


// 時間処理
$.onUpdate(deltaTime => {
  if(!$.state.inisialized) initialize();
  // $.log($.state.status);
  currentTime += deltaTime;

  switch ($.state.status) {
    case actions[0]:
      blinkingTime += deltaTime;
      blinking();
      elapsedArmAnimeTime += deltaTime;
      armAction();
      elapsedBodyAnimeTime += deltaTime;
      bodyAction();

      if(desire < 100){
        desire += (Math.floor(Math.random() * 6.5))*0.1;
      }else if($.state.sleepy || h < 6){
        desire = 0;
        $.state.sleepy = true;
        $.state.status = actions[1];
        setInit();
      }else{
        desire = 0;
        now = new Date();
        h = now.getHours();
        $.state.status = actions[3];
        setInit();
      }
      break;
    case actions[1]:
      elapsedArmAnimeTime += deltaTime;
      armAction(2.0, -30, -35, 30, 35);
      bodyAction(4);
      if(desire < 100){
        desire += (Math.floor(Math.random() * 6.5))*0.1;
      }else if(h >= 6){
        desire = 0;
        $.state.sleepy = false;
        $.state.status = actions[0];
        setInit();
      }else{
        desire = 0;
        now = new Date();
        h = now.getHours();
      }
      break;
    case actions[2]:
      blinkingTime += deltaTime;
      blinking();
      greetingTime += deltaTime;

      elapsedArmAnimeTime += deltaTime;
      armAction(0.15 + Math.random() * 0.05, -30, -120, 30, 120);
      bodyAction();

      if(greetingTime >= greetFinishTime){
        $.state.status = actions[0];
        morning.setEnabled(false);
        hi.setEnabled(false);
        evening.setEnabled(false);
        greetingTime = 0;
        setInit();
      }
      break;
    case actions[3]:
      blinkingTime += deltaTime;
      blinking();
      elapsedRootAnimeTime += deltaTime;
      rootAction();
      elapsedFootAnimeTime += deltaTime;
      footAction();
      
      if(desire < 100){
        desire += (Math.floor(Math.random() * 6.5))*0.1;
      }else{
        desire = 0;
        $.state.status = actions[0];
        setInit();
      }
      $.setPosition($.getPosition().add(vecZ.clone().applyQuaternion($.getRotation())));
      const distanceToCenter = Math.sqrt(Math.pow($.getPosition().x - centerX, 2) + Math.pow($.getPosition().z - centerZ, 2));
      if (distanceToCenter >= radius) {
        rotationLimit = 0.3 + Math.random() * 0.6;
        $.state.status = actions[4];
      }
      break;
    case actions[4]:
      blinkingTime += deltaTime;
      blinking();
      elapsedRootAnimeTime += deltaTime;
      rootAction();
      elapsedFootAnimeTime += deltaTime;
      footAction();
      rotationTime += deltaTime;
      $.setRotation($.getRotation().multiply(new Quaternion().setFromAxisAngle(axes[1], speed * deltaTime)));
      if(rotationTime >= rotationLimit){
        rotationTime = 0;
        $.state.nowRot = $.getRotation();
        $.state.status = actions[3];
      }
      break;
    default:
      $.log("想定外の状態です。");
  }
});