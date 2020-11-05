function  init(){
  let createAcc = document.getElementById("createAcc");
  let login = document.getElementById("login");
  login.addEventListener("click", logUserIn);
  createAcc.addEventListener("click", createAccount);
};

//Purpose: validates the username and password for a new user.
  //password requirements: minimum 10 characters, one uppercase letter, and one digit
function createAccount(){
  let obj = {"username": document.getElementById("username").value, "password": document.getElementById("password").value};
  let request = new XMLHttpRequest();
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 440){
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerHTML = "Entered an invalid username";
    }else if(this.readyState == 4 && this.status == 441){
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerHTML = "Username Already Exists";
    }else if(this.readyState == 4 && this.status == 442){
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerHTML = "Entered an invalid password. Passwords must be at least 10 characters" +
            " long, contain one uppercase letter, and one digit (0-9)";
    }else{
      document.getElementById("errorMsg").style.display = "none";
      goToUserPage(obj.username);

    }
  }
  request.open("POST", "/createAccount");
  request.setRequestHeader('Content-Type',"application/json")
  request.send(JSON.stringify(obj));
};
function logUserIn(){
  let request = new XMLHttpRequest();
  let obj = {"username": document.getElementById("username").value, "password": document.getElementById("password").value};
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 440){
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerHTML = "Entered an invalid username";
    }else if(this.readyState == 4 && this.status == 442){
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerHTML = "Entered an invalid password";
    }else{
      document.getElementById("errorMsg").style.display = "none";
      goToUserPage(obj.username);
    }
  }
  request.open("POST", "/loginUser");
  request.setRequestHeader('Content-Type',"application/json")
  request.send(JSON.stringify(obj));
};


function goToUserPage(username){
  let request = new XMLHttpRequest();
  let queryString = "/userPage?username=" + username;
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //redirect to that person's page if they're found
      window.open(queryString, "_self");
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
};
