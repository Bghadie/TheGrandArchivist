
function init(){
  let searchBar = document.getElementById("searchBar");
  let searchBtn = document.getElementById("search");
  let logingBtn = document.getElementById('logIn');
  let searchCriteria = document.getElementById("searchCriteria");
  searchCriteria.addEventListener("change", () =>{
    document.getElementById("searchBar").placeholder = document.getElementById("searchCriteria").value +"...";
  });
  searchBtn.addEventListener("click",search)
  logingBtn.addEventListener("click", logIn);
//  searchBar.addEventListener("clicl",autocomplete(searchBar));
}
//function that calls server and searches for movie information
function search(){
  let request = new XMLHttpRequest();
  let searchReq = document.getElementById("searchCriteria").value;
  let queryString;
  //If the dropdop menu is set to title
  if(searchReq === "Title"){
    //if the user entered an id
    if(/^\d+$/.test(document.getElementById("searchBar").value)){
      //search the database by ID
      queryString = "/movies:id?"+"&id=" +document.getElementById("searchBar").value + "&pageNum=0";
    }else{
      //search the database by movie title
      queryString = "/movies?"+"&title=" +document.getElementById("searchBar").value + "&pageNum=0";
    }
  //If the dropdown menu is set to person
  }else if(searchReq == "Person"){
    //if the user eneter an ID
    if(/^\d+$/.test(document.getElementById("searchBar").value)){
      //search the database by ID
      queryString = "/people:id?"+"&id=" + document.getElementById("searchBar").value + "&pageNum=0";
    }else{
      //search the database by person name
      queryString = "/people?"+"&name=" + document.getElementById("searchBar").value + "&pageNum=0";
    }
  }else if(searchReq == "Genre"){
    queryString = "/genre?&genre=" + document.getElementById("searchBar").value + "&pageNum=0";
  }else if(searchReq == "Rating"){
    queryString = "/review?&rating=" + document.getElementById("searchBar").value + "&pageNum=0";
  }else if (searchReq == "Year") {
    queryString = "/year?&year=" + document.getElementById("searchBar").value + "&pageNum=0";
  }
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      //replace the movie with what ever the server returns
      window.open(queryString, "_self");
    }
  }
  request.open("GET",queryString);
  request.setRequestHeader('Content-Type',"text/html")
  request.send();
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

/*function autocomplete(textinpt){
    let request = new XMLHttpRequest();
    request.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        let allTitle = JSON.parse(this.response);
        textinpt.addEventListener("input", function(event){
          let div1, div2;
          let value = this.value;
          closeAllLists();
          if(!value){return false;}
          div1 = document.createElement("DIV");
          div1.setAttribute("id", this.id + "autocomplete-list");
          div1.setAttribute("class", "autocomplete-items");
          this.parentNode.appendChild(div1);
          for(let index = 0; index < allTitle.length; index++){
            if(allTitle[index].substr(0,value.length).toUpperCase() === value.toUpperCase()){
              div2 = document.createElement("DIV");
              div2.innerHTML = "<strong>" + allTitle[index].substr(0,value.length) + "</strong>";
              div2.innerHTML += allTitle[index].substr(value.length);
              div2.innerHTML += "<input type = 'hidden' value = '"+allTitle[index]+"'>";
              div2.addEventListener("click",function(event){
                textinpt.value = this.getElementByTagName("input")[0].value;
                closeAllLists();
              });
              div1.appendChild(div2);
            }
          }
        });
        function closeAllLists(element){
          let x = document.getElementsByClassName("autocomplete-items");
          for(index in x.length){
            if(element !== x[index] && element !== textinpt){
              x[index].parentNode.removeChild(x[index]);
            }
          }
        }
        document.addEventListener("click", function(event){
          closeAllLists(event.target);
        });
      }
    }
    request.open("GET","/movieTitles");
    request.send();
}
*/
