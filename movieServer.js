//Get the required modules
const express = require("express");
const app = express();
const pug = require("pug");
//set the port
const port = 3000;

//NOTE Movie id's are any number from 1 - 999999
//NOTE people id' are any number from 1000000+



//get the movie and people database
const peopleDatabase = require("./peopleDatabase");
const movieDatabase = require("./movieDatabase");
//const movieDatabase = createmovieDatabase(moviesDataBase); //movie database
//const peopleDatabase = createpeopleDatabaseWithID(moviesDataBase); //people database
/* what follows is all the testing code just delete comments to run test*/
//create some random users
//NOTE, for simplicity's sake, a users "ID" is their username
const allUsers ={
  'IllumaDaddy': {password:"notsafepassy", contributing: false, followingUsers: ["JoestInTime", "John", "James"], followingPeople:{1000000:{name:"Tom Hanks"}},reviews:{2:{score: 10, review: "Best movies I've never seen"}}},
  'JoestInTime': {password:"somesafepassword", contributing: true, followingUsers: [], followingPeople:{1000000:{name:"Tom Hanks"}}, reviews:{8:{score: 3, review: "s"}}}
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
/*
addReview("IllumaDaddy", "Toy Story", {score:10, review:"YAY"});
let id = getIDByTitle(movieDatabase, "Toy Story")
console.log(movieDatabase[id]); //Movie toy story should have a review now
console.log(allUsers); //IllumaDaddy should have a review for movie with id 0 and 2
*/



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
function becomeContributingUser(user){
  //if the calling user is in the database make them a contributing user
  if(getIDByUsername(allUsers, user)){
    user.contributing = true;
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
function becomeRegularUser(user){
  //if the calling user is in the database make them a regular user
  if(getIDByUsername(allUsers, user)){
    user.contributing = false;
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
function followUser(currentUser, userToFollow){
  //get both user's ID's
  let currentUserID = getIDByUsername(allUsers, currentUser);
  let userToFollowID = getIDByUsername(allUsers, userToFollow);
  //if either are not in the database, return false
  if(!(currentUserID && userToFollowID)){
    return false;
  }
  //otherwise push the userTofollow into the calling user's follow list
  allUsers[currentUserID].followingUsers.push(userToFollowID);
  return true;


};

/*
Assumption: the function is taking a username and the name of the person to follow as strings
Purpose: adds a person to the calling user's following list
Returns true if succesful, false otherwise
*/
function followPeople(currentUser, personToFollow){
  //get the user and person's ID
  let currentUserID = getIDByUsername(allUsers, currentUser);
  let personToFollowID = getIDByName(peopleDatabase, personToFollow);
  //if either doesn't exist in the databse, return false
  if(!(currentUserID && personToFollowID)){
    return false;
  }
  //otherwise push the personToFollow into the calling's user's follow list
  allUsers[currentUserID].followingPeople[personToFollowID] = {name:personToFollow};
  return true;
};

/*
Assuption: the function takes a username and password as a string. If the username doesn't exist,
it add's the user
Purpsoe: create a user with the specified username and ID
Returns true if succesful, false otherwise
*/
function createUser(user, pass){
  //if the username is already in the database return false
  if(getIDByUsername(allUsers, user)){
    return false;
  }
  //create the user and add them to the all user's list
  allUsers[user] = {password:pass}
  //set them to regular user by defauls
  allUsers[user].contributing = false;
  return true;
};


/*
Assuption: the function takes a username as a string, a movie name as a string, and a review object (e.g., a number and a review)
Purpose: adds a review to a movie
Returns true if succesful, false otherwise
*/
function addReview(user, movie, review){
  //get the movie ID and usernameID
  movieID = getIDByTitle(movieDatabase, movie);
  userID = getIDByUsername(allUsers, user);
  //if the user or movie don't exist, return false
  if(!movieID || !userID){
    return false;
  }
  //add the review to the movie in the moviedatabase
  movieDatabase[movieID].data.reviews = review;
  //add the review to the user in the user database
  allUsers[userID].reviews[movieID] = review;
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
    if(movieDatabase.length+1000000 > someID){
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
  //return the list of films the person has worked on
  return peopleDatabase[id].films.split(",");
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


//set the directory
app.use(express.static(__dirname))


//These are my server's get methods, all are pretty straight
//forward but I included some comments for clarity
app.get("/", (req, res) => {
  let renderHome = pug.compileFile("./views/HomePage.pug");
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(renderHome({}));
});

app.get("/movies", (req, res) =>{
  let renderMovies = pug.compileFile("./views/ViewMovie.pug");
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  let movie = null; //basically a flag variable
  let id = parseInt(req.query.id, 10); //get the ID the user searched for
  if(isValidId(id, 1)){ //check if its a valid ID
    res.end(renderMovies({"someMovie":movieDatabase[id].data})); //if its vald, find the movie
  }else{
    //otherwise check if the movie title the user entered is in the database
    for(keys of Object.keys(movieDatabase)){
      if(req.query.title.toUpperCase() === movieDatabase[keys].data.Title.toUpperCase()){
        movie = movieDatabase[keys].data; //replace the null with a value
      }
    }
    //if the movie is in the database, render it otherwise render a random movie
    if(movie !== null){
      res.end(renderMovies({"someMovie":movie}));
    }else{
      let randNum = Math.floor((Math.random()*(Object.keys(movieDatabase).length - 1))+1);
      res.end(renderMovies({"someMovie":movieDatabase[randNum].data}));
    }
  }

});
app.get("/people", (req,res)=>{
  let renderPeople = pug.compileFile("./views/ViewPerson.pug");
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  let queryName = req.query.name;
  let name = ""
  //remove paratheses from query string
  for(letters of queryName){
    if(letters === "("){
      break;
    }else{
      name += letters;
    }
  }
  let profession = req.query.profession;
  let allWork = findWork(name.trim());
  let allCollabs = findCoworker(allWork, queryName);
  let sortAllCollabs = sortArray(allCollabs);
  res.end(renderPeople({"allWorks":allWork, "personsName":name, "personsProfession":profession, "collaberations":sortAllCollabs}));
});

app.get("/logIn",(req, res) =>{
  let renderUser = pug.compileFile("./views/ViewUsers.pug");
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(renderUser({}));
});

app.listen(port, ()=>{
  console.log("Currently Listening at http:/localHost: " + port)
});
