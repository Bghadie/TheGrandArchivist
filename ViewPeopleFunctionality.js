function init(){
  let logingBtn = document.getElementById('logIn');
  logingBtn.addEventListener("click", logIn);

}

//redirect to log in page
function logIn(){
  document.location.replace("./HTMLFiles/Login_CreateAccountSkeleton.html");
}
