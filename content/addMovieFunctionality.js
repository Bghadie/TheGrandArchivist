function init(){
  //get the add movie button and add an event listener that attempts to add the movie
  addMovieBtn = document.getElementById("addMovie");
  addMovie.addEventListener("click", attemptToAddMovie);
}
function attemptToAddMovie(){
  let request = new XMLHttpRequest();
  //get all the information the user entered
  let title, actor, director, writer, year, summary, runtime, auto, queryString,genre,  obj;
  title = document.getElementById("Title").value;
  actor = document.getElementById("Actor").value;
  director = document.getElementById("Director").value;
  writer = document.getElementById("Writer").value;
  year = document.getElementById("Year").value;
  summary = document.getElementById("Summary").value;
  runtime = document.getElementById("Runtime").value;
  auto = document.getElementById("autoGenerate").value;
  genre = document.getElementById("Genre").value;
  //if the user wants to auto generate a bunch of movies to be added to the database, set the route accordingly
  if(parseInt(auto) > 0){
    queryString = "/addMovie:auto";
    obj = {"auto":auto}; //create an object with the number of movies to be added
  }else{
    //the user wants to enter a movie manually, set the route
    queryString = "/addMovie";
    //create an object with all the movie information
    obj = {title: title, actor:actor,director:director, writer: writer, year:year,
          summary:summary, runtime:runtime, genre:genre};
  }
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //the movie was added successfully, hide any error message and go to the homepage
      document.getElementById("errorMsg").style.display = "none";
      window.open("http://localhost:3000/", "_self");
    }else if(this.readyState == 4 && this.status == 451){
      //the user tried to add an already existing movie, display an error message
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerHTML = "The movie already exists";
    }else if(this.readyState == 4 && this.status == 452){
      //the user tried to add a none existing person to the movie, display an error message
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerHTML = "The actor or director or writer doesn't exist in the database";
    }else if(this.readyState == 4 && this.status == 453){
      //the user tried to add a none existing person to the movie, display an error message
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerHTML = "You must be a logged in contributing user to add a movie";
    }
  }

  request.open("POST", queryString);
  request.setRequestHeader('Content-Type',"application/json")
  request.send(JSON.stringify(obj));
}
