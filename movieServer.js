
//Get the required modules
const express = require("express");
const app = express();
const pug = require("pug");
const {PythonShell} = require('python-shell');
const session = require('express-session');
const cookieParser = require('cookie-parser');
//set the port
const port = 3000;


//NOTE Movie id's are any integer from 1 - 999999
//NOTE people id' are any integer from 1000000+
//get the movie and people database
const peopleDatabase = require("./content/peopleDatabase");
const movieDatabase = require("./content/movieDatabase");
//const movieDatabase = createmovieDatabase(moviesDataBase); //movie database
//const peopleDatabase = createpeopleDatabaseWithID(moviesDataBase); //people database
/* what follows is all the testing code just delete comments to run test*/
//create some random users

//NOTE, for simplicity's sake, a users "ID" is their username
const allUsers ={
  'IllumaDaddy': {password:"notsafepassy", contributing: false, followingUsers: ["JoestInTime", "John", "James"], followingPeople:["Tom Hanks"],reviews:{"Toy Story":{score: 10, review: "Best movies I've never seen"}},recommendedMovies:[]},
  'JoestInTime': {password:"somesafepassword", contributing: true, followingUsers: [], followingPeople:["Pete Docter"], reviews:{"Up":{score: 3, review: "s"}},recommendedMovies:[]}
};

/****************************************
*THE FOLLOWING COMMENTED OUT CODE IS for*
*      TESTING MY BUISNESS LOGIC        *
*   There are 8 such tests, basically   *
*  remove the comments of surround any  *
* given code (I'd do one at a time) and *
*  run the server to see if they work.  *
*Feel free to play around with the tests*
*****************************************/


//test 1, Check that reviews can be added:


addReview("IllumaDaddy", "Toy Story", {score:10, review:"YAY"});
addReview("IllumaDaddy", "Coraline", {score:10, review:"I have watched this movie A LOT"});
addReview("JoestInTime", "Toy Story", {score:7, review:"YAY"});
addReview("JoestInTime", "Help!", {score:7, review:"YAY"});
let id = getIDByTitle(movieDatabase, "Toy Story")
//console.log(movieDatabase[id]); //Movie toy story should have a review now
//console.log(allUsers); //IllumaDaddy should have a review for movie with id 0 and 2




//test 2, check that a user can be added:
/*
createUser("halfnutella", "IamMarried")//should add user
createUser("IllumaDaddy", "I already exist")//should not add user
console.log(allUsers)//print the list of users and confirm
*/


//test 3, check that a movie can be addeds
/*
console.log(createMovie("Some Random Movie Title", "Ronald Bass", "Forest Whitaker", "Whitney Houston, Loretta Devine, Lela Rochon")); //add movie
let id = getIDByTitle(movieDatabase, "Some Random Movie Title")
console.log(movieDatabase[id]);
console.log(createMovie("Toy Story", "Ronald Bass", "Forest Whitaker", "Whitney Houston, Loretta")); //try to add movie with invalid entries (e.g., the movie already exists)
*/

//test 4, make someone a contirbuting user, prints true if user is a valid user
//and if they are made into contributing user. Prints false otherwise
/*
console.log(becomeContributingUser("IllumaDaddy")); //should print true
console.log(becomeContributingUser("I dont exist")); //should print false
*/


//test 5, make one user follow another
/*
console.log(allUsers); //should print unupdated users list
console.log(followUser("IllumaDaddy", "JoestInTime")); //prints true if both user's exist (should print true)
console.log(followUser("RobinBanks", "JoestInTime")); //prints true if both user's exist (should print false)
console.log(allUsers); //should print the updated users list with "IllumaDaddy" now following "JoestInTime"
*/

