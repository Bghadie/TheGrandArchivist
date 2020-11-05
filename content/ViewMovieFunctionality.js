function init(){
  getRecommendedGeneral();
  let logingBtn = document.getElementById('logIn');
  let addReviewBtn = document.getElementById("addReview");
  logingBtn.addEventListener("click", logIn);
  addReviewBtn.addEventListener("click", addReview)
}

//redirect to log in page
function logIn(){
  let request = new XMLHttpRequest();
  let queryString = "/loginPage"
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //redirect to that person's page if they're found
      console.log(queryString)
      window.open(queryString, "_self");
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}

function findMovie(caller){
  let request = new XMLHttpRequest();
  console.log(caller.name)
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


function getRecommendedGeneral(){
  let request = new XMLHttpRequest();
  let urlParams = new URLSearchParams(window.location.search)
  let title = urlParams.get("title");
  let year = (document.getElementsByTagName("releaseyear")[0].innerHTML);
  year = year.slice(year.length-4);
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //redirect to that person's page if they're found
      document.getElementsByTagName("similarMovies")[0].innerHTML = this.response;
    }
  }

  let queryString = "/recommendMovieGeneral?info=" + title+","+year;
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}
function addReview(){
  alert("functionality pending");
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

function findGenre(caller){
  let request = new XMLHttpRequest();
  let queryString = "/genre?genre=" +caller.name;
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
