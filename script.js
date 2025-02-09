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
var deleteBtn = document.getElementById("deleteBtn");
var modal = document.getElementById("modal");
var dlModal = document.getElementById("dlModal");
var DLContent = document.getElementById("DLContent");
var fileNameTextbox = document.getElementById("fileNameTextbox");
var htmlPreviewModal = document.getElementById("htmlPreviewModal");
var codeContent = document.getElementById("codeContent");
var htmlCodeViewer = document.getElementById("htmlCodeViewer");
var widthInput = document.getElementById("widthInput");
var heightInput = document.getElementById("heightInput");
var FSInput = document.getElementById("FSInput");

var mainData = [];




//ctrl　＋　クリックでテキスト追加
editorDiv.addEventListener('click',function(event){

    if(!event.ctrlKey)return;

    createText(false);

});

function createText(isReConstruct, top_, left_, width_, height_, fontSize_, bold_, underline_, value_){
    //入力用のテキストエリアを作成
    const element = document.createElement('textarea');
    element.id = randomID();
    element.classList.add('forText');
    element.classList.add('absolute');
    element.classList.add('genTarget');
    element.classList.add('genText');
    element.style.left = mouseX + "px";
    element.style.top = mouseY + "px";
    if (isReConstruct) { // 再構築
        element.style.left = left_;
        element.style.top = top_;
        element.style.width = width_;
        element.style.height = height_;
        element.style.fontSize = fontSize_;
        element.value = value_;
      
        if (bold_) element.style.fontWeight = "bold";
        if (underline_) element.style.textDecoration = "underline";
    } 
    element.placeholder="テキストを追加";
    element.autocomplete="off";
    element.spellcheck=false;
    element.style.zIndex=15;
    mouseDrag(element);
    editorDiv.appendChild(element);
    element.focus();

    //右クリックで削除
    element.addEventListener("contextmenu", function(event){
        event.preventDefault();
        currentElement=element;
        modal.hidden=false;
        deleteBtn.hidden=false;
        deleteBtn.style.left = mouseX + "px";
        deleteBtn.style.top = mouseY + "px";
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
    FSInput.disabled=false;
    heightRange.disabled=false;
    heightInput.disabled=false;

    //スライダー更新
    widthRange.value = deletePx(window.getComputedStyle(element).width);
    fontSizeRange.value = deletePx(window.getComputedStyle(element).fontSize);
    heightRange.value = deletePx(window.getComputedStyle(element).height);

    //box更新
    widthInput.value = deletePx(window.getComputedStyle(element).width);
    FSInput.value = deletePx(window.getComputedStyle(element).fontSize);
    heightInput.value = deletePx(window.getComputedStyle(element).height);

    //操作中の要素を判別
    element.addEventListener("click", function(event){
        currentElement=element;
        //スライダー表示
        fontSizeRange.disabled=false;
        FSInput.disabled=false;
        heightRange.disabled=false;
        heightInput.disabled=false;
        //スライダー更新
        widthRange.value = deletePx(window.getComputedStyle(element).width);
        fontSizeRange.value = deletePx(window.getComputedStyle(element).fontSize);
        heightRange.value = deletePx(window.getComputedStyle(element).height);
        //box更新
        widthInput.value = deletePx(window.getComputedStyle(element).width);
        FSInput.value = deletePx(window.getComputedStyle(element).fontSize);
        heightInput.value = deletePx(window.getComputedStyle(element).height);
    })
}

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
    // //alert(pageHeight * pageCount + "px")
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
                widthInput.value=this.value;
                break;
            }
            case heightRange:{
                currentElement.style.height=range.value + "px";
                heightInput.value=this.value;
                break;
            }
            case fontSizeRange:{
                heightRange.value=deletePx(window.getComputedStyle(currentElement).height);
                widthRange.value=deletePx(window.getComputedStyle(currentElement).width);
                currentElement.style.fontSize=range.value + "px";
                FSInput.value=this.value;
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
            const base64Image = e.target.result;
            const img = document.createElement('img'); //img要素作成
            img.src = e.target.result;
            img.style.maxWidth = '80%';
            img.style.height = 'auto';
            img.style.left = "10px";
            img.style.top = mouseY + "px";
            img.style.position="absolute";
            img.classList.add('forimg');
            img.style.zIndex=15;
            // img.id=randomID();
            img.id = base64Image;
            img.classList.add('genTarget');
            img.classList.add('genImg');
            mouseDrag(img);
            editorDiv.appendChild(img);

            // スライダー更新
            widthRange.value = deletePx(window.getComputedStyle(img).width);
            heightRange.value = deletePx(window.getComputedStyle(img).height);

            // スライダー非活性
            fontSizeRange.disabled=true;
            FSInput.disabled=true;
            heightRange.disabled=true;
            heightInput.disabled=true;

            currentElement=img;

            //スライダー更新
            widthRange.value = deletePx(window.getComputedStyle(img).width);
            heightRange.value = deletePx(window.getComputedStyle(img).height);
            //box更新
            widthInput.value = deletePx(window.getComputedStyle(img).width);
            heightInput.value = deletePx(window.getComputedStyle(img).height);

            //操作中の要素を判別
            img.addEventListener("click", function(event){
                currentElement=img;
                //スライダー更新
                widthRange.value = deletePx(window.getComputedStyle(img).width);
                heightRange.value = deletePx(window.getComputedStyle(img).height);

                //box更新
                widthInput.value = deletePx(window.getComputedStyle(img).width);
                heightInput.value = deletePx(window.getComputedStyle(img).height);

                //スライダー非活性
                fontSizeRange.disabled=true;
                FSInput.disabled=true;
                heightRange.disabled=true;
                heightInput.disabled=true;
            })

            img.addEventListener("contextmenu", function(event){
                event.preventDefault();
                currentElement=img;
                modal.hidden=false;
                deleteBtn.hidden=false;
                deleteBtn.style.left = mouseX + "px";
                deleteBtn.style.top = mouseY + "px";
            });
        };
  
        reader.readAsDataURL(file); // ファイルをDataURLとして読み込む
      } else {
        //alert('画像ファイルのみドロップできます');
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
                const base64Image = e.target.result;
                const img = document.createElement('img'); // img要素を作成
                img.src = e.target.result;
                // img.style.maxWidth = '80%';
                img.style.height = 'auto';
                img.style.left = "10px";
                img.style.top = mouseY + "px";
                img.style.position = "absolute";
                img.classList.add('forimg');
                img.style.zIndex=15;
                img.classList.add('genTarget');
                img.classList.add('genImg');
                // img.id=randomID();
                img.id = base64Image;
                mouseDrag(img);
                editorDiv.appendChild(img);

                // スライダー更新
                widthRange.value = deletePx(window.getComputedStyle(img).width);
                heightRange.value = deletePx(window.getComputedStyle(img).height);

                // スライダー非活性
                fontSizeRange.disabled=true;
                FSInput.disabled=true;
                heightRange.disabled=true;
                heightInput.disabled=true;

                currentElement = img;


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
                    fontSizeRange.disabled=true;
                    FSInput.disabled=true;
                    heightRange.disabled=true;
                    heightInput.disabled=true;
                });

                img.addEventListener("contextmenu", function(event){
                    event.preventDefault();
                    currentElement=img;
                    modal.hidden=false;
                    deleteBtn.hidden=false;
                    deleteBtn.style.left = mouseX + "px";
                    deleteBtn.style.top = mouseY + "px";
                });
            };

            reader.readAsDataURL(file); // ファイルをDataURLとして読み込む
        } else {
            //alert('画像ファイルのみペーストできます');
        }
    }
});