//test 6, make one user follow a person
/*
console.log(allUsers); //should print unpdated list of users
console.log(followPeople("IllumaDaddy", "Daniel Radcliffe")); //IllumaDaddy is now following Daniel Radcliffe. Returns True
console.log(followPeople("IllumaDaddy", "Gwen Stacy"));//returns false Gwen Stacy is not a person in the database
console.log(followPeople("Paul Rud", "Sean Bean")); // returns false Paul Rud is not a user in the database
console.log(allUsers);
*/

//test 7, add person to people database by specifying the persons name
//if person is in the database already, return false
/*
console.log(createPerson("Tom Honks")); //add Tom Honks (should return true)
console.log(createPerson("Dave Chapelle")); //add Dave Chapelle (should return true as I mispelt his name)
console.log(createPerson("Izabella Scorupco")); //already in database so won't be added (should return false)
*/

//test 8, tests adding a person to a movie. The person must be IN the people
//database for them to be added. So I just created a person called "Nick Suzuki"
//to act as a test
/*
//Try to follow Nick Suzuki, should return false as he is NOT in the database now
console.log(followPeople("IllumaDaddy", "Nick Suzuki"));
createPerson("Nick Suzuki"); //create a person

//Try to follow Nick Suzuki, should return true as he is in the database now
console.log(followPeople("IllumaDaddy", "Nick Suzuki"));

//add that person to a the movie Jumanji under each profession, each will return true
console.log(addPersonToMovie("Jumanji", "Nick Suzuki", "ACTOR"));
console.log(addPersonToMovie("Jumanji", "Nick Suzuki", "DIRECTOR"));
console.log(addPersonToMovie("Jumanji", "Nick Suzuki", "WRITER"));

//Go to localHost:3000 and search Jumanji, he should be in the list now

*/
/*END OF TESTING CODE */


function getListOfReviews(threshold){
  let matchedMovies = [];
  let count;
  let average;
  Object.keys(movieDatabase).forEach(function(id){
    sum = 0;
    if(Object.keys(movieDatabase[id].data.review).length === 0){
      average = 0;
    }else{
      count = Object.keys(movieDatabase[id].data.review).length;
      for(users of Object.keys(movieDatabase[id].data.review)){
        sum += movieDatabase[id].data.review[users].score;
      }
      average = sum/count
    }
    if(average >= threshold){
      matchedMovies.push(movieDatabase[id]);
    }
  });
  return matchedMovies;
}

function findMaxYear(){
  let max = 0;
  for(id of Object.keys(movieDatabase)){
    let year = parseInt(movieDatabase[id].data.Year.split("-"));
    if(year > max){
      max = year;
    }
  }
  return max;
}

function findMinYear(){
  let min = 3005; //some random number
  for(id of Object.keys(movieDatabase)){
    let year = parseInt(movieDatabase[id].data.Year.split("-"));
    if(year < min){
      min = year;
    }
  }
  return min;
}

function getAllTitles(){
  let titles = []
  Object.keys(movieDatabase).forEach(function(id) {
    titles.push(movieDatabase[id].data.Title);
  });
  return titles;
}

function findSimilarMovies(partialTitle, pageNum){
  let similarMovies = [];
  Object.keys(movieDatabase).forEach(function(id) {
    if((movieDatabase[id].data.Title.toUpperCase()).includes(partialTitle)){
      similarMovies.push(movieDatabase[id]);
    }
  });
  let numberOfItemsPerPage = 50;
  var start = ((pageNum+1) * numberOfItemsPerPage) - (numberOfItemsPerPage);
  return similarMovies.splice(start,50);
}

