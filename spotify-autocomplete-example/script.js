var input = document.querySelector("input");
var resultList = document.getElementById("list");

var inputStream = Rx.Observable.fromEvent(input,"keyup");

var filterInputStream = inputStream.debounce(250)
.map(function(){
  return input.value;
})
.filter(function(value){
  return value;
})
.distinctUntilChanged();


inputStream.filter(function(){
  return input.value == "";
}).subscribe(clearList);


function querySpotify(value){
  return Rx.Observable.fromPromise(
    $.getJSON("https://api.spotify.com/v1/search?q="+value + "&type=artist"));
}

var responseStream = filterInputStream
.flatMapLatest(querySpotify).doOnNext(clearList);


var artistStream = responseStream.flatMap(function(result){
  return Rx.Observable.fromArray(result.artists.items).pluck("name");
});

artistStream.subscribe(renderResult);

function renderResult(name){
  resultList.innerHTML += '<li>'+name + '</li>';
}

function clearList(){
  resultList.innerHTML = '';
}