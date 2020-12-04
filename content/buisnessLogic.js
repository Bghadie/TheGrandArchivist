//get all the databases
const peopleDatabase = require("./peopleDatabase");
const movieDatabase = require("./movieDatabase");
const userDatabase = require("./userDatabase");

//array of random movie titles
const randomMoiveTitles = ["Captain Of Death", "Defender On My Ship", "Guest Of New Earth", "Cyborg Of The Moon",
                          "Defender In The Center Of The Earth", "Assassins From The UFO" ,"Figures In The Center Of The Earth",
                          "Mercenaries Of The Void", "Androids Of Exploration", "Invaders Of The Galaxy" ,"Robots And Invaders",
                          "Androids And Clones", "Intruders And Rebels", "Guests And Foreigners", "Veterans And Aliens", "Monuments Of Death",
                          "Creation Of The New World", "Carvings Of The New World", "Ambush Of Robots", "Rebirth Of Nowhere",
                          "Better The Secrets Of The Ocean", "Security Of The Eyes", "Favor Of The Machines", "Lonely In The Guests",
                          "Failure Of Stardust", "Wife With Funny Socks", "Queen Of Hope", "Dearest Of Fire", "Truelove Of The Ocean",
                          "Cook With Blue Eyes", "Loves Of Romance", "Admirers Of The Stars", "Heartthrobs Of Heaven", "Foreigners Of Insanity",
                          "Colleagues Of Hope", "Boys And Lovebirds", "Sweeties And Boys", "Dearests And Boys", "Honeys And Women", "Girls And Guests",
                          "Element Of Fire", "Determination, Kiss Of Lust", "Creation Of Joy", "Accident Of Heaven", "Breath Of My Husband",
                          "Symbols Of His Friends", "Blinded By Him", "Hunted By My Future", "Hurt By My Future"];
//array of random genres
const randomGenres = ["Action", "Adventure", "Comedy","Crime","Drama","Fantasy","Horror","Thriller","Mystery","Satire", "Western"]

//splice the list of movies that match the search criteria such that only 50 movies
//display on screen at any given time
function findMoviePerPage(objDisplaying, pageNum){
  let someArray = [];
  Object.keys(objDisplaying).forEach(function(id) {
    someArray.push(objDisplaying[id]);
  });
  //the followig is a function that determines the range of indecies that should
  //be displayed given a particular page number. For example
    //page number 1 should show items from 0-49
    //page number 2 should show items frm 50 - 100
  let numberOfItemsPerPage = 50;
  let start = ((pageNum+1) * numberOfItemsPerPage) - (numberOfItemsPerPage);
  return someArray.splice(start,50);
}


//This function narrows down the database to only movies that match the searched
//title
function findSimilarMovies(partialTitle){
  let similarMovies = [];
  //if the search criteria is empty, all movies should be considered a match
  if(partialTitle === ""){
    Object.keys(movieDatabase).forEach(function(id) {
      similarMovies[id] = movieDatabase[id];
    });
  }else{
    //get every movie that matches the serach criteria
    Object.keys(movieDatabase).forEach(function(id) {
      if((movieDatabase[id].data.Title.toUpperCase()).includes(partialTitle)){
        similarMovies[id] = movieDatabase[id];
      }
    });
  }

  return similarMovies;
}

//This function narrows down the database to only movies that match the searched
//genre
function findGenres(genre, someDatabase){
  let similarGenres = {};//placeholder array
  //if the search was empty, all movies are considered matches
  if(genre === ""){
    Object.keys(someDatabase).forEach(function(id) {
      similarGenres[id] = someDatabase[id];
    });
  }else{
    //user can enter more than one genre, so split the search criteria by a comma or a space
    if(genre.trim().includes(",")){
      genre = genre.trim().split(",");
    }else{
      genre = genre.trim().split(" ");
    }
    //trim whitespace from the search criteria
    for(index in genre){
      genre[index] = genre[index].trim()
    }
    //for each movie in the database
    Object.keys(someDatabase).forEach(function(id){
      //get each genre in the movie database
      let placeHolder = someDatabase[id].data.Genre.toUpperCase().split(",");
      for(item in placeHolder){
        placeHolder[item] = placeHolder[item].trim().toUpperCase();
      }
      //check if that genre matchs any of the search critera
      let check = genre.every((value)=>
        placeHolder.includes(value));
      if(check){
        //add the matched movie title to the array
        similarGenres[id] = someDatabase[id];
      }
    });
  }

  return similarGenres;
}