function findMaxPage(partialTitle){
  let similarMovies = [];
  Object.keys(movieDatabase).forEach(function(id) {
    if((movieDatabase[id].data.Title.toUpperCase()).includes(partialTitle)){
      similarMovies.push(movieDatabase[id]);
    }
  });
  if(similarMovies.length <=50){
    return 0;
  }else{
    return Math.floor(similarMovies.length/50);
  }
}
function findMaxGenre(genre){
  let similarGenres = [];
  if(genre.trim().includes(",")){
    genre = genre.trim().split(",");
  }else{
    genre = genre.trim().split(" ");
  }
  for(index in genre){
    genre[index] = genre[index].trim()
  }
  Object.keys(movieDatabase).forEach(function(id){
    let placeHolder = movieDatabase[id].data.Genre.toUpperCase().split(",");
    for(item in placeHolder){
      placeHolder[item] = placeHolder[item].trim();
    }
    let check = genre.every((value)=>
      placeHolder.includes(value));
    if(check){
      similarGenres.push(movieDatabase[id]);
    }
  });
  if(similarGenres.length <= 50){
    return 0;
  }else{
    return Math.floor(similarGenres.length/50);
  }
}

function findGenres(genre, pageNum){
  let similarGenres = [];
  if(genre.trim().includes(",")){
    genre = genre.trim().split(",");
  }else{
    genre = genre.trim().split(" ");
  }
  for(index in genre){
    genre[index] = genre[index].trim()
  }
  Object.keys(movieDatabase).forEach(function(id){
    let placeHolder = movieDatabase[id].data.Genre.toUpperCase().split(",");
    for(item in placeHolder){
      placeHolder[item] = placeHolder[item].trim();
    }
    let check = genre.every((value)=>
      placeHolder.includes(value));
    if(check){
      similarGenres.push(movieDatabase[id]);
    }
  });
  let numberOfItemsPerPage = 50;
  var start = ((pageNum+1) * numberOfItemsPerPage) - (numberOfItemsPerPage);
  return similarGenres.splice(start, 50);
}
/*
Assumption: the function takes a person's name and profession as a string
NOTE: the profession (i.e., ACTOR, DIRECTOR, or WRITER) should be entered in all caps
Purpose: Adds a person, if they exist in the database, to a movie. Also updates the person's work history
Returns: True is succesful false, otherwise
*/
function addPersonToMovie(movieTitle, personsName, personsProfession){
  //get the ID's of the user's input
  let personsID = getIDByName(peopleDatabase, personsName);
  let movieTitleID = getIDByTitle(movieDatabase, movieTitle);
  if(!(personsID && movieTitleID)){
    //the person isn't in the databse or the movie doesn't exist, return false
    return false;
  }
  //create a person object
  let personObject = peopleDatabase[personsID]
  //set the person objects information (e.g., profession and movie they've worked on)
  personObject.profession = personsProfession;
  personObject.films = movieTitle;

  //depending on their profession, put the person in the appropriate part of the  movie database
  if(personsProfession === "ACTOR"){
    movieDatabase[movieTitleID].data.Actors += (","+personsName);
  }else if (personsProfession === "DIRECTOR"){
    movieDatabase[movieTitleID].data.Director += (","+personsName);
  }else if (personsProfession === "WRITER"){
    movieDatabase[movieTitleID].data.Writer += (","+personsName);
  }
  return true;
}

/*
Assumption: the function takes a person's name a string
Purpose: Creates a person object and gives them an ID then stores them in the database
Returns: True is succesful false, otherwise
*/
function createPerson(personsName){
  let personID = getIDByName(peopleDatabase, personsName);
  if(personID){
    //if the person is already in the database don't add them, return false
    return false;
  }
  //add the person with a unique ID to the database
  peopleDatabase[Object.keys(peopleDatabase).length + 1000000] = {name:personsName}
  return true;
};


