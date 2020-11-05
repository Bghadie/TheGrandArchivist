function init(){
  getMaxPage();
  checkPrev();

}
function checkPrev(){
  let currentURL = window.location.search;
  let urlParams = new URLSearchParams(currentURL)
  let curPage = parseInt(urlParams.get("pageNum"));
  if(curPage === 0){
    document.getElementById("previous").classList.add("disableAnchor");
  }else{
    document.getElementById("previous").classList.remove("disableAnchor");
  }
}

function checkNext(maxPage){
  let currentURL = window.location.search;
  let urlParams = new URLSearchParams(currentURL)
  let curPage = parseInt(urlParams.get("pageNum"));
  if((curPage) === (maxPage)){
    document.getElementById("next").classList.add("disableAnchor");
  }else{
    document.getElementById("next").classList.remove("disableAnchor");
  }
}

function getMaxPage(){
  let request = new XMLHttpRequest();
  let currentURL = window.location.search;
  let urlParams = new URLSearchParams(currentURL)
  let queryString;
  urlParams.delete("pageNum");
  if(urlParams.get("title")){
    queryString = "/findMaxPageMovie?" + urlParams.toString();
  }else if(urlParams.get("genre")){
    queryString = "/findMaxPageGenre?" + urlParams.toString();
  }else if(urlParams.get("year")) {
    queryString = "/findMaxPageYear?" + urlParams.toString();
  }else if(urlParams.get("rating")) {
    queryString = "/findMaxPageRating?" + urlParams.toString();
  }
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //redirect to that person's page if they're found
      console.log(this.response)
      checkNext(parseInt(this.response));
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}

function findMovie(caller){
  let request = new XMLHttpRequest();
  let queryString = "/movies?title=" +caller.name;
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //redirect to that person's page if they're found
      window.open(queryString, "_self");
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}
function nextPageMovie(caller){
  let request = new XMLHttpRequest();
  let currentURL = window.location.search;
  let urlParams = new URLSearchParams(currentURL)
  let newPage = parseInt(urlParams.get("pageNum"))+1;
  urlParams.set("pageNum", newPage)
  let queryString;
  if(urlParams.get("title")){
    queryString = "/movies?" + urlParams.toString()
  }else if(urlParams.get("year")){
    queryString = "/year?" + urlParams.toString()
  }else if(urlParams.get("rating")){
    queryString = "/review?" + urlParams.toString()
  }
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //replace the movie with what ever the server returns
      window.open(queryString, "_self");
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();

}
function prevPageMovie(caller){
  let request = new XMLHttpRequest();
  let currentURL = window.location.search;
  let urlParams = new URLSearchParams(currentURL)
  let newPage = parseInt(urlParams.get("pageNum"))-1;
  urlParams.set("pageNum", newPage)
  let queryString;
  if(urlParams.get("title")){
    queryString = "/movies?" + urlParams.toString()
  }else if(urlParams.get("year")){
    queryString = "/year?" + urlParams.toString()
  }else if(urlParams.get("rating")){
    queryString = "/review?" + urlParams.toString()
  }
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //replace the movie with what ever the server returns
      window.open(queryString, "_self");
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}

function nextPageGenre(caller){
  let request = new XMLHttpRequest();
  let currentURL = window.location.search;
  let urlParams = new URLSearchParams(currentURL)
  let newPage = parseInt(urlParams.get("pageNum"))+1;
  urlParams.set("pageNum", newPage)
  let queryString = "/genre?" + urlParams.toString()
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //replace the movie with what ever the server returns
      window.open(queryString, "_self");
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();

}
function prevPageGenre(caller){
  let request = new XMLHttpRequest();
  let currentURL = window.location.search;
  let urlParams = new URLSearchParams(currentURL);
  let newPage = parseInt(urlParams.get("pageNum"))-1;

  urlParams.set("pageNum", newPage)
  let queryString = "/genre?" + urlParams.toString()
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //replace the movie with what ever the server returns
      window.open(queryString, "_self");
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}
