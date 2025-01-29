//dom要素取得
var editorDiv = document.getElementById('editorDiv');
var taskWindow = document.getElementById('taskWindow');
var addPageButton = document.getElementById('addPageButton');
var taskWindow = document.getElementById('taskWindow');
var designWindow = document.getElementById("designWindow");
var widthRange = document.getElementById("widthRange");
var heightRange = document.getElementById("heightRange");
var fontSizeRange = document.getElementById("fontSizeRange");
var generateWindow = document.getElementById("generateWindow");
var helpWindow = document.getElementById("helpWindow");
var Ubutton = document.getElementById("Ubutton");
var Bbutton = document.getElementById("Bbutton");
var menuSelect = document.getElementById("menuSelect");

var mainData = [];




//ctrl　＋　クリックでテキスト追加
editorDiv.addEventListener('click',function(event){

    if(!event.ctrlKey)return;

    //入力用のテキストエリアを作成
    const element = document.createElement('textarea');
    element.id = randomID();
    element.classList.add('forText');
    element.classList.add('absolute');
    element.classList.add('genTarget');
    element.classList.add('getText');
    element.style.left = mouseX + "px";
    element.style.top = mouseY + "px";
    element.placeholder="テキストを追加";
    element.autocomplete="off";
    element.spellcheck="off";
    element.style.zIndex=15;
    mouseDrag(element);
    editorDiv.appendChild(element);
    element.focus();

    //データを蓄積
    mainData[element.id]={
        id: element.id,
        type: "text",
        deleted: false
    };

    // //削除ボタン作成
    // const button  = document.createElement('button');
    // button.textContent="✘";
    // element.appendChild(button);

    //右クリックで削除（仮）
    element.addEventListener("contextmenu", function(event){
        event.preventDefault();
        element.remove();
    });

    //不使用なら削除
    element.addEventListener('blur', function(event){
        //ロストフォーカス時に空文字or改行のみなら削除
        if(unUsed(element.value)){
            element.remove();
        }
    });

    currentElement=element;

    //スライダー表示
    fontSizeRange.disabled=false;
    heightRange.disabled=false;

    //スライダー更新
    widthRange.value = deletePx(window.getComputedStyle(element).width);
    fontSizeRange.value = deletePx(window.getComputedStyle(element).fontSize);
    heightRange.value = deletePx(window.getComputedStyle(element).height);

    //操作中の要素を判別
    element.addEventListener("click", function(event){
        currentElement=element;
        //スライダー表示
        fontSizeRange.disabled=false;
        heightRange.disabled=false;
        //スライダー更新
        widthRange.value = deletePx(window.getComputedStyle(element).width);
        fontSizeRange.value = deletePx(window.getComputedStyle(element).fontSize);
        heightRange.value = deletePx(window.getComputedStyle(element).height);
    })

    // //入力内容に合わせて枠サイズを調整
    // element.addEventListener('input', function(event){
    //     resize(element);
    // })

});


//ページを追加
var pageCount = 1;
function addPage(){
    //divを生成
    var element = document.createElement('div');
    element.id = "page"+(pageCount+1);
    element.classList.add("page");
    element.style.left="0%";
    element.style.left="0%";
        var pageHeight = window.getComputedStyle(document.getElementById("page"+pageCount)).height; //ページの高さを取得
        pageHeight = parseFloat(pageHeight.substring(0,pageHeight.length-2));
    element.style.top= pageHeight * pageCount + "px";
    // alert(pageHeight * pageCount + "px")
    editorDiv.appendChild(element);

    //ページ数表示
    var pageLabel = document.createElement('label');
    pageLabel.classList.add('pageNum');
    pageLabel.textContent = pageCount + 1;
    element.appendChild(pageLabel);

    //ページカウンタをインクリメント
    pageCount ++;
}

// スライダーイベント
var currentElement;//操作中の要素を判別
function addSliderEvent(range){
    range.addEventListener('input',function(event){
        switch(range){
            case widthRange:{
                currentElement.style.width=range.value + "px"
                heightRange.value=deletePx(window.getComputedStyle(currentElement).height);
                break;
            }
            case heightRange:{
                currentElement.style.height=range.value + "px";
                break;
            }
            case fontSizeRange:{
                heightRange.value=deletePx(window.getComputedStyle(currentElement).height);
                widthRange.value=deletePx(window.getComputedStyle(currentElement).width);
                currentElement.style.fontSize=range.value + "px";
                break;
            }
        }
    })
};