/*
Assuption: a movie title, and a string separated by (",") of actor name(s), director name(s), and writer name(s)
and adds them to a movie object and thus the movie database
Purpose: Creates a movie entry and adds it to the database
Returns: True if succesful, false otherwise
*/
function createMovie(title, writer, director, actor){
  //get all the users input into an array
  let givenWriter = writer.split(",");
  let givenDirector = director.split(",");
  let givenActor = actor.split(",");
  let givenMovieTitles = title.split(",")
  //declare arrays for all ID's
  let movieIDs = [];
  let writerIDs = [];
  let directorIDs = [];
  let actorIDs = [];
  //loop through every user inputted and store the IDs in the ID arrays
  for(writers of givenWriter){
    if(getIDByName(peopleDatabase, writers.trim())){
      writerIDs.push(getIDByName(peopleDatabase, writers.trim()));
    }
  }
  for(directors of givenDirector){
    if(getIDByName(peopleDatabase, directors.trim())){
      directorIDs.push(getIDByName(peopleDatabase, directors.trim()));
    }
  }
  for(actor of givenActor){
    if(getIDByName(peopleDatabase, actor.trim())){
      actorIDs.push(getIDByName(peopleDatabase, actor.trim()));
    }
  }
  for(films of givenMovieTitles){
    if(getIDByTitle(movieDatabase, title.trim())){
      movieIDs.push(getIDByTitle(movieDatabase, title.trim()));
    }
  }
  if(writerIDs.length === 0 || directorIDs.length === 0 || actorIDs.length === 0 || movieIDs.length > 0){
   //Validation checks. If:
      //user didn't entered at least one writer, actor, and directors
      //user entered a movie that was already in the moviesDataBase
      //return false
    return false;
  }
  //get a unique ID
  let id = Object.keys(movieDatabase).length;
  //att the movie to the database
  movieDatabase[id] = {data:{Title:title, Writer:writer, Director:director,Actors:actor}};
  return true;
};

/*
Assumption: the function takes a username as a string
Purpose: sets a user to be a contributing user
Returns true if succesful, false otherwise
*/
function becomeContributingUser(requestingUser){
  //if the calling user is in the database make them a contributing user
  if(getIDByUsername(allUsers, requestingUser)){
    allUsers[requestingUser].contributing = true;
    return true;
  }else{
    return false;
  }
};

/*
Assumption: the function takes a username as a string
Purpose: sets a user to be a regular user
Returns true if succesful, false otherwise
*/
function becomeRegularUser(requestingUser){
  //if the calling user is in the database make them a regular user
  if(getIDByUsername(allUsers, requestingUser)){
    allUsers[requestingUser].contributing = false;
    return true;
  }else{
    return false;
  }
};

/*
Assumption: the function is taking two usernames as strings
Purpose: adds a user to the calling user's following list
Returns true if succesful, false otherwise
*/
function followUser(requestingUser, userToFollow){
  //get both user's ID's
  let requestingUserID = getIDByUsername(allUsers, requestingUser);
  let userToFollowID = getIDByUsername(allUsers, userToFollow);
  //if either are not in the database, return false
  if(!(requestingUserID && userToFollowID)){
    return false;
  }
  //otherwise push the userTofollow into the calling user's follow list
  allUsers[requestingUser].followingUsers.push(userToFollowID);
  return true;


};

/*
Assumption: the function is taking a username and the name of the person to follow as strings
Purpose: adds a person to the calling user's following list
Returns true if succesful, false otherwise
*/
function followPeople(requestingUser, personToFollow){
  //get the user and person's ID
  let requestingUserID = getIDByUsername(allUsers, requestingUser);
  let personToFollowID = getIDByName(peopleDatabase, personToFollow);
  //if either doesn't exist in the databse, return false
  if(!(requestingUserID && personToFollowID)){
    return false;
  }
  //otherwise push the personToFollow into the calling's user's follow list
  allUsers[requestingUser].followingPeople.push(personToFollowID);
  return true;
};

/*
Assuption: the function takes a username and password as a string. If the username doesn't exist,
it add's the user
Purpsoe: create a user with the specified username and ID
Returns true if succesful, false otherwise
*/
function createUser(requestingUser, pass){
  //if the username is already in the database return false
  if(getIDByUsername(allUsers, requestingUser)){
    return false;
  }
  //create the user and add them to the all user's list
  allUsers[requestingUser] = {password:pass}
  //set them to regular user by defauls
  allUsers[requestingUser].contributing = false;
  return true;
};


