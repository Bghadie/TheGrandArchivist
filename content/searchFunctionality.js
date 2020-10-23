
function init(){
  let searchBtn = document.getElementById("search");
  let logingBtn = document.getElementById('logIn');
  let searchCriteria = document.getElementById("searchCriteria");
  searchCriteria.addEventListener("change", () =>{
    document.getElementById("searchBar").placeholder = document.getElementById("searchCriteria").value +"...";

  });
  searchBtn.addEventListener("click",search)
  logingBtn.addEventListener("click", logIn);
}
//function that calls server and searches for movie information
function search(){
  let request = new XMLHttpRequest();
  let searchReq = document.getElementById("searchCriteria").value;
  let queryString;
  //If the dropdop menu is set to title
  if(searchReq === "Title"){
    //if the user entered an id
    if(/^\d+$/.test(document.getElementById("searchBar").value)){
      //search the database by ID
      queryString = "/movies:id?"+"&id=" +document.getElementById("searchBar").value;
    }else{
      //search the database by movie title
      queryString = "/movies?"+"&title=" +document.getElementById("searchBar").value;
    }
  //If the dropdown menu is set to person
  }else if(searchReq == "Person"){
    //if the user eneter an ID
    if(/^\d+$/.test(document.getElementById("searchBar").value)){
      //search the database by ID
      queryString = "/people:id?"+"&id=" + document.getElementById("searchBar").value;
    }else{
      //search the database by person name
      queryString = "/people?"+"&name=" + document.getElementById("searchBar").value;
    }
  }

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
