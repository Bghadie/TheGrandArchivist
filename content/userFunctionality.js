function init(){
  let logoutBtn = document.getElementById("logout");
  logoutBtn.addEventListener("click", logout)
  checkVisitingUserPage();

}
function findMovie(caller){
  let request = new XMLHttpRequest();
  let queryString = "/movies?title=" +caller.name;
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //redirect to that person's page if they're found
      window.open(queryString, "_self");
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}
function findPerson(caller){
  let request = new XMLHttpRequest();
  let queryString = "/people?name=" +caller.name;
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

function logout(){
    let request = new XMLHttpRequest();
    request.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        //redirect to that person's page if they're found
        window.open("/", "_self");
      }
    }
    request.open("GET","/logout");
    request.setRequestHeader('Content-Type',"text/html")
    request.send();
};
function checkVisitingUserPage(){
  let currUser = document.getElementById("currUser").innerHTML;
  let request = new XMLHttpRequest();
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      document.getElementById("stopfollowing").hidden = true;
      document.getElementById("buttonBreakLine").style.flexBasis = "100%";
    }if(this.readyState == 4 && this.status == 430){
      document.getElementById("logout").hidden = true;
    }
  }
  request.open("GET","/checkCurrUser?user="+currUser);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
};
