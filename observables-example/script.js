var helloWorldObservable = null;
var messageElement = document.getElementById("message");

var buttonClickObservable = Rx.Observable.create(function(observer){
    var clickerListener = function(){
        observer.onNext(true);
        setMessage("clicker was clicked")
    };

    var clickerBtn = $("#clicker");

    clickerBtn.on("click", clickerListener);

    return function () {
        setMessage("button click observable disposed");
        clickerBtn.off("click",clickerListener);
    };
});


var setIntervalObservable = Rx.Observable.create(function(observer) {
    var interval = setInterval(function(){
        observer.onNext(true);
        appendMessage("awesome interval observable");
    }, 5000);

    return function(){
        clearInterval(interval);
        appendMessage("awesome interval cleared");
    }
});

var setTimeoutObservable = Rx.Observable.create(function(observer){
    var timeout = setTimeout(function(){
        observer.onNext(true);
        observer.onCompleted();
    }, 1000);

    return function(){
        clearTimeout(timeout);
        console.log("awesome timeout cleared");
    };
});





var setIntervalInitiatedObservable = setIntervalObservable.startWith(true);
var buttonTwiceClickedObservable = buttonClickObservable.take(2);

var buttonClickAndIntervalMergedObservable = Rx.Observable
    .merge(setIntervalInitiatedObservable,buttonTwiceClickedObservable);

var setTimoutAfterButtonClickedObservable = buttonClickObservable
    .flatMapLatest(function(x,i){
        return setIntervalObservable.take(2);
    });

helloWorldObservable = setTimoutAfterButtonClickedObservable
    .map(function transformToHelloWorld(value){
        return "Hello World!";
    });




var buttonClickSubscription = helloWorldObservable.subscribe(function onNext(value){
    appendMessage(value);
},function onError(){

},function onCompleted(){

});

$("#reset").on("click",function(){
    buttonClickSubscription.dispose();
});

function setMessage(text){
    messageElement.innerHTML = '<div>' + text + '</div>';
}

function appendMessage(text){
    messageElement.innerHTML += '<div>' + text + '</div>';
}
