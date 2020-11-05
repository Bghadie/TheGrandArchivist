function init(){
  let logingBtn = document.getElementById('logIn');
  logingBtn.addEventListener("click", logIn);

}

//redirect to log in page
function logIn(){
  let request = new XMLHttpRequest();
  let queryString = "/loginPage"
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

//call the server to see if a person exists in the databse
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
}
//call the server to see if a movie exists in the databse
function findMovie(caller){
  let request = new XMLHttpRequest();

  let queryString = "/movies?title=" +caller.name;
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      console.log(caller.name);
      //redirect to that person's page if they're found
      window.open(queryString, "_self");
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}
