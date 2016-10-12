'use strinct';

document.onkeydown = typeGame;

//キーコードを格納する配列
var kcode = new Array(65,66,67,68,69,70,71,72,73,
                      74,75,76,77,78,79,80,81,82,
                      83,84,85,86,87,88,89,90);

//グローバル変数群
var cnt = 0;             //何問目か格納
var typStart, typEnd;   //開始時と終了時の時刻を格納

//タイピングゲームの問題をセットする関数
function gameSet() {
    //カウント数をクリアする
    cnt = 0;
    var idnum = 0;
    //問題文をテーブルを使って表示。各セルはID名「word＋数字」を付す
    var doc = document.createDocumentFragment();
    var table = document.createElement("table");
    table.className = "Q";
    constant.hannhashingyo.forEach(function(val){
        var tr = document.createElement("tr");
        
        val[1].forEach(function(kanji){
            console.log(kanji);
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

//キー入力を受け取る関数
function typeGame(evt) {
  var kc;  //入力されたキーコードを格納する変数
  
  //入力されたキーのキーコードを取得
  if (document.all)
  {
    kc = event.keyCode;
  }
  else
  {
    kc = evt.which;
  }
  //入力されたキーコードと、問題文のキーコードを比較
  if (kc == kcode[ "" ])
  {
    //以下、キーコードが一致した時の処理
    //最初の1文字が入力された時間を記録する
    if (cnt==0)
    { 
      typStart = new Date();
    }
    
    //入力されたセルの文字色を灰色にする
    var idName = "word"+cnt;
    document.getElementById(idName).style.color="#dddddd";

    cnt++; //カウント数を＋１にする
    
    //全文字入力したか確認
    if ( cnt == 200)
    {
      //全文字入力していたら、終了時間を記録する
      typEnd = new Date();
      
      //終了時間－開始時間で掛かったミリ秒を取得する
      var keika = typEnd - typStart;
      
      //1000で割って「切捨て」、秒数を取得
      var sec = Math.floor( keika/1000 );
      
      //1000で割った「余り(%で取得できる）」でミリ秒を取得
      var msec = keika % 1000;
      
      //問題終了を告げる文字列を作成
      var fin="GAME終了"
      
      //問題枠にゲーム終了を表示
      document.getElementById("waku").innerHTML = fin;
    }
  }
}