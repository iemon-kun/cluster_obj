/* 
【アイテム構造】※このコードにおいてはあまり関係ない
GameObject
┗ Cube
*/

// 定数などの設定
const delay = 0.3; // クリックの種類を判定するための間隔の設定（秒）

// 初期化処理
const initialize = () => {
    $.state.initialized = true;
    $.state.clickCount = 0;
    $.state.elapsedTime = 0;
}

//インタラクト時の処理
$.onInteract(() => {
    $.state.clickCount++;
});

// 時間処理
$.onUpdate(deltaTime => {
    if(!$.state.initialized) initialize(); // 初期化されていなければ初期化

    if ($.state.clickCount > 0) {   
        $.state.elapsedTime += deltaTime;
        if ($.state.elapsedTime >= delay) {
            if ($.state.clickCount === 1) {
                // シングルクリックがされたときの処理を書く
                $.log("シングルクリックされました。");
            } else if($.state.clickCount === 2){
                // シングルクリックがされたときの処理を書く
                $.log("ダブルクリックされました。");
            } else {
                // 想定回数以上のクリックがあった場合の処理を書く
                $.log("登録のない操作です。");
            }
            $.state.clickCount = 0;
            $.state.elapsedTime = 0;
        }
    }
});
