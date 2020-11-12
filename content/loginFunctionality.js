function  init(){
  //get the create account and login button and set the appropriate event handlers
  let createAcc = document.getElementById("createAcc");
  let login = document.getElementById("login");
  login.addEventListener("click", logUserIn);
  createAcc.addEventListener("click", createAccount);
};

//this function is used to create new accounts
function createAccount(){
  //create a user object
  let obj = {"username": document.getElementById("username").value, "password": document.getElementById("password").value};
  let request = new XMLHttpRequest();
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 440){
      //the user entered either a username that doesn't exist or tried to have an
      //empty string has a username
      //display the appropriate error message
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerHTML = "Entered an invalid username";
    }else if(this.readyState == 4 && this.status == 441){
      //the  user tried to create an account with a username that already exists
      //display the appropriate error message
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerHTML = "Username Already Exists";
    }else if(this.readyState == 4 && this.status == 442){
      //the user entered an invalid (not strong enough) password
      //display the appropriate error message
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerHTML = "Entered an invalid password. Passwords must be at least 8 characters" +
            " long, contain one uppercase letter, and one digit (0-9)";
    }else{
      //everything is valid, remove the error message
      document.getElementById("errorMsg").style.display = "none";
      goToUserPage(obj.username);//this redirects the user to their new account

    }
  }
  request.open("POST", "/createAccount");
  request.setRequestHeader('Content-Type',"application/json")
  request.send(JSON.stringify(obj));
};

//this function is used to login
function logUserIn(){
  let request = new XMLHttpRequest();
  //create a user object
  let obj = {"username": document.getElementById("username").value, "password": document.getElementById("password").value};
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 440){
      //the user entered either a username that doesn't exist or tried to have an
      //empty string has a username
      //display the appropriate error message
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerHTML = "Entered an invalid username";
    }else if(this.readyState == 4 && this.status == 442){
      //the user entered an invalid password
      //display the appropriate error message
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerHTML = "Entered an invalid password";
    }else{
      //everything the user entered is valid, hide all error messages
      document.getElementById("errorMsg").style.display = "none";
      goToUserPage(obj.username);//redirect the user to their account
    }
  }
  request.open("POST", "/loginUser");
  request.setRequestHeader('Content-Type',"application/json")
  request.send(JSON.stringify(obj));
};

//this function reidrects users to their user page
function goToUserPage(username){
  let request = new XMLHttpRequest();
  let queryString = "/userPage?username=" + username;
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
