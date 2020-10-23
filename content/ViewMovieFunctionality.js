function init(){
  let logingBtn = document.getElementById('logIn');
  let addReviewBtn = document.getElementById("addReview");


  logingBtn.addEventListener("click", logIn);
  addReviewBtn.addEventListener("click", addReview)
}

//redirects to the login page
function logIn(){
  document.location.replace("./HTMLFiles/Login_CreateAccountSkeleton.html");
}


function addReview(){
  alert("functionality pending");
}
//call the server to see if a person exists in the databse
function findPerson(caller, profession){
  let request = new XMLHttpRequest();
  let queryString = "/people?id=223&name=" +caller.name + "&profession=" +profession;
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //redirect to that person's page if they're found
      window.open(queryString, "_self");
    }
  }
  request.open("GET",queryString);
  request.send();

}
