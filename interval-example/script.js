(function () {
    var intervalStream = Rx.Observable.interval(1000)
        .filter(function(value){
            return value%2===0;
        })
        .take(3)
        .map(function(value){
            return value+".";
        });

    var cntLabel = document.querySelector("h1");

    intervalStream.subscribe(function(result){
        cntLabel.textContent = result;
    });
}());

