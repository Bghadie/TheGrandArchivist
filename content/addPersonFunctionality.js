function init(){
  //get the add person button and add an appropriate event listener
  let addPersonBtn = document.getElementById("addPerson");
  addPersonBtn.addEventListener("click", submitPerson);
}

//attempt to add the person to either the movie or the database
function submitPerson(){
  let request = new XMLHttpRequest();
  let queryString;
  //if there is no "movie title" length (i.e., no title at all)
  //then the person is being added to the database, so set the appropriate route
  if(document.getElementById("title").title.length > 0){
    queryString = "/addPersonToMovie?&title=" + document.getElementById("title").title;
  }else{
    queryString = "/addPersonToDatabase?&title=" + document.getElementById("title").title;
  }
  //create the person object
  let obj = {profession:document.getElementById("profession").value, name:document.getElementById("name").value};
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //the person has been successfully added to either the database or the movie
      if(document.getElementById("title").title === ""){
        //the user has been added to the database, go back to the homepage
        window.open("http://localhost:3000/", "_self");
      }else{
        //the user has been added to the movie, go back to the movie page
        goToMoviePage();
      }
    }else if(this.readyState == 4 && this.status == 490){
      //The user tried to add someone to a movie who doesn't exist
      //display the appropriate error message
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerHTML ="The person doesn't exists in the database";
    }else if(this.readyState == 4 && this.status == 491){
      //the user tried to input an invalid profession
      //display the appropriate error message
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerHTML ="Please enter a valid profession (actor, director, or writer)";
    }else if(this.readyState == 4 && this.status == 492){
      //the user tried to add someone who already exists into the database
      //display the appropriate error message
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerHTML ="The person already exists in the database";
    }
  }
  request.open("POST",queryString);
  request.setRequestHeader('Content-Type',"application/json")
  request.send(JSON.stringify(obj));
}

//simple function that redirects users to the movie approrpriate movie page AFTER
//they've added a person to the movie
function goToMoviePage(){
  let request = new XMLHttpRequest();
  queryString = "/movies?"+"&title=" + document.getElementById("title").title;
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //replace the movie with what ever the server returns
      window.open(queryString, "_self");
    }
  }
  request.open("get",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}