/*
Assuption: the function takes a username as a string, a movie name as a string, and a review object (e.g., a number and a review)
Purpose: adds a review to a movie
Returns true if succesful, false otherwise
*/
function addReview(requestingUser, movie, review){
  //get the movie ID and usernameID
  movieID = getIDByTitle(movieDatabase, movie);
  userID = getIDByUsername(allUsers, requestingUser);
  //if the user or movie don't exist, return false
  if(!movieID || !userID){
    return false;
  }
  //add the review to the movie in the moviedatabase
  movieDatabase[movieID].data.review[requestingUser] = review;
  //add the review to the user in the user database
  allUsers[userID].reviews[movieDatabase[movieID].data.Title] = review;
  return true;
};

//Assumption: some person object and some list
//Purpose: checks to see if a person is stored in a list
//Returns true if succesful, false otherwise
function containsObject(person, list){
  //iterate over the list items
  for(item in list){
    //if the list contains an entry that matches the provided person's name and professions
    //return true
    if(person.name === list[item].name && person.profession === list[item].profession){
      return true;
    }
  }
  //the person isn't in the list return false
  return false;
}


//Assumption: some person object
//Purpose: removes paratheses from a writers name
//Returns The person object without paratheses (some writer names have paraentheses in them)
function removePara(personObj){
  //create an empty name string
  let newName = ""
  //iterate over the letter indexes of the person objects name
  for(letters in personObj.name){
    //check each letter and if its a parentheses quit the loop
    if(personObj.name[letters] === "("){
      break;
    }
    //append the letter to the empty name string
    newName+=personObj.name[letters];
  }
  //set the person object's name to the edited name
  personObj.name = newName.trim();
  //return the person object
  return personObj;
}

//Assumption: some person name
//Purpose: removes paratheses from a writers name
//Returns The person object without paratheses (some writer names have paraentheses in them)
function removePara(name){
  //create an empty name string
  let newName = ""
  //iterate over the letter indexes of the person objects name
  for(letters in name){
    //check each letter and if its a parentheses quit the loop
    if(name[letters] === "("){
      break;
    }
    //append the letter to the empty name string
    newName+=name[letters];
  }
  //return the person object
  return newName;
}


//Assumptions: takes the approrpaite value (e.g., title as a string, username as a string, and person name as a string)
//and the object that the value should be stored in (e.g., a database)
//Purpose: finds the key of a specific value in a database
//Returns: the key if its found, otherwise null
//NOTE this way, by calling these helper functions I will either get the Key I need or
//get null, making it perfect for branching structures
function getIDByTitle(object, value) {
  return Object.keys(object).find(key => JSON.stringify(object[key].data.Title.toUpperCase()) === JSON.stringify(value.toUpperCase()));
}
function getIDByUsername(object, value) {
  return Object.keys(object).find(key => JSON.stringify(key.toUpperCase()) === JSON.stringify(value.toUpperCase()));
}
function getIDByName(object, value) {
  return Object.keys(object).find(key => JSON.stringify(object[key].name.toUpperCase()) === JSON.stringify(value.toUpperCase()));
}

//Assumption, takes some ID and a flag
//Purpose: checks to see if the ID the user is looking for is valid
//Returns true if succesful, false otherwise
//NOTE this function is used for when a user enters an ID when searching for a movie/person
//Therefore, it checks to make sure that the user entered a valid ID
//The flag tells the program whether the ID belongs to a movie (1), person (2) or user (3)
function isValidId(someID, flag){
  //check if movie ID is valid
  if(flag === 1){
    if(Object.keys(movieDatabase).length > someID){
      return true;
    }else{
      return false;
    }
  }
  //check if person ID is valid
  if(flag === 2){
    if((Object.keys(peopleDatabase).length+1000000) > someID && someID >= 1000000){
      return true;
    }else{
      return false;
    }
  }
  //check if username is valid
  if(flag === 3){
    if(getIDByUsername(allUsers, someID)){
      return true;
    }else{
      return false;
    }
  }
}



