function init(){
  //get the add review button and set the appropriate event handler
  let addReviewBtn = document.getElementById("addReview");
  addReviewBtn.addEventListener("click", submitReview);
}

function submitReview(){
  let request = new XMLHttpRequest();
  let queryString = "/addReview?title=" + document.getElementById("title").title;
  //create a review object
  let obj = {score: document.getElementById("Score").value, review: document.getElementById("Review").value,
            summary: document.getElementById("Summary1").value};
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //the review has been added to the movie
      //any error message
      document.getElementById("errorMsg").style.display = "none";
      goToMoviePage();//this function redirects the webpage
    }else if(this.readyState == 4 && this.status == 480){
      //the user entered an invalid review (a number not within 0-10)
      //display the appropriate error message
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerHTML ="Please enter a number between 0 - 10";
    }else if(this.readyState == 4 && this.status == 481){
      //the user did not enter a valid full review
      //display the appropriate error message
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerHTML ="If you would like to leave a review layouts you must include a review and summary";
    }
  }
  request.open("POST",queryString);
  request.setRequestHeader('Content-Type',"application/json")
  request.send(JSON.stringify(obj));
}
//simple function that redirects the user back to the movie page they left a review on
function goToMoviePage(){
  let request = new XMLHttpRequest();
  queryString = "/movies?"+"&title=" + document.getElementById("title").title;
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //replace the movie with what ever the server returns
      window.open(queryString, "_self");
    }
  }
  request.open("get",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
}
