
//Purpose: validates the username and password for a new user.
function createAccount(){
  let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  let userNameLength = document.getElementById("username").value.length;
  let isValidPass = reg.test(document.getElementById("password").value);
  if(userNameLength == 0){
    document.getElementById("errorMsg").style.display = "block";
    document.getElementById("errorMsg").innerHTML = "Entered an invalid username";

  }else if(!isValidPass){
    document.getElementById("errorMsg").style.display = "block";
    document.getElementById("errorMsg").innerHTML = "Entered an invalid password. Passwords must be at least 10 characters" +
          " long, contain one uppercase letter, and one digit (0-9)";
  }else if(userNameLength > 1 && isValidPass){
    document.getElementById("errorMsg").style.display = "none";
  };
};



function  init(){
  let login = document.getElementById("login");
  let createAcc = document.getElementById("createAcc");

  login.addEventListener("click", validate);
  createAcc.addEventListener("click", createAccount);
};