// ドラッグオーバー時の設定
editorDiv.addEventListener('dragover', function(event) {
    event.preventDefault(); // ドロップを許可するためにデフォルト動作を防ぐ
});

//動画ドロップイベント(mp4)
editorDiv.addEventListener('drop', function(event){
    event.preventDefault();
    const files = event.dataTransfer.files; // ファイルを取得
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file && file.type.startsWith('video/mp4')) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const base64Video = e.target.result;//resultで得られたデータをbase64エンコードし、viodeタグのsrc属性に付与

                // video要素を作成
                const video = document.createElement('video');
                video.src = base64Video;
                video.style.maxWidth = '80%';
                video.style.height = 'auto';
                video.style.left = "10px";
                video.style.top = mouseY + "px";
                video.style.position = "absolute";
                video.classList.add('forimg');
                video.style.zIndex = 15;
                video.id = base64Video;
                video.classList.add('genTarget');
                video.classList.add('genVideo');

                // 動画を再生できるようにする
                video.controls = true; // 動画の再生/停止ボタンを表示
                video.muted = true; // 自動再生のためにミュート
                video.autoplay = true; // 自動再生（muted 必須）
                video.loop = true;

                mouseDrag(video);
                editorDiv.appendChild(video);

                // スライダー更新
                widthRange.value = deletePx(window.getComputedStyle(video).width);
                heightRange.value = deletePx(window.getComputedStyle(video).height);

                // スライダー非活性
                fontSizeRange.disabled = true;
                FSInput.disabled = true;
                heightRange.disabled = true;
                heightInput.disabled = true;

                currentElement = video;

                // スライダー更新
                widthRange.value = deletePx(window.getComputedStyle(video).width);
                heightRange.value = deletePx(window.getComputedStyle(video).height);
                // box更新
                widthInput.value = deletePx(window.getComputedStyle(video).width);
                heightInput.value = deletePx(window.getComputedStyle(video).height);

                // 操作中の要素を判別
                video.addEventListener("click", function(event){
                    currentElement = video;
                    // スライダー更新
                    widthRange.value = deletePx(window.getComputedStyle(video).width);
                    heightRange.value = deletePx(window.getComputedStyle(video).height);

                    // box更新
                    widthInput.value = deletePx(window.getComputedStyle(video).width);
                    heightInput.value = deletePx(window.getComputedStyle(video).height);

                    // スライダー非活性
                    fontSizeRange.disabled = true;
                    FSInput.disabled = true;
                    heightRange.disabled = true;
                    heightInput.disabled = true;
                });

                video.addEventListener("contextmenu", function(event){
                    event.preventDefault();
                    currentElement = video;
                    modal.hidden = false;
                    deleteBtn.hidden = false;
                    deleteBtn.style.left = mouseX + "px";
                    deleteBtn.style.top = mouseY + "px";
                });
            };

            reader.readAsDataURL(file); // ファイルをDataURLとして読み込む
        } else {
            // alert('MP4動画ファイルのみドロップできます');
        }
    }
});

