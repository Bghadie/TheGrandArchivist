
function init(){
  let searchBtn = document.getElementById("search");
  let logingBtn = document.getElementById('logIn');
  searchBtn.addEventListener("click",search)
  logingBtn.addEventListener("click", logIn);
}
//function that calls server and searches for movie information
function search(){
  let request = new XMLHttpRequest();
  let title = document.getElementById("title").value;
  let director = document.getElementById("director").value;
  let actor = document.getElementById("actor").value;
  let genre = document.getElementById("genre").value;
  let id = document.getElementById("ID").value;

  let queryString = "/movies?"+"id="+ id +"&title=" +title + "&director=" +director + "&actor=" + actor + "&genre=" +genre
  console.log(id)
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //replace the movie with what ever the server returns
      window.open(queryString, "_self");
    }
  }
  request.open("GET",queryString);
  request.send();
}

//go to the login page
function logIn(){
  document.location.replace("./HTMLFiles/Login_CreateAccountSkeleton.html");
}
