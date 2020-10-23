
//Purpose: validates the username and password for a new user.
  //password requirements: minimum 10 characters, one uppercase letter, and one digit
function createAccount(){
  let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{10,}$/;
  let userNameLength = document.getElementById("username").value.length;
  let isValidPass = reg.test(document.getElementById("password").value);
  //if username isn't valid dispaly error message
  if(userNameLength == 0){
    document.getElementById("errorMsg").style.display = "block";
    document.getElementById("errorMsg").innerHTML = "Entered an invalid username";

  }
  //if password isn't valid display error message
  else if(!isValidPass){
    document.getElementById("errorMsg").style.display = "block";
    document.getElementById("errorMsg").innerHTML = "Entered an invalid password. Passwords must be at least 10 characters" +
          " long, contain one uppercase letter, and one digit (0-9)";
  }
  //redirect to user page if all entries are valid
  else if(userNameLength > 1 && isValidPass){
    document.getElementById("errorMsg").style.display = "none";
    let request = new XMLHttpRequest();
    let queryString = "/logIn"
    request.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        window.open(queryString, "_self");
      }
    }
    request.open("GET",queryString);
    request.send();
  };
};



function  init(){
  let createAcc = document.getElementById("createAcc");
  let login = document.getElementById("login");
  login.addEventListener("click", function(){
    alert("Functionality Pending");
  });
  createAcc.addEventListener("click", createAccount);
};