// //動画ペーストペーストイベント(mp4)
// editorDiv.addEventListener('paste', function(event){
//     event.preventDefault();
//     const files = event.clipboardData.items; // ファイルを取得
//     for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         if (file && file.type.startsWith('video/mp4')) {
//             const reader = new FileReader();

//             reader.onload = function(e) {
//                 const base64Video = e.target.result;//resultで得られたデータをbase64エンコードし、viodeタグのsrc属性に付与

//                 // video要素を作成
//                 const video = document.createElement('video');
//                 video.src = base64Video;
//                 video.style.maxWidth = '80%';
//                 video.style.height = 'auto';
//                 video.style.left = "10px";
//                 video.style.top = mouseY + "px";
//                 video.style.position = "absolute";
//                 video.classList.add('forimg');
//                 video.style.zIndex = 15;
//                 video.id = base64Video;
//                 video.classList.add('genTarget');
//                 video.classList.add('genVideo');

//                 // 動画を再生できるようにする
//                 video.controls = true; // 動画の再生/停止ボタンを表示
//                 video.muted = true; // 自動再生のためにミュート
//                 video.autoplay = true; // 自動再生（muted 必須）
                    // video.loop = true;

//                 mouseDrag(video);
//                 editorDiv.appendChild(video);

//                 // スライダー更新
//                 widthRange.value = deletePx(window.getComputedStyle(video).width);
//                 heightRange.value = deletePx(window.getComputedStyle(video).height);

