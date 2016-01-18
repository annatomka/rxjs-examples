var sampleImage = document.querySelector("#sample");
var selectedColorsList = document.querySelector(".selected-colors");
var actualColorDiv = document.querySelector(".actual-color");
var actualColorLabel = document.querySelector(".actual-color-label");
var canvas = document.createElement("canvas");

var w = sampleImage.clientWidth;
var h = sampleImage.clientHeight;

canvas.width = w;
canvas.height = h;

var mouseMoveStream = Rx.Observable.fromEvent(sampleImage, "mousemove");

mouseMoveStream.map(retrieveColorFromEvent).subscribe(function (color) {
    addActualColor(color);
});

var clickStream = Rx.Observable.fromEvent(sampleImage, "mousedown")
    .map(retrieveColorFromEvent).distinctUntilChanged();

clickStream.subscribe(function (color) {
    addSelectedColor(color);
});


function retrieveColorFromEvent(event){
    var point = {
        x: event.offsetX,
        y: event.offsetY
    };

    canvas.getContext('2d').drawImage(sampleImage, 0, 0, w, h);
    var pixelData = canvas.getContext('2d').getImageData(point.x, point.y, 1, 1).data;
    return "rgba(" + pixelData[0] + "," + pixelData[1] + "," + pixelData[2] + "," + pixelData[3] / 100 + ")";
}

function addActualColor(color) {
    actualColorDiv.style.backgroundColor = color;
    actualColorLabel.innerHTML = color;
}

function addSelectedColor(color){
    selectedColorsList.innerHTML += '<li><div style="background-color: '+color+'" title="'+color+'"></div></li>';
}