//画像ドロップイベント
editorDiv.addEventListener('drop', function(event){
    event.preventDefault();
    const files = event.dataTransfer.files; // ファイルを取得
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
  
        reader.onload = function(e) {
            const img = document.createElement('img'); //img要素作成
            img.src = e.target.result;
            img.style.maxWidth = '80%';
            img.style.height = 'auto';
            img.style.left = mouseX + "px";
            img.style.top = mouseY + "px";
            img.style.position="absolute";
            img.style.zIndex=15;
            img.id=randomID();
            img.classList.add('genTarget');
            img.classList.add('genImg');
            mouseDrag(img);
            editorDiv.appendChild(img);

            //データを蓄積
            mainData[img.id]={
                id: img.id,
                type: "img",
                deleted: false
            };

            currentElement=img;

            //スライダー表示
            fontSizeRange.disabled=true;
            heightRange.disabled=true;

            //スライダー更新
            widthRange.value = deletePx(window.getComputedStyle(img).width);
            heightRange.value = deletePx(window.getComputedStyle(img).height);

            //操作中の要素を判別
            img.addEventListener("click", function(event){
                currentElement=img;
                //スライダー更新
                widthRange.value = deletePx(window.getComputedStyle(img).width);
                heightRange.value = deletePx(window.getComputedStyle(img).height);

                //スライダー非活性
                fontSizeRange.disabled=true;
                heightRange.disabled=true;
            })
        };
  
        reader.readAsDataURL(file); // ファイルをDataURLとして読み込む
      } else {
        alert('画像ファイルのみドロップできます');
      }
    }
});

// ペーストイベント
editorDiv.addEventListener('paste', function(event){
    const clipboardItems = event.clipboardData.items; // クリップボードのアイテムを取得
    for (let i = 0; i < clipboardItems.length; i++) {
        const item = clipboardItems[i];
        if (item.type.startsWith('image/')) {
            const file = item.getAsFile(); // クリップボードから画像ファイルを取得
            const reader = new FileReader();

            reader.onload = function(e) {
                const img = document.createElement('img'); // img要素を作成
                img.src = e.target.result;
                // img.style.maxWidth = '80%';
                img.style.height = 'auto';
                img.style.left = mouseX + "px";
                img.style.top = mouseY + "px";
                img.style.position = "absolute";
                img.style.zIndex=15;
                img.classList.add('genTarget');
                img.classList.add('genImg');
                img.id=randomID();
                mouseDrag(img);
                editorDiv.appendChild(img);

                //データを蓄積
                mainData[img.id]={
                    id: img.id,
                    type: "img",
                    deleted: false
                };

                currentElement = img;

                // スライダー表示
                fontSizeRange.disabled = true;
                heightRange.disabled = true;

                // スライダー更新
                widthRange.value = deletePx(window.getComputedStyle(img).width);
                heightRange.value = deletePx(window.getComputedStyle(img).height);

                // 操作中の要素を判別
                img.addEventListener("click", function(event){
                    currentElement = img;
                    // スライダー更新
                    widthRange.value = deletePx(window.getComputedStyle(img).width);
                    heightRange.value = deletePx(window.getComputedStyle(img).height);

                    // スライダー非活性
                    fontSizeRange.disabled = true;
                    heightRange.disabled = true;
                });
            };

            reader.readAsDataURL(file); // ファイルをDataURLとして読み込む
        } else {
            alert('画像ファイルのみペーストできます');
        }
    }
});



// ドラッグオーバー時の設定
editorDiv.addEventListener('dragover', function(event) {
    event.preventDefault(); // ドロップを許可するためにデフォルト動作を防ぐ
});


//スタイルボタン　イベント
function addButtonEvent(button){
    button.addEventListener("click", function(event){
        const style = window.getComputedStyle(currentElement);
        switch(button){
            case Ubutton:{
                if(style.textDecorationLine != "underline"){
                    currentElement.style.textDecoration = "underline";
                }else{
                    currentElement.style.textDecoration = "";
                }
                break;
            }
            case Bbutton:{
                if(style.fontWeight != 700){
                    currentElement.style.fontWeight = "bold";
                }else{
                    currentElement.style.fontWeight = "";
                }
                break;
            }
        }
    })
}