//                 // スライダー非活性
//                 fontSizeRange.disabled = true;
//                 FSInput.disabled = true;
//                 heightRange.disabled = true;
//                 heightInput.disabled = true;

//                 currentElement = video;

//                 // スライダー更新
//                 widthRange.value = deletePx(window.getComputedStyle(video).width);
//                 heightRange.value = deletePx(window.getComputedStyle(video).height);
//                 // box更新
//                 widthInput.value = deletePx(window.getComputedStyle(video).width);
//                 heightInput.value = deletePx(window.getComputedStyle(video).height);

//                 // 操作中の要素を判別
//                 video.addEventListener("click", function(event){
//                     currentElement = video;
//                     // スライダー更新
//                     widthRange.value = deletePx(window.getComputedStyle(video).width);
//                     heightRange.value = deletePx(window.getComputedStyle(video).height);

//                     // box更新
//                     widthInput.value = deletePx(window.getComputedStyle(video).width);
//                     heightInput.value = deletePx(window.getComputedStyle(video).height);

//                     // スライダー非活性
//                     fontSizeRange.disabled = true;
//                     FSInput.disabled = true;
//                     heightRange.disabled = true;
//                     heightInput.disabled = true;
//                 });

//                 video.addEventListener("contextmenu", function(event){
//                     event.preventDefault();
//                     currentElement = video;
//                     modal.hidden = false;
//                     deleteBtn.hidden = false;
//                     deleteBtn.style.left = mouseX + "px";
//                     deleteBtn.style.top = mouseY + "px";
//                 });
//             };

//             reader.readAsDataURL(file); // ファイルをDataURLとして読み込む
//         } else {
//             // alert('MP4動画ファイルのみドロップできます');
//         }
//     }
// });



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

function deleteElement(){
    if(currentElement == taskWindow)return;
    currentElement.remove();
    modal.hidden=true;
    deleteBtn.hidden=true;
}

function HideDeleteModal(){
    modal.hidden=true;
    deleteBtn.hidden=true;
}

//DLモーダル表示
function openDL(){
    dlModal.hidden = false;
    DLContent.hidden = false;
    fileNameTextbox.focus();
}

function HideDLModal(){
    dlModal.hidden=true;
    DLContent.hidden=true;
}

//ダウンロード
fileNameTextbox.value = "";
function downloadHTML() {
    generate();
    // ファイル名を取得
    let fileName = document.getElementById("fileNameTextbox").value.trim();
    if (!fileName) {
        alert("ファイル名を入力してください");
        return;
    }
    fileName += ".html"; // 拡張子を追加

    // HTMLコード（resultCode）の Blob を作成
    let blob = new Blob([resultCode], { type: "text/html" });

    // Blob を URL に変換
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    // リンクをクリックしてダウンロードを開始
    document.body.appendChild(link);
    link.click();

    // 一時的なリンクを削除
    document.body.removeChild(link);
}

//コードビュー
function openCodeview(){
    generate();
    htmlCodeViewer.value=resultCode;
    htmlPreviewModal.hidden = false;
    codeContent.hidden = false;
    codeContent.style.top = mouseY + "px";
}

function closeHtmlPreview(){
    htmlPreviewModal.hidden = true;
    codeContent.hidden = true;
}

function copyHtmlCode(){
    navigator.clipboard.writeText(resultCode);
}

//スライダー横テキストボックス直接入力
widthInput.addEventListener('input', function(){
    try{
        currentElement.style.width=this.value + "px";
        widthRange.value=this.value;

    }catch(error){}
})

