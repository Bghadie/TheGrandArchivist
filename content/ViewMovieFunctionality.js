function init(){
  //get this movies similar films
  getSimilarMovies();
  checkLoggedIn();//check if the user is logged in
  //get all the buttons on the page
  let logingBtn = document.getElementById('logIn');
  let addReviewBtn = document.getElementById("addReview");
  let addPersonBtn = document.getElementById("addPerson");
  //set the appropriate event lisenters
  logingBtn.addEventListener("click", logIn);
  addReviewBtn.addEventListener("click", addReview)
  addPersonBtn.addEventListener("click", addPerson)
}

//redirect to log in page or back to their own account
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

//this is an attribute on all user's listed on this page
//if someone presses the user's name it redirects them to that user's page
function findUser(caller){
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

//this is an attribute on all movies's listed on this page
//if someone presses the movie's title it redirects them to that movie's page
function findMovie(caller){
  let request = new XMLHttpRequest();
  console.log(caller.name)
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

//this is an attribute on all people's listed on this page
//if someone presses the person's name it redirects them to that person's page
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

//this is an attribute on all genres's listed on this page
//if someone presses the genre it redirects them to a list of movies with similar
//genres
function findGenre(caller){
  let request = new XMLHttpRequest();
  let queryString = "/movies?genre=" +caller.name;
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

//this function is... temporary in its functionality. Basically it calls the
//server and gets a list of similar movies based on my algorithm (see read me)
//then, it takes the rendered pug file that the server responses with and puts it
//in the "you may also like" section of the page. Its very slow becuase it does this
//dynamically EVERY TIME (something I will fix)
function getSimilarMovies(){
  let request = new XMLHttpRequest();
  let urlParams = new URLSearchParams(window.location.search);
  let title = document.getElementById("title").innerHTML;
  let year = (document.getElementsByTagName("releaseyear")[0].innerHTML);
  year = year.slice(year.length-4);
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      document.getElementsByTagName("similarMovies")[0].innerHTML = this.response;
    }
  }

  let queryString = "/recommendMovieGeneral?info=" + title+","+year;
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}

//this function is used to add reviews to the current movie. If the button is
//pressed it redirects the user back to the add review page
function addReview(){
  let request = new XMLHttpRequest();
  let queryString = "/addReviewPage?&title=" + document.getElementById("title").innerHTML;
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

//this function is used to add a person to the current movie. If the button is
//pressed it redirects the user back to the add person page
function addPerson(){
  let request = new XMLHttpRequest();
  let queryString = "/addPersonPage?&title=" + document.getElementById("title").innerHTML;
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

//this function checks if the current user is logged in
function checkLoggedIn(){
  let request = new XMLHttpRequest();
  let queryString = "/checkLoggedIn";
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //they are logged in, let them add a review to the movie if they want
      //change the log in button to redirect the user back to their account
      //page
      document.getElementById('logIn').value = "Back To Account";
      document.getElementById("addReview").disabled = false;
      checkContributing(); //check if they are a contributing user
    }else{
      //they aren't logged in, do NOT let them add a review or person
      //change the log in button to redirect the user to the log in page
      document.getElementById('logIn').value = "Login/Sign Up";
      document.getElementById("addReview").disabled = true;
      document.getElementById("addPerson").disabled = true;
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}

//this checks if the user is a contributing user. If they are, then let them
//add a person to the movie
function checkContributing(){
  let request = new XMLHttpRequest();
  let queryString = "/checkContributing";
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      document.getElementById("addPerson").disabled = false;
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}