//メニューセレクト　イベント
menuSelect.addEventListener('input', function(event){
    switch(menuSelect.value){
        case "デザイン" :{
            designWindow.hidden=false;
            generateWindow.hidden=true;
            helpWindow.hidden=true;
            break;
        }
        case "生成" :{
            designWindow.hidden=true;
            generateWindow.hidden=false;
            helpWindow.hidden=true;
            break;
        }
        case "ヘルプ" :{
            designWindow.hidden=true;
            generateWindow.hidden=true;
            helpWindow.hidden=false;
            break;
        }
    }
})




// 共通関数**************************************************************************


// //テキストエリアへの入力状況に合わせてリサイズ
// function resize(element){

//     //フォントサイズを取得
//     var fontSize = window.getComputedStyle(element).fontSize;
//     fontSize = parseFloat(fontSize.substring(0,fontSize.length-2));

//     //行数を取得
//     var lineCount = element.value.split("\n").length;

//     //リサイズ（height）
//     element.style.height=lineCount * fontSize + "px";

//     // 最長の行の文字数を計算
//     const lines = element.value.split("\n");
//     const maxLineLength = Math.max(...lines.map(line => line.length));

//     // リサイズ（width）
//     element.style.width = (maxLineLength * fontSize) + "px";
// };


//マウスの座標を取得
var mouseX;
var mouseY;
document.addEventListener("mousemove", function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
});


//未使用のテキストエリアを判定（空文字 or　改行のみならtrueを返却）
function unUsed(target){

    //空文字
    if(target==""){
        return true;
    }

    //改行のみ
    var cnt = 0;
    var array = target.split("");
    for(var text of array){
        if(text == `
`){cnt ++;}}
    
    if(array.length == cnt){
        return true;
    }

    return false;
};


//７桁ID生成　重複ナシ
let idArray=[];
function randomID() {

    // 1000000 以上 9999999 以下の乱数を生成
    var id = Math.floor(1000000 + Math.random() * 9000000);

    if(idArray.join(",").indexOf(id,0) != -1){
        return randomID();
    }

    idArray.push(id);

    return id;
}


//マウスドラッグを可能にする関数
function mouseDrag(element) {
    element.onpointermove = function(event) {
        if (event.buttons && event.shiftKey) {
            this.style.left     = this.offsetLeft + event.movementX + 'px';
            this.style.top      = this.offsetTop  + event.movementY + 'px';
            this.style.position = 'absolute';
            if(element.id=="taskWindow")this.style.position = 'fixed';
            this.draggable      = false;
            this.setPointerCapture(event.pointerId);
            if(!element.id=="taskWindow")currentElement=element;
        }
    };
}

//pxを消し、数値で返す
function deletePx(target){
    return parseFloat(target.substring(0,target.length-2));
}


//出力するコード
var resultCode;


//レイアウトをもとにhtmlを生成
function generate(){

    resultCode = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .forText{
      background-color: transparent;
      color: black;
      outline: none;
      resize: none;
      border: none;
    }
    body{
      width: 100vw;
      height: ${911 * pageCount}px;
      style: "overflow-x: hidden;
    }
  </style>
</head>
<body>`
;

    //生成対象を配列に格納
    var targetArray = document.getElementsByClassName('genTarget');

    // heightの昇順に並べ替え
    targetArray.sort((a, b) => {
        return parseFloat(a.style.height) - parseFloat(b.style.height);
    });

    for(var element of targetArray){
        //分岐
        switch(element.classList.contains('genText')){
            case true:{//テキスト
                const style = window.getComputedStyle(currentElement);
                resultCode += ` <textarea class="forText" style="position: absolute; left: ${window.getComputedStyle(element).left}; top: ${window.getComputedStyle(element).top}; width: ${window.getComputedStyle(element).width}; height: ${window.getComputedStyle(element).height}; ${style.fontWeight == 700 ? "font-weight: bold; " : ""}${style.textDecorationLine == "underline" ? "text-decoration: underline;" : ""}">${element.value}</textarea>
`;
                break;
            }
            case false:{//画像
                const style = window.getComputedStyle(currentElement);
                resultCode += `<img src="${}" style="position: absolute; left: ${window.getComputedStyle(element).left}; top: ${window.getComputedStyle(element).top}; width: ${window.getComputedStyle(element).width}; height: ${window.getComputedStyle(element).height};">`;
                break;
            }
        }
    }

    resultCode += `</body>
</html>`;

};



// 読み込み後に実行*****************

//タスクウィンドウをドラッグ可能にする
mouseDrag(taskWindow);
addSliderEvent(widthRange);
addSliderEvent(heightRange);
addSliderEvent(fontSizeRange);
addButtonEvent(Bbutton);
addButtonEvent(Ubutton);