heightInput.addEventListener('input', function(){
    try{
        currentElement.style.height=this.value + "px";
        heightRange.value=this.value;

    }catch(error){}
})

FSInput.addEventListener('input', function(){
    try{
        currentElement.style.fontSize=this.value + "px";
        fontSizeRange.value=this.value;

    }catch(error){}
})


// ｈｔｍｌファイルドロップ（json継承）
editorDiv.addEventListener('drop', function(event) {
    event.preventDefault();
    const files = event.dataTransfer.files; // ファイルを取得
    const file = files[0];

    if (file && file.type === 'text/html') {
      const reader = new FileReader();
  
      reader.onload = function(e) {
        //htmlソース
        const htmlContent = e.target.result;
        //非対応なら終了
        if(htmlContent.indexOf(`$&')&'&%&'%&'('(&''%$&&%'()=)('&'%$&'()=)~)(&%%&'()((''%$$#$%&&&'&('&('&''(&('&''(&&'&'())'))')')'))')')')')`) == -1)return alert("非対応のhtmlファイルです。");
        //再構築
        var extendsJSON = JSON.parse(htmlContent.substring(htmlContent.indexOf(`$&')&'&%&'%&'('(&''%$&&%'()=)('&'%$&'()=)~)(&%%&'()((''%$$#$%&&&'&('&('&''(&('&''(&&'&'())'))')')'))')')')')`)+108,htmlContent.indexOf(`EE$&')&'&%&'%&'('(&''%$&&%'()=)('&'%$&'()=)~)(&%%&'()((''%$$#$%&&&'&('&('&''(&('&''(&&'&'())'))')')'))')')')')`)));
        mainData = extendsJSON;
        reConstruct();

        };

        //ファイル名を設定
        fileNameTextbox.value = file.name.substring(0,file.name.length-5);
  
      reader.readAsText(file); // ファイルをテキストとして読み込む
    } else {
    }
  });

//再構築
function reConstruct(){
    deleteAll();
    for(var element of mainData){
        switch(element.type){
            case "text":{
                createText(true, element.top, element.left, element.width, element.height, element.fontSize, element.bold, element.underline, element.value);
                break;
            }
            case "img":{
                createImg(element.top, element.left, element.width, element.height, element.src);
                break;
            }
            case "video":{
                createVideo(element.top, element.left, element.width, element.height, element.src);
                break;
            }
            case "square":{
                createSquare(true, element.top, element.left, element.width, element.height);
                break;
            }
            case "body":{
                reConstructPage(element.height);
                break;
            }
        }
    }
}

function createImg(top_, left_, width_, height_, src_){
    const img = document.createElement('img'); // img要素を作成
    img.src = src_;
    img.style.height = "auto";
    img.style.width = width_;
    img.style.left = left_;
    img.style.top = top_;
    img.style.position = "absolute";
    img.classList.add('forimg');
    img.style.zIndex=15;
    img.classList.add('genTarget');
    img.classList.add('genImg');
    img.id = src_;
    mouseDrag(img);
    editorDiv.appendChild(img);

    // スライダー更新
    widthRange.value = deletePx(window.getComputedStyle(img).width);
    heightRange.value = deletePx(window.getComputedStyle(img).height);

    // スライダー非活性
    fontSizeRange.disabled=true;
    FSInput.disabled=true;
    heightRange.disabled=true;
    heightInput.disabled=true;

    currentElement = img;


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
        fontSizeRange.disabled=true;
        fontSizeRange.disabled=true;
        heightRange.disabled=true;
        heightInput.disabled=true;
    });

    img.addEventListener("contextmenu", function(event){
        event.preventDefault();
        currentElement=img;
        modal.hidden=false;
        deleteBtn.hidden=false;
        deleteBtn.style.left = mouseX + "px";
        deleteBtn.style.top = mouseY + "px";
    });
}

