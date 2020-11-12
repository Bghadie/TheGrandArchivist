function init(){
  checkLoggedIn();//check if the user is logged in
  //get the log in button and follow check box
  let logingBtn = document.getElementById('logIn');
  let followUser = document.getElementById("follow");
  //add the appropriate event handler
  logingBtn.addEventListener("click", logIn);
  followUser.addEventListener("click", followPerson);
}

//if the user presses the follow person check box toggel whether or not they
//follow that person
function followPerson(){
  let request = new XMLHttpRequest();
  let queryString = "/followPerson?&name=" + document.getElementById("personsName").innerHTML + "&flag=";
  if(document.getElementById("follow").checked){
    queryString += "checked"
  }else{
    queryString += "unchecked"
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}

//redirect to log in page or back to their account
function logIn(){
  let request = new XMLHttpRequest();
  if("Back To Account" === document.getElementById('logIn').innerHTML){
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

//this function is an attribute off all people on this page. If the user presses
//the name of any person, it redirects them to that person's page
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
//this function is an attribute off all movies on this page. If the user presses
//the title of any movie, it redirects them to that movies page
function findMovie(caller){
  let request = new XMLHttpRequest();
  let queryString = "/movies?title=" +caller.name;
  console.log(queryString);
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
      //they are logged in, allow users to follow the current user they are viewing
      //change the log in button to redirect back to the logged in users account
      document.getElementById('logIn').innerHTML = "Back To Account";
      document.getElementById("follow").disabled = false;
      checkIfFollowing();
    }else{
      //they aren't logged in, don't let them follow the current user and
      //set the log in button accordingly
      document.getElementById('logIn').innerHTML = "Login/Sign Up";
      document.getElementById("follow").disabled = true;
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}

//this function checks if the user is following the current person
function checkIfFollowing(){
  let request = new XMLHttpRequest();
  let queryString = "/checkIfFollowing?&name=" + document.getElementById("personsName").innerHTML;
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //they are, set the check box to true (AKA checked)
      document.getElementById("follow").checked = true;
    }else{
      //they aren't following this person, set the check box to false (AKA unchecked)
      document.getElementById("follow").checked = false;
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}
