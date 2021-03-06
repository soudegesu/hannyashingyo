'use strinct';

document.onkeydown = typeGame;

//キーコードを格納する配列
var kcode = new Array(65,66,67,68,69,70,71,72,73,
                      74,75,76,77,78,79,80,81,82,
                      83,84,85,86,87,88,89,90);

//グローバル変数群
var cnt = 0;
var started = false;
var typStart, typEnd;
var flattenKana = [];
var input = [];

// 文字列の入力受付パターンを生成します
function createPattern(kana) {
        
    var list = [];
    for (k in Jadata) {
      // 一致したら文字を取り出して、残りの文字の候補を探す
      if (kana.indexOf(k) === 0) {
          var value = Jadata[k];
          var nokori = kana.substring(k.length);
          if (!nokori) {
            return value;
          }
          var arr = createPattern(nokori);
          value.forEach(function(v){
            arr.forEach(function(a){
              list.push(v + a);
            })
          });
      }
    }
    return list;
}

//タイピングゲームの問題をセットする関数
function gameSet() {
    //カウント数をクリアする
    cnt = 0;
    started = false;
    flattenKana = [];
    var idnum = 0;

    initStart();
    //問題文をテーブルを使って表示。各セルはID名「word＋数字」を付す
    var doc = document.createDocumentFragment();
    var table = document.createElement("table");
    table.className = "Q";
    constant.hannhashingyo.forEach(function(val){
        var tr = document.createElement("tr");
        // 許容する入力パターンの作成
        val[0].forEach(function(v){
          if(v) {
            flattenKana.push(createPattern(v));
          }
        });
        // Elementを作成する
        val[1].forEach(function(kanji){
            var td = document.createElement("td");
            td.id = "word" + idnum;
            td.innerText = kanji;
            tr.appendChild(td);
            idnum++;
        }); 

        table.appendChild(tr);
    });
    
    doc.appendChild(table);
    
    var container = document.getElementById("container");
    container.textContent = null;
    container.appendChild(doc);
    
}

// 初期化して開始します
function initStart() {
  document.getElementById("title").style.display = "none";
  document.getElementById("finish").style.display = "none";
  document.getElementById("btn").innerHTML = "やり直す";
}

//キー入力を受け取る関数
function typeGame(evt) {
  
  var kc = getKeyCode(evt);
  
  if (kcode.indexOf(kc) > -1) {

    // 開始とする
    if (!started) { 
      typStart = new Date();
      started = true;
    }

    // 入力をチェックする
    checkAnswer(kc);
    
    // 入力がすべて終了した場合、時計を止める
    if(cnt === flattenKana.length) {
      typEnd = new Date();
      var keika = typEnd - typStart;
      var sec = Math.floor(keika/1000);
      document.getElementById("container").innerHTML = "";
      document.getElementById("sec").innerHTML = sec;
      document.getElementById("finish").style.display = "block";
    }
  }
}

// 押されたキーのコードを取得
function getKeyCode(evt) {  
  if (document.all) {
    return event.keyCode;
  } else {
    return evt.which;
  }
}

// 入力内容との一致をチェック
function checkAnswer(kc) {

    var idName = "word" + cnt;
    var ch = String.fromCharCode(kc).toLowerCase();
    // 過去分の入力文字列を作る
    var past = "";
    input.forEach(function(v){
      past += v;
    });
    var now = flattenKana[cnt];
    var nowInput = past + ch;
    
    var unmatchCnt = 0;
    var partialMatchCnt = 0;
    now.forEach(function(text){
      // 完全一致したらOK
      if(text === nowInput) {
        document.getElementById(idName).style.color = "#dddddd";
        // 次の文字に行く
        input = [];
        cnt++;
        return;
      // 不一致になった場合は不正解
      } else if (text.indexOf(nowInput) < -1){
        unmatchCnt++;
      // 前方一致になった場合は入力を継続してよい
      } else if (text.indexOf(nowInput) === 0){
        partialMatchCnt++;
      }
    });

    if(partialMatchCnt) {
      input.push(ch);
      return;
    // すべてがアンマッチの場合
    } else if(unmatchCnt === now.length) {

    }

}