function createVideo(top_, left_, width_, height_, src_){
    const video = document.createElement('video'); // video要素を作成
    video.src = src_;
    video.style.height = "auto";
    video.style.width = width_;
    video.style.left = left_;
    video.style.top = top_;
    video.style.position = "absolute";
    video.classList.add('forimg');
    video.style.zIndex=15;
    video.classList.add('genTarget');
    video.classList.add('genVideo');
    video.id = src_;
    mouseDrag(video);
    editorDiv.appendChild(video);

    // 動画を再生できるようにする
    video.controls = true; // 動画の再生/停止ボタンを表示
    video.muted = true; // 自動再生のためにミュート
    video.autoplay = true; // 自動再生（muted 必須）
    video.loop = true;

    // スライダー更新
    widthRange.value = deletePx(window.getComputedStyle(video).width);
    heightRange.value = deletePx(window.getComputedStyle(video).height);

    // スライダー非活性
    fontSizeRange.disabled=true;
    FSInput.disabled=true;
    heightRange.disabled=true;
    heightInput.disabled=true;

    currentElement = video;


    // スライダー更新
    widthRange.value = deletePx(window.getComputedStyle(video).width);
    heightRange.value = deletePx(window.getComputedStyle(video).height);

    // 操作中の要素を判別
    video.addEventListener("click", function(event){
        currentElement = video;
        // スライダー更新
        widthRange.value = deletePx(window.getComputedStyle(video).width);
        heightRange.value = deletePx(window.getComputedStyle(video).height);

        // スライダー非活性
        fontSizeRange.disabled=true;
        FSInput.disabled=true;
        heightRange.disabled=true;
        heightInput.disabled=true;
    });

    video.addEventListener("contextmenu", function(event){
        event.preventDefault();
        currentElement=video;
        modal.hidden=false;
        deleteBtn.hidden=false;
        deleteBtn.style.left = mouseX + "px";
        deleteBtn.style.top = mouseY + "px";
    });
}


//画面クリア
function deleteAll(){
    //画面要素削除
    for(var element of Array.from(document.getElementsByClassName('genTarget'))){
        element.remove();
    }
    //ページ削除
    for(var element of Array.from(document.getElementsByClassName('page'))){
        if(element.id != "editorDiv")element.remove();
    }
    pageCount=1;
}

//ページ復元
function reConstructPage(height){
    var cnt = (parseInt(height)/911)-1;
    for(let i = 0; i < cnt; i++){
        addPage();
    }
}

var isMouseDown = false;//マウスダウン判定
var isRDown = false;//R判定
var isAltDown = false;//E判定

//マウスダウン判定
var startX = 0;
var startY = 0;
editorDiv.addEventListener("mousedown", function(event){
    isMouseDown=true;
    startX = mouseX;
    startY = mouseY;
    if(isRDown){
        createSquare(false);
    }
});
//リサイズ
document.addEventListener("mousemove", function(event){
    // if(!isMouseDown || !isRDown)return;
    //     currentElement.style.width = mouseX - startX + "px";
    //     currentElement.style.height = mouseY - startY + "px";
    if(isMouseDown && isRDown){
        currentElement.style.width = mouseX - startX + "px";
        currentElement.style.height = mouseY - startY + "px";
        editorDiv.focus();
    }
    if(isMouseDown && isAltDown){
        currentElement.style.width = mouseX - deletePx(window.getComputedStyle(currentElement).left) + "px";
        currentElement.style.height = mouseY - deletePx(window.getComputedStyle(currentElement).top) + "px";
    }
});

editorDiv.addEventListener("mouseup", function(event){
    isMouseDown=false;
});

// R Eダウン判定
document.addEventListener("keydown", function(event){
    if(event.key == "R" || event.key == "r"){
        isRDown=true;
    };
    if(event.key == "Alt"){
        isAltDown=true;
    };
});

document.addEventListener("keyup", function(event){
        isRDown=false;
        isAltDown=false;
});