//This function narrows down the database to only movies that match the searched
//average minirating
function getListOfReviews(threshold,someDatabase){
  let matchedMovies = {}; //placeholder array
  let count; //placeholder count
  let average;//the average rating of a movie
  let sum; //the rating sum per movie
  //iterate over every movie in the database
  Object.keys(someDatabase).forEach(function(id){
    sum = 0; //set the sum to 0
    //if tehre are no reviews in the movie, the average is 0
    if(Object.keys(someDatabase[id].data.review).length === 0){
      average = 0;
    }else{
      //calculate the average movie rating per film
      count = Object.keys(someDatabase[id].data.review).length;
      for(users of Object.keys(someDatabase[id].data.review)){
        sum += someDatabase[id].data.review[users].score;
      }
      average = sum/count
    }
    //if the average meets the threhold, add it to the placeHolder array
    if(average >= threshold){
      matchedMovies[id] = (someDatabase[id]);
    }
  });
  //return the placeholder array
  return matchedMovies;
}

//This function narrows down the database to only movies that match the searched
//year of release
function getMoviesByYear(criteria, someDatabase){
  let matchedMovies = {}
  let minimumYear = findMinYear(movieDatabase); //get the max year in the database
  let maximumYear = findMaxYear(movieDatabase); //get the min year in the database
  //if the search criteria is a valid year
  if(criteria >= minimumYear && criteria <= maximumYear){
    //find every movie that matches the search criteria
    Object.keys(someDatabase).forEach(function(id){
      let year = parseInt(someDatabase[id].data.Year.split("–"));
      if(year === criteria){
        matchedMovies[id] = someDatabase[id]; //get all movies released in the year of the search criteria
      }
    });
  }else{
    //all movies are considered a match, get them all and set the serach criteria appropriately
    Object.keys(someDatabase).forEach(function(id){
      matchedMovies[id] = someDatabase[id]; //get all movies released in the year of the search criteria
    });
    criteria = "Any Year";
  }

  return [matchedMovies, criteria];
}




/*
this function is straight forward, it goes through the database and finds the newest movie's release year
*/
function findMaxYear(){
  let max = 0;
  for(id of Object.keys(movieDatabase)){
    let year = parseInt(movieDatabase[id].data.Year.split("-"));//some movies have two years (i don't know why) so this accounts for that
    if(year > max){
      max = year;
    }
  }
  return max;
}

/*
This function is straight forward, it goes through the database and finds the oldest movie release year
*/
function findMinYear(){
  let min = 3005; //some random number
  for(id of Object.keys(movieDatabase)){
    let year = parseInt(movieDatabase[id].data.Year.split("-"));//some movies have two years (i don't know why) so this accounts for that
    if(year < min){
      min = year;
    }
  }
  return min;
}



/*
This function is identitical to the find similar movies function except its used to find the total
amount of pages needed to display all the movies that match the search criteria
*/
function findMaxPage(partialTitle){
  let similarMovies = [];
  Object.keys(movieDatabase).forEach(function(id) {
    if((movieDatabase[id].data.Title.toUpperCase()).includes(partialTitle)){
      similarMovies.push(movieDatabase[id]);
    }
  });
  if(partialTitle === ""){
    return Math.floor(Object.keys(movieDatabase).length/50)
  }else if(similarMovies.length <=50){
    return 0;
  }else{
    return Math.floor(similarMovies.length/50);
  }
}

/*
Assumption: takes a person's name as a string (the search criteria) and a page number as an int
Purpose:finds all people in the database that matches the search criteria
Returns: a list of all mathced people
*/
function findSimilarPeople(partialName, pageNum){
  let similarPeople = [];
  //if the user searched nothing, all people match
  if(partialName === ""){
    Object.keys(peopleDatabase).forEach(function(id) {
      similarPeople.push(peopleDatabase[id]);
    });
  }else{
    //otherwise, go through each person in the database and add anybody who's name matches the seach criteria
    Object.keys(peopleDatabase).forEach(function(id) {
      if((peopleDatabase[id].name.toUpperCase()).includes(partialName.toUpperCase())){
        similarPeople.push(peopleDatabase[id]);
      }
    });
  }
  let numberOfItemsPerPage = 50;//the max number of people displayed on a page's search result

  //this forumla is used to determine the subset/range of people from the matched list that will be
  //displayed on screen
  let start = ((pageNum+1) * numberOfItemsPerPage) - (numberOfItemsPerPage);

  return similarPeople.splice(start,50); //return a subset of the matched peopel
}

