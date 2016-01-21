(function ($) {

    //find DOM elements
    var input = document.querySelector("input");
    var resultList = document.getElementById("list");

    //define observables
    var inputStream = Rx.Observable.fromEvent(input, "keyup");

    var filterInputStream = inputStream.debounce(250)
        .map(function () {
            return input.value;
        })
        .filter(function (value) {
            return value;
        })
        .distinctUntilChanged();

    var emptyInputStream = inputStream.filter(function () {
        return input.value == "";
    });

    var responseStream = filterInputStream
        .flatMapLatest(querySpotify).doOnNext(clearList);

    var artistStream = responseStream.flatMap(function (result) {
        return Rx.Observable.from(result.artists.items).pluck("name");
    });

    artistStream.subscribe(renderResult);
    emptyInputStream.subscribe(clearList);

    function querySpotify(value) {
        return Rx.Observable.fromPromise(
            $.getJSON("https://api.spotify.com/v1/search?q=" + value + "&type=artist"));
    }

    function renderResult(name) {
        resultList.innerHTML += '<li>' + name + '</li>';
    }

    function clearList() {
        resultList.innerHTML = '';
    }
}($));