//Assumptions: takes some object of objects list
//Purpose: sorts the object of objects list by their values
//Returns: the sorted array
function sortArray(someObjectList){
  let keyArray = Object.keys(someObjectList);
  let fixedSort = keyArray.sort((a,b)=>{
    //this is my specified sort function
    if(someObjectList[a] > someObjectList[b]){
      return 1;
    }
    return -1;
  });
  return fixedSort
}

//Assumptions: the function takes a person's name as a string
//Purpose: finds all the films the person has worked on
//Returns: returns a list of all the films the person has worked on
function findWork(name){
  let id = getIDByName(peopleDatabase, name);
  let arrayOfWork = [];
  //return the list of films the person has worked on
  for(works of peopleDatabase[id].films.split(",")){
    if(!(arrayOfWork.includes(works))){
      arrayOfWork.push(works);
    }
  }
  return arrayOfWork;
}

//Assumptions: takes the name of a person as a string and a person's database
//Purpose: checks to see if a person worked on a particular movie. If they have
//Go through every profession and store each person in that profession in an object array
//Also keep track of how many times the person given to the function has worked with each person
//basically, the object looks like {nameOfCoworker:numberOfTimesWorkedWith}
//Returns: an object of all the peron's coworkers and how many times they have worked together
function findCoworker(personDatabase, name){
  array = {};
  for(key of Object.keys(movieDatabase)){
    for(works of personDatabase){
        if(movieDatabase[key].data.Title === works){
          for(actors of movieDatabase[key].data.Actors.split(",")){
            array[actors] = array[actors] ? array[actors]+1 : 1;
          }
          for(directors of movieDatabase[key].data.Director.split(",")){
            array[directors] = array[directors]?array[directors]+1:1;
          }
          for(writers of movieDatabase[key].data.Writer.split(",")){
            array[writers] = array[writers]?array[writers]+1:1;
          }
        }
    }
  }
  return array;
}

function auth(req,res,next){
  if(!req.session.loggedIn){
    res.status(401).send("Unauthorized Access");
    return;
  }else{
    next();
  }
}
//set the directory
app.use(express.static(__dirname))
app.set('view engine', "pug");
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: "Issa Secret",
  username: "SomeID",
  cookie:{
    maxAge: 2*60*60*1000 //session expires in 2 hours
   }
}));



app.use(function(req, res, next){
  console.log("----------------------------");
  console.log("Request Method: " + req.method)
  console.log("Request URL: " + req.url)
  console.log("Request Path: " + req.path)
  console.log();
  console.log(req.session)
  next();
});


//These are my server's get methods, all are pretty straight
//forward but I included some comments for clarity
app.get("/", (req, res) => {
  res.render("HomePage",{});
});

app.get("/movieTitles", (req, res) =>{
  let allTitles = getAllTitles();
  res.write(JSON.stringify(allTitles));
  res.end();
});