/*
Just like the find similar people genre, except it returns an array of all people in the database
for when the search criteria is empty and all people should "match"
*/
function allPeople(pageNum){
  let similarPeople = [];
  Object.keys(peopleDatabase).forEach(function(id) {
    similarPeople.push(peopleDatabase[id]);
  });
  let numberOfItemsPerPage = 50;
  var start = ((pageNum+1) * numberOfItemsPerPage) - (numberOfItemsPerPage);
  return similarPeople.splice(start,50);
}

/*
This function is identitical to the find similar people function except its used to find the total
amount of pages needed to display all the people that match the search criteria
*/
function findMaxPeople(partialName){
  let similarPeople = [];
  Object.keys(peopleDatabase).forEach(function(id) {
    if((peopleDatabase[id].name).includes(partialName)){
      similarPeople.push(peopleDatabase[id]);
    }
  });
  if(partialName === ""){
    return Math.floor(Object.keys(peopleDatabase).length/50)
  }else if(similarPeople.length <=50){
    return 0;
  }else{
    return Math.floor(similarPeople.length/50);
  }
}

/*
Assumption: the function takes a person's name and profession as a string
NOTE: the profession (i.e., ACTOR, DIRECTOR, or WRITER) should be entered in all caps
Purpose: Adds a person, if they exist in the database, to a movie. Also updates the person's work history
Returns: True is succesful false, otherwise
*/
function addPersonToMovie(movieTitle, personsName, personsProfession){
  //get the ID's of the user's input
  let personsID = getIDByName(personsName);
  let movieTitleID = getIDByTitle(movieTitle);
  if(!(personsID && movieTitleID)){
    //the person isn't in the databse or the movie doesn't exist, return false
    return false;
  }
  //create a person object
  let personObject = peopleDatabase[personsID]
  //set the person objects information (e.g., profession and movie they've worked on)
  personObject.films += "," + movieTitle;

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
function createPerson(personsName, profession, movieTitle){
  //add the person with a unique ID to the database
  peopleDatabase[Object.keys(peopleDatabase).length + 1000000] = {name:personsName, profession:profession, films:movieTitle}
  if(movieTitle !== ""){
    addPersonToMovie(movieTitle,personsName,profession, movieDatabase, peopleDatabase);
  }
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
  let regex = /[0-9,a-zA-Z\s]+/;
  if(!(regex.test(actor)) || !(regex.test(director))|| !(regex.test(writer))){
    return false;
  }
  let givenWriter = writer.split(",");
  let givenDirector = director.split(",");
  let givenActor = actor.split(",");
  let numOfPeopleInDatabase;
  if(getIDByTitle(title.trim())){
    return false; //the movie already exists in the database
  }
  //loop through every user inputted to check if each person exists in the database
  for(writers of givenWriter){
    if(writers !== ""){
      if(getIDByName(writers.trim())){
        peopleDatabase[getIDByName(writers.trim())].films +="," + title;
      }else{
        return false;
      }
    }
  }
  for(directors of givenDirector){
    if(getIDByName(directors.trim())){
      peopleDatabase[getIDByName(directors.trim())].films +="," + title;
    }else{
      return false;
    }
  }
  for(actors of givenActor){
    if(actors !== ""){
      if(getIDByName(actors.trim())){
        peopleDatabase[getIDByName(actors.trim())].films +="," + title;
      }else{
        return false;
      }
    }
  }
  //get a unique ID
  let id = Object.keys(movieDatabase).length;
  //add the movie to the database
  movieDatabase[id] = {data:{Title:title, Writer:writer, Director:director,Actors:actor, review:{}}};

  //loop through every person add check if anybody is following them, if so, handle their alerts
  for(writers of givenWriter){
    addAlertConcerningPerson(writers, title, "Writer", userDatabase)
  }
  for(directors of givenDirector){
    addAlertConcerningPerson(directors, title, "Director", userDatabase)
  }
  for(actors of givenActor){
    addAlertConcerningPerson(actors, title, "Actor", userDatabase)
  }
  return true;
};

/*
Assumption: the function takes a username as a string
Purpose: changes the users user type
Returns true if succesful, false otherwise
*/
function changeUserType(requestingUser){
  //if the calling user is in the database make them a contributing user
  if(getIDByUsername(requestingUser)){
    userDatabase[requestingUser].contributing = !(userDatabase[requestingUser].contributing);
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
  let requestingUserID = getIDByUsername(requestingUser);
  let userToFollowID = getIDByUsername(userToFollow);
  //if either are not in the database, return false
  if(!(requestingUserID && userToFollowID)){
    return false;
  }
  //otherwise push the userTofollow into the calling user's follow list
  userDatabase[requestingUser].followingUsers.push(userToFollowID);
  return true;


};

/*
Assumption: takes a requesting username and a username to unfollow as a string
Purpose: unfollows a user
Returns: true if the user was unfollowed, false others
*/
function unfollowUser(requestingUser, userToUnfollow){
  //get both user's ID's
  let requestingUserID = getIDByUsername(requestingUser);
  let userToUnfollowID = getIDByUsername(userToUnfollow);
  //if either are not in the database, return false
  if(!(requestingUserID && userToUnfollowID)){
    return false;
  }
  let index = userDatabase[requestingUser].followingUsers.indexOf(userToUnfollowID);
  userDatabase[requestingUser].followingUsers.splice(index,1);
  return true;
}
/*
Assumption: the function is taking a username and the name of the person to follow as strings
Purpose: adds a person to the calling user's following list
Returns true if succesful, false otherwise
*/
function followPeople(requestingUser, personToFollow){
  //get the user and person's ID
  let requestingUserID = getIDByUsername(requestingUser);
  let personToFollowID = getIDByName(personToFollow.trim());
  //if either doesn't exist in the databse, return false
  if(!(requestingUserID && personToFollowID)){
    return false;
  }
  //otherwise push the personToFollow into the calling's user's follow list
  userDatabase[requestingUser].followingPeople.push(personToFollow);
  return true;
};

/*
Assumption: takes a requesting username and a person to follow as a string
Purpose: unfollows a person
Returns: true if the perosn was unfollowed, false others
*/
function unfollowPerson(requestingUser, personToUnfollow){
  //get the user and person's ID
  let requestingUserID = getIDByUsername(requestingUser);
  let personToUnfollowID = getIDByName(personToUnfollow.trim());
  //if either doesn't exist in the databse, return false
  if(!(requestingUserID && personToUnfollowID)){
    return false;
  }
  let index = userDatabase[requestingUser].followingPeople.indexOf(personToUnfollow);
  userDatabase[requestingUser].followingPeople.splice(index,1);
  return true;
}

/*
Assuption: the function takes a username and password as a string. If the username doesn't exist,
it add's the user
Purpsoe: create a user with the specified username and ID
Returns true if succesful, false otherwise
*/
function createUser(requestingUser, pass){
  //if the username is already in the database return false
  if(getIDByUsername(requestingUser)){
    return false;
  }
  //create the user and add them to the all user's list
  userDatabase[requestingUser] = {password:pass};
  //set them to regular user by defauls
  userDatabase[requestingUser].contributing = false;
  userDatabase[requestingUser].followingUsers = [];
  userDatabase[requestingUser].followingPeople = [];
  userDatabase[requestingUser].recommendedMovies = [];
  userDatabase[requestingUser].reviews = {};
  userDatabase[requestingUser].alerts = [];
  return true;
};

/*
Assuption: the function takes a username as a string, a movie name as a string, and a review object (e.g., a number and a review)
Purpose: adds a review to a movie
Returns true if succesful, false otherwise
*/
function addReview(requestingUser, movie, review){
  //get the movie ID and usernameID
  movieID = getIDByTitle(movie);
  userID = getIDByUsername(requestingUser);
  //if the user or movie don't exist, return false
  if(!movieID || !userID){
    return false;
  }
  //add the review to the movie in the moviedatabase
  movieDatabase[movieID].data.review[requestingUser] = review;
  //add the review to the user in the user database
  userDatabase[userID].reviews[movieDatabase[movieID].data.Title] = review;
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
//Purpose: finds the key of a specific value in a database
//Returns: the key if its found, otherwise null
//NOTE this way, by calling these helper functions I will either get the Key I need or
//get null, making it perfect for branching structures
function getIDByTitle(value) {
  return Object.keys(movieDatabase).find(key => JSON.stringify(movieDatabase[key].data.Title.toUpperCase()) === JSON.stringify(value.toUpperCase()));
}
function getIDByUsername(value) {
  return Object.keys(userDatabase).find(key => JSON.stringify(key.toUpperCase()) === JSON.stringify(value.toUpperCase()));
}
function getIDByName(value) {
  return Object.keys(peopleDatabase).find(key => JSON.stringify(peopleDatabase[key].name.toUpperCase()) === JSON.stringify(value.toUpperCase()));
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
    if(getIDByUsername(someID)){
      return true;
    }else{
      return false;
    }
  }
}

/*
This function is very straight forward, it sorts a person's recent work by most recent to least
*/
function sortRecentWork(recentWork){
  let placeHolder = []
  //find the movie object of each mvie the person worked on
  Object.keys(movieDatabase).forEach(function(id){
    if(recentWork.includes(movieDatabase[id].data.Title)){
      //store the name of the movie and the year of its released in a 2d array
      placeHolder.push([movieDatabase[id].data.Title, parseInt(movieDatabase[id].data.Year)])
    }
  });
  //sory the 2d array by year, in descending order
  placeHolder.sort(function(x,y){
    return y[1] - x[1];
  });
  //fix the list to only contain the movie title names (in order from most to least recent)
  for(let i = 0; i < placeHolder.length;i++){
    placeHolder[i] = placeHolder[i][0];
  }
  //return their recent work
  return placeHolder
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
  let id = getIDByName(name);
  let arrayOfWork = [];
  //return the list of films the person has worked on
  for(works of peopleDatabase[id].films.split(",")){
    if(!(arrayOfWork.includes(works))){
      arrayOfWork.push(works);
    }
  }
  return arrayOfWork;
}

//Assumptions: takes the name of a person as a string
//Purpose: checks to see if a person worked on a particular movie. If they have
//Go through every profession and store each person in that profession in an object array
//Also keep track of how many times the person given to the function has worked with each person
//basically, the object looks like {nameOfCoworker:numberOfTimesWorkedWith}
//Returns: an object of all the peron's coworkers and how many times they have worked together
function findCoworker(peopleDatabase, name){
  array = {};
  for(key of Object.keys(movieDatabase)){
    for(works of peopleDatabase){
        if(movieDatabase[key].data.Title === works){
          for(actors of movieDatabase[key].data.Actors.split(",")){
            if(!actors.trim().includes(name)){
              array[actors.trim()] = array[actors.trim()] ? array[actors.trim()]+1 : 1;
            }
          }
          for(directors of movieDatabase[key].data.Director.split(",")){
            if(!directors.trim().includes(name)){
              array[directors.trim()] = array[directors.trim()]?array[directors.trim()]+1:1;
            }
          }
          for(writers of movieDatabase[key].data.Writer.split(",")){
            if(!writers.trim().includes(name)){
              array[writers.trim()] = array[writers.trim()]?array[writers.trim()]+1:1;
            }
          }
        }
    }
  }
  return array;
}

/*
Assumption: takes a password as a string
Purpose: used regex to validate that a password contains at least 8 characters, an uppercase
  AND lowercase character, a number, and can contain special characters
Returns: true if the password is valid, false if it isn't
*/
function isValidPass(somePassword){
  //regex check
  let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{8,}$/;
  //return the valdiity of the password
  return reg.test(somePassword);
}

/*
Assumption: tkes a the partial username searched as a string and the current page number as an integer
Purpose: used to determine the users to be displayed on screen when someone searchs for a partial user name
Returns: a subset of all the matched users as an array
*/
function findSimilarUsers(userToSearch, pageNum){
  let userMatchs = []; //set placehoder array
  if(userToSearch === "" || !userToSearch){ //if the search criteria is empty
    Object.keys(userDatabase).forEach(function(id){
      userMatchs.push(id); //consider every user a match
    });
  }else{
    //iterate over every user
    Object.keys(userDatabase).forEach(function(id){
      //if the current username includes that search criteria
      if(id.toUpperCase().includes(userToSearch.toUpperCase())){
        userMatchs.push(id); //consider it a match
      }
    });
  }
  let numberOfItemsPerPage = 50;//the max number of users displayed on a page's search result
  //this forumla is used to determine the subset/range of users from the matched list that will be
  //displayed on screen
  let start = ((pageNum+1) * numberOfItemsPerPage) - (numberOfItemsPerPage);
  //return a subset of the array of matched users
  return userMatchs.splice(start,50);
}

/*
Assumption: takes a partial username as a string
Purpose: find out how many pages of users that match the partial username need to be displayed
Returns: an integer representing the number of pages needed to display all matched users
*/
function findMaxUsers(partialUser){
  let similarUsers = [];
  if(partialUser === ""){
    Object.keys(userDatabase).forEach(function(id){
      similarUsers.push(id);
    });
  }else{
    Object.keys(userDatabase).forEach(function(id){
      if(id.includes(partialUser)){
        similarUsers.push(id);
      }
    });
  }
  if(similarUsers.length <=50){
    return 0;
  }else{
    return Math.floor(similarUsers.length/50);
  }
}

/*
Assumption: takes a person's name, a movie title, and a profession as a string
Purpose: Check if anybody is follow the given person, if they are, add an alert that the person has been added to a movie
Returns: nothing
*/
function addAlertConcerningPerson(somePerson, title, profession){
  //for every user
  Object.keys(userDatabase).forEach(function(id){
    //if a user is following the given person
    if(userDatabase[id].followingPeople.includes(somePerson)){
      //add an alert
      userDatabase[id].alerts.push(somePerson + " has been added to the following movie: " + title + " as a " + profession);
    }
  });
}

/*
Assumption: takes the username of the user who wrote a revie and the movie title as a string
Purpose: checks to see if anybody is following that user and adds an alert to that user that someone they are following just wrote a review
Returns: nothing
*/
function addAlertConcerningUser(userWhoWroteReview, title){
  //for every user
  Object.keys(userDatabase).forEach(function(id){
    //if that user is following the given user
    if(userDatabase[id].followingUsers.includes(userWhoWroteReview)){
      //add an alert
      userDatabase[id].alerts.push(userWhoWroteReview + " has just written a review on: " + title);
    }
  });
}

/*
Assumption: takes a username as a string
Purpose: get all the alerts the user needs to see
Returns: return a list of alerts that need to be displayed
*/
function handleAlerts(user){
  let alerts =[];
  //if the user exists
  if(user){
    //while there are alerts to display
    while(userDatabase[user].alerts.length > 0){
      alerts.push(userDatabase[user].alerts.pop());//pop that alert and push it to the placeholder array
    }
  }
  //return that araray of alters
  return alerts;
}



/*
Export all the functionality needed by the server
*/
module.exports = {
  findCoworker:findCoworker,
  findWork:findWork,
  sortArray:sortArray,
  isValidId:isValidId,
  getIDByName:getIDByName,
  getIDByUsername:getIDByUsername,
  getIDByTitle:getIDByTitle,
  removePara:removePara,
  containsObject:containsObject,
  addReview:addReview,
  createUser:createUser,
  followPeople:followPeople,
  followUser:followUser,
  changeUserType:changeUserType,
  createMovie:createMovie,
  createPerson:createPerson,
  addPersonToMovie:addPersonToMovie,
  findGenres:findGenres,
  findSimilarMovies:findSimilarMovies,
  findMinYear:findMinYear,
  getListOfReviews:getListOfReviews,
  isValidPass:isValidPass,
  randomMoiveTitles:randomMoiveTitles,
  randomGenres:randomGenres,
  findSimilarPeople:findSimilarPeople,
  findMaxPeople:findMaxPeople,
  unfollowPerson:unfollowPerson,
  unfollowUser:unfollowUser,
  allPeople:allPeople,
  findSimilarUsers:findSimilarUsers,
  findMaxUsers:findMaxUsers,
  addAlertConcerningPerson:addAlertConcerningPerson,
  addAlertConcerningUser:addAlertConcerningUser,
  handleAlerts:handleAlerts,
  sortRecentWork:sortRecentWork,
  getMoviesByYear:getMoviesByYear,
  findMoviePerPage:findMoviePerPage
};