//四角枠生成
function createSquare(isReConstruct, top_, left_, width_, height_){
    //入力用のテキストエリアを作成
    const element = document.createElement('div');
    element.id = randomID();
    element.classList.add('forSquare');
    element.classList.add('absolute');
    element.classList.add('genTarget');
    element.classList.add('genSquare');
    element.style.left = mouseX + "px";
    element.style.top = mouseY + "px";
    if (isReConstruct) { // 再構築
        element.style.left = left_;
        element.style.top = top_;
        element.style.width = width_;
        element.style.height = height_;
    } 
    element.style.zIndex=14;
    mouseDrag(element);
    editorDiv.appendChild(element);

    //右クリックで削除
    element.addEventListener("contextmenu", function(event){
        event.preventDefault();
        currentElement=element;
        modal.hidden=false;
        deleteBtn.hidden=false;
        deleteBtn.style.left = mouseX + "px";
        deleteBtn.style.top = mouseY + "px";
    });

    currentElement=element;

    //スライダー表示
    fontSizeRange.disabled=true;
    FSInput.disabled=true;
    heightRange.disabled=false;
    heightInput.disabled=false;

    //スライダー更新
    widthRange.value = deletePx(window.getComputedStyle(element).width);
    heightRange.value = deletePx(window.getComputedStyle(element).height);

    //box更新
    widthInput.value = deletePx(window.getComputedStyle(element).width);
    heightInput.value = deletePx(window.getComputedStyle(element).height);

    //操作中の要素を判別
    element.addEventListener("click", function(event){
        currentElement=element;
        //スライダー表示
        fontSizeRange.disabled=false;
        FSInput.disabled=true;
        fontSizeRange.disabled=true;
        heightRange.disabled=false;
        heightInput.disabled=false;
        //スライダー更新
        widthRange.value = deletePx(window.getComputedStyle(element).width);
        heightRange.value = deletePx(window.getComputedStyle(element).height);
        //box更新
        widthInput.value = deletePx(window.getComputedStyle(element).width);
        heightInput.value = deletePx(window.getComputedStyle(element).height);
    })
}

  


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
    mouseX = event.pageX;
    mouseY = event.pageY;
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

    var cnt = 0;

    mainData=[];

    resultCode = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700&display=swap" rel="stylesheet');
    
    .forText{
      background-color: transparent;
      color: black;
      outline: none;
      resize: none;
      border: none;
      font-family: 'Poppins', sans-serif;
    }

    .forSquare{
      background-color: transparent;
      border: solid rgb(214, 214, 214);
      z-index: -1;
    }

    .forVideo{
      box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
    }

    body{
      width: 100vw;
      height: ${911 * pageCount}px;/* ページの長さを指定 */
      overflow-x: hidden;
    }

    /* スクロールバー */
    ::-webkit-scrollbar {
        width: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: #1a1a1a;
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
        background-color: #555;
        border-radius: 4px;
        border: 1px solid #333;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background-color: #888;
    } 

    ::-webkit-scrollbar-corner {
        background: transparent;
    }
  </style>
</head>
<body>
`;

    //生成対象を配列に格納
    var targetArray = Array.from(document.getElementsByClassName('genTarget'));

    // heightの昇順に並べ替え
    targetArray.sort((a, b) => {
        return parseFloat(a.style.height) - parseFloat(b.style.height);
    });

    for(var element of targetArray){
        cnt++;
        //分岐
        var judge;
        if(element.classList.contains('genText')) judge = 1;
        if(element.classList.contains('genImg')) judge = 2;
        if(element.classList.contains('genVideo')) judge = 3;
        if(element.classList.contains('genSquare')) judge = 4;
        switch(judge){
            case 1:{//テキスト
                const style = window.getComputedStyle(element);
                resultCode += `<textarea class="forText" style="position: absolute; left: ${window.getComputedStyle(element).left}; top: ${window.getComputedStyle(element).top}; width: ${window.getComputedStyle(element).width}; height: ${window.getComputedStyle(element).height}; font-size: ${window.getComputedStyle(element).fontSize}; ${style.fontWeight == 700 ? "font-weight: bold; " : ""}${style.textDecorationLine == "underline" ? "text-decoration: underline;" : ""}" readonly spellcheck="off">${element.value}</textarea>