app.get("/movies", (req, res) =>{
  let movie = getIDByTitle(movieDatabase,req.query.title); //basically a flag variable
  //if the movie is in the database, render it otherwise render a random movie
  if(movie){
    res.render("ViewMovie",{"someMovie":movieDatabase[movie].data});
  }else{
    let moviesByTitle = findSimilarMovies(req.query.title.toUpperCase(), parseInt(req.query.pageNum));
    if(moviesByTitle.length > 0 && req.query.title !== ""){
      res.render("ViewMovieList",{"someMovies":moviesByTitle, "searchCriteria": req.query.title});
    }else{
      res.statusCode = 404;
      res.end();
    }
  }
});
app.get("/movies:id", (req, res) =>{
  let id = parseInt(req.query.id); //get the ID the user searched for
  if(isValidId(id, 1)){ //check if its a valid ID
    res.render("ViewMovie",{"someMovie":movieDatabase[id].data});
  }
});
app.get("/people", (req,res)=>{
  let queryName = removePara(req.query.name); //get the name the user entered
  if(getIDByName(peopleDatabase, queryName.trim())){
    let id = getIDByName(peopleDatabase, queryName.trim()); //get the person's ID
    let allWork = findWork(queryName.trim())
    let profession = peopleDatabase[id].profession; //get their profession
    let sortAllCollabs = sortArray(findCoworker(allWork, queryName)); //sort their collaboration by most frequent
    //render the page
    res.render("ViewPerson",{"allWorks":allWork, "personsName":queryName, "personsProfession":peopleDatabase[id].profession, "collaberations":sortAllCollabs});
  }
});
app.get("/people:id", (req,res)=>{
  let id = parseInt(req.query.id); //convert the ID into an int
  if(isValidId(id,2)){ //check that its valid
    console.log(id)
    let profession = peopleDatabase[id].profession; //get their profession
    let allWork = findWork(peopleDatabase[id].name.trim())
    let sortAllCollabs = sortArray(findCoworker(allWork, peopleDatabase[id].name)); //sort their collaboration by most frequent
    //render the page
    res.render("ViewPerson",{"allWorks":allWork, "personsName":peopleDatabase[id].name, "personsProfession":peopleDatabase[id].profession, "collaberations":sortAllCollabs});
  }
});

app.get("/genre", (req,res) =>{
  let listOfMovies = findGenres(req.query.genre.toUpperCase(), parseInt(req.query.pageNum));
  if(listOfMovies){
    if(listOfMovies.length > 0){
      res.render("ViewGenre",{"someMovies":listOfMovies, "searchCriteria": req.query.genre});
    }else{
      res.statusCode = 404;
      res.end();
    }
  }else{
    res.statusCode = 404;
    res.end();
  }
});

app.get("/review",(req,res) =>{
  let threshold = parseFloat(req.query.rating);
  if(threshold >=0){
    let matchedMovies = getListOfReviews(threshold);
    let criteria = "Movies with Rating of at least " + threshold
    let numberOfItemsPerPage = 50;
    let start = ((parseInt(req.query.pageNum)+1) * numberOfItemsPerPage) - (numberOfItemsPerPage);
    res.render("ViewMovieList",{"someMovies":matchedMovies.splice(start,50), "searchCriteria": criteria});
  }else{
    res.statusCode = 404;
    res.end();
  }
});
app.get("/year",(req,res) =>{
  let threshold = parseInt(req.query.year);
  let minimumYear = findMinYear();
  let maximumYear = findMaxYear();
  let matchedMovies = [];
  let criteria;
  if(threshold >= minimumYear && threshold <= maximumYear){
    Object.keys(movieDatabase).forEach(function(id){
      let year = parseInt(movieDatabase[id].data.Year.split("–"));
      if(year === threshold){
        matchedMovies.push(movieDatabase[id]);
      }
    });
   criteria = threshold
  }else{
    Object.keys(movieDatabase).forEach(function(id){
      matchedMovies.push(movieDatabase[id]);
    });
    criteria = "Any Year"
  }
  let numberOfItemsPerPage = 50;
  let start = ((parseInt(req.query.pageNum)+1) * numberOfItemsPerPage) - (numberOfItemsPerPage);
  res.render("ViewMovieList",{"someMovies":matchedMovies.splice(start,50), "searchCriteria": criteria});

});
app.get("/findMaxPageMovie", (req,res) =>{
  let maxPageNum = findMaxPage(req.query.title.toUpperCase());
  res.end(maxPageNum.toString());
});
app.get("/findMaxPageGenre", (req,res) =>{
  let maxPageNum = findMaxGenre(req.query.genre.toUpperCase());
  res.end(maxPageNum.toString());
});

