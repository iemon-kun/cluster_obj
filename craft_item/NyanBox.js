// 子オブジェクトを取得
const objects = {
    goObj : $.subNode("Go"),
    backObj : $.subNode("Back"),
    rRotObj : $.subNode("RRot"),
    lRotObj : $.subNode("LRot"),
    upObj : $.subNode("Up"),
    downObj : $.subNode("Down")
};

// 定数などの設定
const vecY = new Vector3(0, 0.05, 0);
const vecZ = new Vector3(0, 0, 0.05);
const delay = 0.42; // クリックを判別するための間隔の設定（秒）
const speed = 36; // 回転スピード
const resetTime = 300; // リセットされる時間

// 関数設定
function setMovementMode(isGo, isBack, isRRot, isLRot, isUp, isDown) {
    objects.goObj.setEnabled(isGo);
    objects.backObj.setEnabled(isBack);
    objects.rRotObj.setEnabled(isRRot);
    objects.lRotObj.setEnabled(isLRot);
    objects.upObj.setEnabled(isUp);
    objects.downObj.setEnabled(isDown);
}

function handleClick() {
    $.state.isMove = !$.state.isMove;
    if($.state.isMove){
        $.log('作動します。');
    }else{
        $.log('停止します。');
    }
}

function handleWClick() {
    if (!$.state.isMove) {
        $.state.shaft = ($.state.shaft + 1) % 3;
        if ($.state.shaft === 0) {
            setMovementMode($.state.isGo, !$.state.isGo, false, false, false, false);
            $.log("前進・後退モードに切り替えました。");
        } else if ($.state.shaft === 1) {
            setMovementMode(false, false, $.state.isRot, !$.state.isRot, false, false);
            $.log("左右旋回モードに切り替えました。");
        } else if ($.state.shaft === 2) {
            setMovementMode(false, false, false, false, $.state.isUp, !$.state.isUp);
            $.log("上昇・下降モードに切り替えました。");
        }
    } else {
        $.log("停止してから切り替えてください。");
    }
}

function handleTripleClick(){
    if($.state.shaft === 0){
        $.state.isGo = !$.state.isGo;
        setMovementMode($.state.isGo, !$.state.isGo, false, false, false, false);
        if($.state.isGo){
            $.log("前進します。");
        }else{
            $.log("後退します。");
        }
    }else if($.state.shaft === 1){
        $.state.isRot = !$.state.isRot;
        setMovementMode(false, false, $.state.isRot, !$.state.isRot, false, false);
        if($.state.isRot){
            $.log("右に旋回します。");
        }else{
            $.log("左に旋回します。");
        }
    }else if ($.state.shaft === 2){
        $.state.isUp = !$.state.isUp;
        setMovementMode(false, false, false, false, $.state.isUp, !$.state.isUp);
        if($.state.isUp){
            $.log("上昇します。");
        }else{
            $.log("下降します。");
        }
    }
}

// 初期化処理
const initialize = () => {
    $.state.inisialized = true;
    $.state.startPos = $.getPosition();
    $.state.startRot = $.getRotation();
    $.state.lastClkTime = null;
    $.state.clickCount = 0;
    $.state.elapsedTime = 0;
    $.state.isMove = false;
    $.state.isGo = true;
    $.state.isRot = true;
    $.state.isUp = true;
    $.state.shaft = 0;
    setMovementMode($.state.isGo, !$.state.isGo, false, false, false, false);
    $.log(`【操作方法】\n・クリック：作動と停止の切り替え\n・ダブルクリック：停止中のみ。前進後退、旋回、上昇下降の３つのモード切り替え\n・トリプルクリック：現在の動作の方向を反転\n※最終操作から${resetTime/60}分間操作がないとリセットされます。`);
}

//インタラクト時の処理
$.onInteract(() => {
    $.state.clickCount++;
    $.state.lastClkTime = 0;
});

// 時間処理
$.onUpdate(deltaTime => {
    if(!$.state.inisialized) initialize();
    if ($.state.clickCount > 0) {   
        $.state.elapsedTime += deltaTime;
        //$.log(elapsedTime);
        if ($.state.elapsedTime >= delay) {
            if ($.state.clickCount === 1) {
                handleClick();
            } else if($.state.clickCount === 2){
                handleWClick();
            } else if($.state.clickCount === 3){
                handleTripleClick();
            } else{
                $.log("操作の登録がありません。");
            }
            $.state.clickCount = 0;
            $.state.elapsedTime = 0;
        }
    }
    
    if($.state.isMove){
        if($.state.shaft === 0){
            if($.state.isGo){
                $.setPosition($.getPosition().add(vecZ.clone().applyQuaternion($.getRotation())));
            }else{
                $.setPosition($.getPosition().sub(vecZ.clone().applyQuaternion($.getRotation())));
            }
        }else if($.state.shaft === 1){
            if($.state.isRot){
                $.setRotation($.getRotation().multiply(new Quaternion().setFromAxisAngle(vecY, speed * deltaTime)));
            }else{
                $.setRotation($.getRotation().multiply(new Quaternion().setFromAxisAngle(vecY, -speed * deltaTime)));
            }
        }else{
            if($.state.isUp){
                $.setPosition($.getPosition().add(vecY.clone()));
            }else{
                $.setPosition($.getPosition().sub(vecY.clone()));
            }
        }
    }

    if($.state.lastClkTime != null){
        $.state.lastClkTime += deltaTime;
        // $.log($.state.lastClkTime);
        // $.log($.getPosition().y);
        if($.state.lastClkTime > resetTime){
            $.setPosition($.state.startPos);
            $.setRotation($.state.startRot);
            initialize();
            $.log(`${resetTime / 60}分間操作がなかったためリセットしました。`);
        }
        if($.getPosition().y <= -1.9){
            $.setPosition($.state.startPos);
            $.setRotation($.state.startRot);
            initialize();
            $.log(`有効範囲外に移動したためリセットしました。`);
        }
    }
});