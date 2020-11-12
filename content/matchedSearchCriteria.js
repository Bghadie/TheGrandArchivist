function init(){
  getMaxPage(); //checks to see if
  checkPrev(); //checks to see if the previous button should be activated
}
//this function checks whether or not to disable the previous page link
function checkPrev(){
  let currentURL = window.location.search;
  let urlParams = new URLSearchParams(currentURL)
  let curPage = parseInt(urlParams.get("pageNum"));
  //if the current page is 0, disable the previous page link
  if(curPage === 0){
    document.getElementById("previous").classList.add("disableAnchor");
  }else{
    //otherwise enable it
    document.getElementById("previous").classList.remove("disableAnchor");
  }
}

//this function checks whether or not to disable the next page link
function checkNext(maxPage){
  let currentURL = window.location.search;
  let urlParams = new URLSearchParams(currentURL)
  let curPage = parseInt(urlParams.get("pageNum"));
  //if the current page is the maximum page, disable the next page link
  if((curPage) === (maxPage)){
    document.getElementById("next").classList.add("disableAnchor");
  }else{
    //otherwise enable the next page link
    document.getElementById("next").classList.remove("disableAnchor");
  }
}

//this function determins what exactly the max page number is
function getMaxPage(){
  let request = new XMLHttpRequest();
  let currentURL = window.location.search;
  let urlParams = new URLSearchParams(currentURL)
  let queryString;
  urlParams.delete("pageNum");
  //figure out what the user searched (i.e., movie, genre, etc) and set the
  //appropriate route
  if(urlParams.get("title") || urlParams.get("title") === ""){
    queryString = "/findMaxPageMovie?" + urlParams.toString();
  }else if(urlParams.get("genre") || urlParams.get("genre") === ""){
    queryString = "/findMaxPageGenre?" + urlParams.toString();
  }else if(urlParams.get("year")|| urlParams.get("year") === "") {
    queryString = "/findMaxPageYear?" + urlParams.toString();
  }else if(urlParams.get("rating")|| urlParams.get("rating") === "") {
    queryString = "/findMaxPageRating?" + urlParams.toString();
  }else if(urlParams.get("name")|| urlParams.get("name") === ""){
    queryString = "/findMaxPagePeople?" + urlParams.toString();
  }else{
    queryString = "/findMaxPageUser?" + urlParams.toString();
  }
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      checkNext(parseInt(this.response));//check to see if the next page link needs to be disabled
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}

//this function is an attribute of all movies being listed on the page
//if the user presses either the movie title or the movie poster,
//it redirects them to the movie page
function findMovie(caller){
  let request = new XMLHttpRequest();
  let queryString = "/movies?title=" +caller.name;
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

//this function is an attribute of all people being listed on the page
//if the user presses the person's name then
//it redirects them to the person's page
function findPerson(caller){
  let request = new XMLHttpRequest();
  let queryString = "/people?name=" +caller.name;
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


/*
All these functions are the same. Basically, it lets users navigate
across pages being displayed. Basically, no matter what the user is viewing
these function (well the appropriate function) will help users navigate to the
next/previous page
*/
function prevPagePerson(caller){
  let request = new XMLHttpRequest();
  let currentURL = window.location.search;
  let urlParams = new URLSearchParams(currentURL);
  let newPage = parseInt(urlParams.get("pageNum"))-1;

  urlParams.set("pageNum", newPage)
  let queryString = "/people?" + urlParams.toString()
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
function nextPagePerson(caller){
  let request = new XMLHttpRequest();
  let currentURL = window.location.search;
  let urlParams = new URLSearchParams(currentURL)
  let newPage = parseInt(urlParams.get("pageNum"))+1;
  urlParams.set("pageNum", newPage)
  let queryString = "/people?" + urlParams.toString();
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


function nextPageMovie(caller){
  let request = new XMLHttpRequest();
  let currentURL = window.location.search;
  let urlParams = new URLSearchParams(currentURL)
  let newPage = parseInt(urlParams.get("pageNum"))+1;
  urlParams.set("pageNum", newPage)
  let queryString;
  if(urlParams.get("title") || urlParams.get("title") === ""){
    queryString = "/movies?" + urlParams.toString()
  }else if(urlParams.get("year") || urlParams.get("year") === ""){
    queryString = "/movies?" + urlParams.toString()
  }else if(urlParams.get("rating") || urlParams.get("rating") === ""){
    queryString = "/movies?" + urlParams.toString()
  }
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //replace the movie with what ever the server returns
      window.open(queryString, "_self");
    }
  }
  console.log(queryString)
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
  if(urlParams.get("title") || urlParams.get("title") === ""){
    queryString = "/movies?" + urlParams.toString()
  }else if(urlParams.get("year")|| urlParams.get("year") === ""){
    queryString = "/movies?" + urlParams.toString()
  }else if(urlParams.get("rating")|| urlParams.get("rating") === ""){
    queryString = "/movies?" + urlParams.toString()
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
  let queryString = "/movies?" + urlParams.toString()
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
  let queryString = "/movies?" + urlParams.toString()
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
function findUsers(caller){
  let request = new XMLHttpRequest();
  let queryString = "/users?user=" +caller.name;
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
function prevPageUser(caller){
  let request = new XMLHttpRequest();
  let currentURL = window.location.search;
  let urlParams = new URLSearchParams(currentURL);
  let newPage = parseInt(urlParams.get("pageNum"))-1;

  urlParams.set("pageNum", newPage)
  let queryString = "/users?" + urlParams.toString()
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
function nextPageUser(caller){
  let request = new XMLHttpRequest();
  let currentURL = window.location.search;
  let urlParams = new URLSearchParams(currentURL)
  let newPage = parseInt(urlParams.get("pageNum"))+1;
  urlParams.set("pageNum", newPage)
  let queryString = "/users?" + urlParams.toString()
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