app.get("/findMaxPageYear", (req,res) =>{
  let threshold = parseInt(req.query.year);
  let minimumYear = findMinYear();
  let maximumYear = findMaxYear();
  let matchedMovies = [];
  let criteria;
  if(threshold >= minimumYear && threshold <= maximumYear){
    Object.keys(movieDatabase).forEach(function(id){
      let year = parseInt(movieDatabase[id].data.Year.split("–"));
      if(year === threshold){
        matchedMovies.push(movieDatabase[id]);
      }
    });
  }else{
    Object.keys(movieDatabase).forEach(function(id){
      matchedMovies.push(movieDatabase[id]);
    });
  }
  if(matchedMovies.length <=50){
    res.end("0");
  }else{
    let maxPage = Math.floor((matchedMovies.length)/50);
    res.end(maxPage.toString());
  }
});

app.get("/findMaxPageRating", (req,res) =>{
  let threshold = parseFloat(req.query.rating);
  let matchedMovies = getListOfReviews(threshold);
  if(matchedMovies.length <=50){
    res.end("0");
  }else{
    let maxPage = Math.floor((matchedMovies.length)/50);
    res.end(maxPage.toString());
  }
});

/*
shout out to:
https://github.com/extrabacon/python-shell
allowed me to create a shell to run my python script
Assumption: takes a string consisting of MovieTitle,MovieYear as an argument
*/
app.get("/recommendMovieGeneral",(req, res) =>{
  let someString = req.query.info;
  let movieExists = getIDByTitle(movieDatabase, someString.split(",")[0]);
  if(movieExists){
    let pyshell = new PythonShell("movieRecommender.py");
    pyshell.send(someString)
    pyshell.on('message', function(message){
      let arr = message.split("|").filter(function(e){
        return e !== "";
      });
      let movieObjs = []
      for(titles of arr){
        movieObjs.push(movieDatabase[getIDByTitle(movieDatabase,titles)].data);
      }
      res.render("ReccMovieGen", {"someMovies":movieObjs});
    });
    pyshell.end(function(err,code,signal){
      //these exist for testing purposes
    /*  console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
      console.log('finished');*/
    });
  }
});


app.post("/createAccount", (req, res) =>{
  let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{10,}$/;
  let username= req.body.username;
  let password = req.body.password;
  let isValidPass = reg.test(password);
  //if username isn't valid dispaly error message
  if(username.length == 0){
    res.statusCode = 440; //entered an invalid username
    res.end()
  }else if(getIDByUsername(allUsers, username)){
    res.statusCode = 441; //user already exists
    res.end()
  }else if(!isValidPass){ //if password isn't valid display error message
    res.statusCode = 442; //invalid password
    res.end()
  }else{
    allUsers[username] = {password:password, contributing: false, followingUsers: [], followingPeople:[], recommendedMovies:[],reviews:{}};
    req.session.username = getIDByUsername(allUsers, username);
    req.session.loggedIn = true;
    req.session.username = username;
    res.send();
  }
});

app.get("/userPage", auth ,(req,res)=>{
  res.render("ViewUsers",{"someUser":allUsers[req.query.username], "name": req.query.username});
});
app.get("/loginPage", (req, res) =>{
  res.render("ViewLoginPage",{});
});
app.post("/loginUser", (req, res) =>{
  let username= req.body.username;
  let password = req.body.password;
  if(getIDByUsername(allUsers, username)){
    if(allUsers[username].password === password){
      req.session.loggedIn = true;
      req.session.username = username;
      res.send();
    }else{
      res.statusCode = 442; //invalid password
      res.end()
    }
  }else{
    res.statusCode = 440; //entered an invalid username
    res.end()
  }
});
app.get("/logout", auth, (req, res)=>{
  req.session.destroy();
  res.render("HomePage",{});
});
app.get("/checkCurrUser",auth,(req, res)=>{
  if(req.session.username === req.query.user){
    res.statusCode = 200;
    res.end();
  }else{
    res.statusCode = 430
    res.end();
  }
})

app.listen(port, ()=>{
  console.log("Currently Listening at http:/localHost: " + port)
});
