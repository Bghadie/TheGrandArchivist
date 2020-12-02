function init(){
  //check if the user is logged in
  checkLoggedIn();
  chechContributingUser();//check if they are a contributing user
  var queryString =" "

  //get all buttons and search bars
  let searchBar = document.getElementById("searchBar");
  let searchBtn = document.getElementById("search");
  let logingBtn = document.getElementById('logIn');
  let addPersonBtn = document.getElementById("addPerson");
  let searchCriteria = document.getElementById("searchCriteria");
  let addMovieBtn = document.getElementById('addMovie');
  let addSearchCriteriaBtn = document.getElementById('addSearchCriteria');

  //this is an aesthetics thing, it updates the search bar to display <the search criteria> (i.e., people, movie, etc) followed by an elispses
  searchCriteria.addEventListener("change", () =>{
    document.getElementById("searchBar").placeholder = document.getElementById("searchCriteria").value +"...";
    if(document.getElementById("searchCriteria").value === "Person" || document.getElementById("searchCriteria").value === "User"){
      document.getElementById('addSearchCriteria').disabled = true;
    }else{
      document.getElementById('addSearchCriteria').disabled = false;
    }
    potentialSearches = ["title", "id", "genre", "rating", "year"];
    for(parameter of potentialSearches){
      if(queryString.includes(parameter) && (document.getElementById("searchCriteria").value.toLowerCase() === parameter)){
        document.getElementById('addSearchCriteria').disabled = true;
      }
    }
  });
  addSearchCriteriaBtn.addEventListener("click", function(){
    let searchReq = document.getElementById("searchCriteria").value;
    let currentSearch;

    if(searchReq === "Title"){
      //if the user entered an id
      if(/^\d+$/.test(document.getElementById("searchBar").value)){
        //search the database by ID
        queryString += "&id=" +document.getElementById("searchBar").value;
      }else{
        //search the database by movie title
        queryString += "&title=" +document.getElementById("searchBar").value;
      }
    //If the dropdown menu is set to person
    //the dropdown menu is set to Genre
    }else if(searchReq === "Genre"){
      queryString += "&genre=" + document.getElementById("searchBar").value;
    }
    //If the dropdown menu is set to Rating
    else if(searchReq === "Rating"){
      queryString += "&rating=" + document.getElementById("searchBar").value;
    }
    //If the dropdown menu is set to Year
    else if (searchReq === "Year") {
      queryString += "&year=" + document.getElementById("searchBar").value;
    }
    document.getElementById("searchBar").value = "";
    document.getElementById('addSearchCriteria').disabled = true;
  });
  //add all the event listeners
  searchBtn.addEventListener("click", function(){
    search(queryString);
  });
  logingBtn.addEventListener("click", logIn);
  addMovieBtn.addEventListener("click", addMoviePage);
  addPersonBtn.addEventListener("click", addPersonPage);
}


//if the user presses the add person button, take them to the add person page
function addPersonPage(){
  let request = new XMLHttpRequest();
  let queryString = "/addPersonPage?&title=";
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
//if the user presses the add movie button, take them to the add person page
function addMoviePage(){
  let request = new XMLHttpRequest();
  let queryString = "/addMoviePage";
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

//function that calls server and searches for movie information
function search(currentQuery){

  let request = new XMLHttpRequest();
  let searchReq = document.getElementById("searchCriteria").value;
  let queryString;
  let searchForMovie = false;
  let flag = true;
  currentQuery = currentQuery.trim();
  //the following GIANT branching statement is used to set the routes
  //If the dropdop menu is set to title
  if(searchReq === "Person"){
    //if the user eneter an ID
    if(/^\d+$/.test(document.getElementById("searchBar").value)){
      //search the database by ID
      queryString = "/people:" + document.getElementById("searchBar").value;
      flag = false;
    }else{
      //search the database by person name
      queryString = "/people?"+"&name=" + document.getElementById("searchBar").value + "&pageNum=0";
    }
  }  //If the dropdown menu is set to user
  else if (searchReq === "User"){
    queryString = "/users?&user=" + document.getElementById("searchBar").value + "&pageNum=0";
  }else{
    searchForMovie = true;
    queryString = "/movies";
    if(searchReq === "Title" && !currentQuery.includes("title")){
      //if the user entered an id
      if(/^[-+]?\d+$/.test(document.getElementById("searchBar").value)){
        //search the database by ID
        queryString += ":" +document.getElementById("searchBar").value;
        flag = false
      }else{
        //search the database by movie title
        queryString += "?"+"&title=" +document.getElementById("searchBar").value + "&pageNum=0";
      }
    //If the dropdown menu is set to person
    }else if(searchReq === "Genre" && !currentQuery.includes("genre")){
      queryString += "?&genre=" + document.getElementById("searchBar").value + "&pageNum=0";
    }
    //If the dropdown menu is set to Rating
    else if(searchReq === "Rating" && !currentQuery.includes("rating")){
      queryString += "?&rating=" + document.getElementById("searchBar").value + "&pageNum=0";
    }
    //If the dropdown menu is set to Year
    else if (searchReq === "Year" && !currentQuery.includes("year")) {
      queryString += "?&year=" + document.getElementById("searchBar").value + "&pageNum=0";
    }

  }
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //replace the movie with what ever the server returns
      window.open(queryString, "_self");
    }
  }


  if(currentQuery){
    request.open("GET",queryString);
    queryString = queryString+currentQuery;
  }
  if(!queryString.includes("pageNum") && flag){
    queryString += "&pageNum=0";
  }
  console.log(queryString)
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}

//redirect to log in page
function logIn(){
  let request = new XMLHttpRequest();
  let queryString;
  if("Back To Account" === document.getElementById('logIn').value){
    queryString = "/userPage"
  }else{
    queryString = "/loginPage"
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

//this function checks if the user is logged in
function checkLoggedIn(){
  let request = new XMLHttpRequest();
  let queryString = "/checkLoggedIn";
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //if they are logged in the "login" button should read "back to account"
      document.getElementById('logIn').value = "Back To Account";
    }else{
      //they aren't log in, the "login" button should read "Login/Sign Up"
      document.getElementById('logIn').value = "Login/Sign Up";
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}

//check if the user, who's logged in, is a contributing user
function chechContributingUser(){
  let request = new XMLHttpRequest();
  let queryString = "/checkContributing";
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //if they are, enable the ability to add a movie and person to the database
      document.getElementById('addMovie').disabled = false;
      document.getElementById('addPerson').disabled = false;
    }else{
      //they aren't a contributing user and thus the add movie and person button should
      //be disabled
      document.getElementById('addMovie').disabled = true;
      document.getElementById('addPerson').disabled = true;
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}
