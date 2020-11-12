function init(){
  //check if the user is logged in
  checkLoggedIn();
  //check if the user is visiting another user's page
  checkVisitingUserPage();

  //get all buttons and set the appropriate event handlers
  let login_logout_btn = document.getElementById("logout");
  let followBtn = document.getElementById("stopfollowing");

  let userType = document.getElementById("usertype");//this is actually a checkbox
  followBtn.addEventListener("click", follow_unfollow);
  login_logout_btn.addEventListener("click", login_logout);
  userType.addEventListener("click", switchUserType);
}
//this functions checks if the user has any alerts that need to be displayed
function checkAlerts(){
  let request = new XMLHttpRequest();
  let queryString = "/checkForAlerts";
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //the user has alerts iterate through each one and display them
      let alertsToDisplay = JSON.parse(this.response);
      for(let i = 0; i < alertsToDisplay.alerts.length; i++){
        alert(alertsToDisplay.alerts[i]);
      }
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"application/json")
  request.send();
}

//this function handles the follow/unfollow button click
function follow_unfollow(){
  let request = new XMLHttpRequest();
  //set the query string to have the current user and the user to follow/unfollows
  //username
  let queryString = "/followUnfollowUser?&follow=" + document.getElementById("stopfollowing").innerHTML +
    "&user=" + document.getElementById("currUser").innerHTML;
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //whether or not the calling user is following this current user
      //has been toggled. Switch the button label accordingly
      if(document.getElementById("stopfollowing").innerHTML === "Stop Following"){
        document.getElementById("stopfollowing").innerHTML = "Follow";
      }else{
        document.getElementById("stopfollowing").innerHTML = "Stop Following";
      }
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
      document.getElementById("logout").innerHTML = "Back to Account";
      document.getElementById("stopfollowing").disabled = false;
    }else{
      //they aren't logged in, don't let them follow the current user and
      //set the log in button accordingly
      document.getElementById("logout").innerHTML = "Login/Sign Up";
      document.getElementById("stopfollowing").disabled = true;
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}

//if the user presses the "contributing user" checkbox, toggle their user type
function switchUserType(){
  let request = new XMLHttpRequest();
  let queryString = "/switchUserType";
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //do nothing
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
//this function is an attribute off all user's on this page. If the user presses
//the name of any other user, it redirects them to that user's page
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
};

//this function does one of two things. If the user isn't logged OR are viewing
//another user's page in it redirects them to the login page. if they are logged
//in AND viewing their own account, it lets them logout
function login_logout(){
    let queryString;
    let request = new XMLHttpRequest();
    request.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        //replace the movie with what ever the server returns
        window.open(queryString, "_self");
      }
    }
    if(document.getElementById("logout").innerHTML === "Login/Sign Up"){
      queryString = "/loginPage";
    }else if (document.getElementById("logout").innerHTML === "Logout"){
      queryString = "/logout";
    }else{
      queryString = "/userPage";

    }
    request.open("GET",queryString);
    request.setRequestHeader('Content-Type',"text/html")
    request.send();
};

//this function checks if the current user is visiting another user's page
function checkVisitingUserPage(){
  let currUser = document.getElementById("currUser").innerHTML;
  let request = new XMLHttpRequest();
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //they are viewing their own page, set the button to let the user log out
      //hide the stop following button
      document.getElementById("logout").innerHTML = "Logout";
      document.getElementById("stopfollowing").hidden = true;
      document.getElementById("buttonBreakLine").style.flexBasis = "100%";//this is a stylistic thing
      checkAlerts();
    }if(this.readyState == 4 && this.status == 430){
      //the current user is viewing another user's page, don't let them switch
      //the user type
      document.getElementById("usertype").disabled = true;
      checkFollowCurrentUser(currUser)//check if they are following this user
    }
  }
  request.open("GET","/checkCurrUser?user="+currUser);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
};

//check if the current user is following the user they are visiting
function checkFollowCurrentUser(currUser){
  let request = new XMLHttpRequest();
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //they are following the user, change the buttom to be "stop following"
      document.getElementById("stopfollowing").innerHTML = "Stop Following";
    }else{
      //they aren't, change the buttom to let let user's follow the user
      document.getElementById("stopfollowing").innerHTML = "Follow";
    }
  }
  request.open("GET","/isFollowingUser?user="+currUser);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}