`;
            //再生成時用の情報
            mainData.push({
                type: "text",
                top: window.getComputedStyle(element).top,
                left: window.getComputedStyle(element).left,
                width: window.getComputedStyle(element).width,
                height: window.getComputedStyle(element).height,
                fontSize: window.getComputedStyle(element).fontSize,
                bold: style.fontWeight == 700,
                underline: style.textDecorationLine == "underline",
                value: element.value
            });
                break;
            }
            case 2:{//画像
                resultCode += `<!-- イメージ -->
<img src="${element.id}" style="position: absolute; left: ${window.getComputedStyle(element).left}; top: ${window.getComputedStyle(element).top}; width: ${window.getComputedStyle(element).width}; height: ${window.getComputedStyle(element).height};">
`;
            //再生成時用の情報
            mainData.push({
                type: "img",
                top: window.getComputedStyle(element).top,
                left: window.getComputedStyle(element).left,
                width: window.getComputedStyle(element).width,
                height: window.getComputedStyle(element).height,
                src: element.id
            });
                break;
            }
            case 3:{//ビデオ
                resultCode += `<!-- ビデオ -->
<video class = "forVideo" style="position: absolute; left: ${window.getComputedStyle(element).left}; top: ${window.getComputedStyle(element).top}; width: ${window.getComputedStyle(element).width}; height: ${window.getComputedStyle(element).height};" controls= true  muted= true  autoplay= true loop= true><source src="${element.id}" type="video/mp4"></video>
`;
            //再生成時用の情報
            mainData.push({
                type: "video",
                top: window.getComputedStyle(element).top,
                left: window.getComputedStyle(element).left,
                width: window.getComputedStyle(element).width,
                height: window.getComputedStyle(element).height,
                src: element.id
            });
                break;
            }
            case 4:{//四角枠
                const style = window.getComputedStyle(element);
                resultCode += `<div class="forSquare" style="position: absolute; left: ${style.left}; top: ${style.top}; width: ${style.width}; height: ${style.height};"></div>
`;
            //再生成時用の情報
            mainData.push({
                type: "square",
                top: window.getComputedStyle(element).top,
                left: window.getComputedStyle(element).left,
                width: window.getComputedStyle(element).width,
                height: window.getComputedStyle(element).height
            });
                break;
            }
        }
    }

    //再生成時用の情報
    mainData.push({
        type: "body",
        height: 911 * pageCount
    });

    resultCode += `</body>
<!--$&')&'&%&'%&'('(&''%$&&%'()=)('&'%$&'()=)~)(&%%&'()((''%$$#$%&&&'&('&('&''(&('&''(&&'&'())'))')')'))')')')')${JSON.stringify(mainData)}EE$&')&'&%&'%&'('(&''%$&&%'()=)('&'%$&'()=)~)(&%%&'()((''%$$#$%&&&'&('&('&''(&('&''(&&'&'())'))')')'))')')')')
-->
</html>`;
};


//プレビュー
function preview(){
    generate();
    // navigator.clipboard.writeText(resultCode)
    const newWindow = window.open('preview.html', '_blank', `width=${screen.width},height=${screen.height},top=0,left=0`);
    newWindow.onload = function() {
        newWindow.postMessage(resultCode, '*');
    };
};




// 読み込み後に実行*****************

//タスクウィンドウをドラッグ可能にする
mouseDrag(taskWindow);
addSliderEvent(widthRange);
addSliderEvent(heightRange);
addSliderEvent(fontSizeRange);
addButtonEvent(Bbutton);
addButtonEvent(Ubutton);