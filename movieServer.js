
//Get the required modules
const express = require("express");
const app = express();
const pug = require("pug");
const {PythonShell} = require('python-shell');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fromDatabase = require("./content/buisnessLogic");
//set the port
const port = 3000;

//NOTE Movie id's are any integer from 1 - 999999
//NOTE people id' are any integer from 1000000+
//get the movie and people database
const peopleDatabase = require("./content/peopleDatabase");
const movieDatabase = require("./content/movieDatabase");
const allUsers = require("./content/userDatabase");

fromDatabase.addReview("IllumaDaddy", "Toy Story", {score:10, review:"YAY"}, movieDatabase, allUsers);
fromDatabase.addReview("IlluaDaddy", "Toy Story", {score:10, review:"YAY"}, movieDatabase, allUsers);
fromDatabase.addReview("IllumaDaddy", "Coraline", {score:10, review:"I have watched this movie A LOT"}, movieDatabase, allUsers);
fromDatabase.addReview("JoestInTime", "Toy Story", {score:7, review:"I have watched this movie A LOT. Tom Hanks was great in it but I stil can't freaking stand Tim Allen, the god damn snitch"}, movieDatabase, allUsers);


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

//this is my movie route. It does a check and, depending on the result
//will send a specific response
app.get("/movies", (req, res, next) =>{
  //if the client is looking for a movie title do the following
  if(req.query.title || req.query.title ===""){
    let movie = fromDatabase.getIDByTitle(req.query.title); //basically a flag variable
    //if the movie is in the database, render it
    if(movie){
      res.render("ViewMovie",{"someMovie":movieDatabase[movie].data});
    }else{
      //get all movies that match the search criteria and render the movie
      let moviesByTitle = fromDatabase.findSimilarMovies(req.query.title.toUpperCase(), parseInt(req.query.pageNum),movieDatabase);
      if(req.query.title === ""){
        //set the search criteria to all movies
        res.render("ViewMovieList",{"someMovies":moviesByTitle, "searchCriteria": "All Movies"});
      }else{
        //set the search criteria to the search criteria
        res.render("ViewMovieList",{"someMovies":moviesByTitle, "searchCriteria": req.query.title});
      }
    }
  }else{
    next();//they aren't looking for a movie title, call next
  }
}, (req,res,next) =>{
  //if the client is looking for a genre
  if(req.query.genre || req.query.genre ===""){
    //get all genres that match the search criteria
    let listOfMovies = fromDatabase.findGenres(req.query.genre.toUpperCase(), parseInt(req.query.pageNum),movieDatabase);
    //if the user entered nothing, all movies match
    if(req.query.genre === ""){
      //render the list of movies
      res.render("ViewGenre",{"someMovies":listOfMovies, "searchCriteria": "All Genres"});
    }else{
      //render the list of movies that match the search criteria
      res.render("ViewGenre",{"someMovies":listOfMovies, "searchCriteria": req.query.genre});
    }
  }else{
    next(); //they aren't looking for a genre either, call next
  }
}, (req,res,next) =>{
  //if the client is looking for a year
  if(req.query.year || req.query.year === ""){
    let criteria = parseInt(req.query.year);//store the minimum year they want
    //get all movies that match the search criteria and render it
    let matchedMovies = fromDatabase.getMoviesByYear(criteria, req.query.pageNum);
    res.render("ViewMovieList",{"someMovies":matchedMovies[0], "searchCriteria": matchedMovies[1]});
  }else{
    next(); //they aren't looking for a year either, call next
  }
},(req,res) =>{
  let threshold = parseFloat(req.query.rating); //get the threshold
  //if the threshold is valid
  if(threshold >=0){
    //get all movies who's average rating are at or above the threshold and render it
    let matchedMovies = fromDatabase.getListOfReviews(threshold, movieDatabase);
    let criteria = "Movies with Rating of at least " + threshold
    let numberOfItemsPerPage = 50;
    let start = ((parseInt(req.query.pageNum)+1) * numberOfItemsPerPage) - (numberOfItemsPerPage);
    res.render("ViewMovieList",{"someMovies":matchedMovies.splice(start,50), "searchCriteria": criteria});
  }else{
    //its not a valid threshold, send an error
    res.status(404).send();
  }
});

//this function searchs for a movie by a given ID
app.get("/movies:id", (req, res) =>{
  let id = parseInt(req.query.id); //get the ID the user searched for
  if(fromDatabase.isValidId(id, 1,movieDatabase)){ //check if its a valid ID
    res.render("ViewMovie",{"someMovie":movieDatabase[id].data});
  }
});

//this is my person route. It does a check and, depending on the result
//will send a specific response
app.get("/people", (req,res,next)=>{
  let queryName = fromDatabase.removePara(req.query.name); //get the name the user entered
  if(fromDatabase.getIDByName(queryName.trim())){//if the person exists in the database
    let id = fromDatabase.getIDByName(queryName.trim()); //get the person's ID
    let allWork = fromDatabase.sortRecentWork(fromDatabase.findWork(queryName.trim(),peopleDatabase)) //get all their work and sort it from more to least recent
    let profession = peopleDatabase[id].profession; //get their profession
    let sortAllCollabs = fromDatabase.sortArray(fromDatabase.findCoworker(allWork, queryName,movieDatabase)); //sort their collaboration by most frequent
    //render the page
    res.render("ViewPerson",{"allWorks":allWork, "personsName":queryName, "personsProfession":peopleDatabase[id].profession, "collaberations":sortAllCollabs});
  }else{
    next();//the person doesn't exist in the database, call next
  }
});
app.get("/people", (req,res)=>{
  let queryName = fromDatabase.removePara(req.query.name); //get the name the user entered
  let pageNum = req.query.pageNum;//get the current page number (0 by default)
  if(queryName === ""){//if the user entered nothing, all people in the database should match.
    //render all matching people
    res.render("ViewPeople",{"somePeople":fromDatabase.allPeople(pageNum, peopleDatabase), "searchCriteria": "Everybody"});
  }else{
    //get a list of all people that match the search criteria
    let listOfPeople = fromDatabase.findSimilarPeople(queryName, parseInt(pageNum), peopleDatabase);
    //render all matching people
    res.render("ViewPeople",{"somePeople":listOfPeople, "searchCriteria": queryName});
  }
});
//this function searchs for a person by a given ID
app.get("/people:id", (req,res)=>{
  let id = parseInt(req.query.id); //convert the ID into an int
  if(fromDatabase.isValidId(id,2,peopleDatabase)){ //check that its valid
    let profession = peopleDatabase[id].profession; //get their profession
    let allWork = fromDatabase.findWork(peopleDatabase[id].name.trim(),peopleDatabase) //get all their work and sort it by most recent
    let sortAllCollabs = fromDatabase.sortArray(fromDatabase.findCoworker(allWork, peopleDatabase[id].name,movieDatabase)); //sort their collaboration by most frequent
    //render the page
    res.render("ViewPerson",{"allWorks":allWork, "personsName":peopleDatabase[id].name, "personsProfession":peopleDatabase[id].profession, "collaberations":sortAllCollabs});
  }
});

//this function finds the maximum pages need to display all movies that meet the serached criteria
app.get("/findMaxPageMovie", (req,res) =>{
  let maxPageNum = fromDatabase.findMaxPage(req.query.title.toUpperCase(),movieDatabase);
  res.send(maxPageNum.toString());
});

//this function finds the maximum pages need to display all genres that meet the serached criteria
app.get("/findMaxPageGenre", (req,res) =>{
  let maxPageNum = fromDatabase.findMaxGenre(req.query.genre.toUpperCase(),movieDatabase);
  res.send(maxPageNum.toString());
});

//this function finds the maximum pages need to display all years that meet the serached criteria
app.get("/findMaxPageYear", (req,res) =>{
  let threshold = parseInt(req.query.year);
  let minimumYear = fromDatabase.findMinYear(movieDatabase);
  let maximumYear = fromDatabase.findMaxYear(movieDatabase);
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
    res.send("0");
  }else{
    let maxPage = Math.floor((matchedMovies.length)/50);
    res.send(maxPage.toString());
  }
});

//this function finds the maximum pages need to display all movies that meet the minimum average rating
app.get("/findMaxPageRating", (req,res) =>{
  let threshold = parseFloat(req.query.rating);
  let matchedMovies = fromDatabase.getListOfReviews(threshold,movieDatabase);
  if(matchedMovies.length <=50){
    res.send("0");
  }else{
    let maxPage = Math.floor((matchedMovies.length)/50);
    res.send(maxPage.toString());
  }
});

//this function finds the maximum pages need to display all people that meet the serached criteria
app.get("/findMaxPagePeople?", (req,res) =>{
  let maxPageNum = fromDatabase.findMaxPeople(req.query.name,peopleDatabase);
  res.send(maxPageNum.toString());
});

/*
shout out to:
https://github.com/extrabacon/python-shell
allowed me to create a shell to run my python script
Assumption: takes a string consisting of MovieTitle,MovieYear as an argument
It gets a list of all similar movies based off my algorithm (see movieRecommender.py)
*/
app.get("/recommendMovieGeneral",(req, res) =>{
  let someString = req.query.info;//get the serch criteria
  let movieExists = fromDatabase.getIDByTitle(someString.split(",")[0]); //make sure the movie exists
  if(movieExists){//if the movie exists
    //start a python shell to run the movieRecommender script
    let pyshell = new PythonShell("movieRecommender.py");
    pyshell.send(someString)//send the search criteria to the script as an argv
    pyshell.on('message', function(message){
      //this takes the response and parses it into something readable
      //note, the response is taken from what ever the python script prints
      let arr = message.split("|").filter(function(e){//split the response from the script by | character
        return e !== "";//get each individual movie title
      });
      let movieObjs = []
      for(titles of arr){
        movieObjs.push(movieDatabase[fromDatabase.getIDByTitle(titles)].data);//push each movie object into the placeholder array
      }
      //render the recomended movies
      res.render("ReccMovieGen", {"someMovies":movieObjs});
    });
    //end the python shell
    pyshell.end(function(err,code,signal){
      //these exist for testing purposes

    /*  console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
      console.log('finished');*/
    });
  }
});

//this function creates a user and adds them to the database
app.post("/createAccount", (req, res) =>{
  let username= req.body.username;
  let password = req.body.password;
  //if username isn't valid dispaly error message
  if(username.length === 0){
    res.status(440).send();//entered an invalid username
  }else if(fromDatabase.getIDByUsername(username)){
    res.status(441).send(); //user already exists
  }else if(!fromDatabase.isValidPass(password)){ //if password isn't valid display error message
    res.status(442).send();//invalid password
  }else{
    //create the user, add them to the database, and update the session
    fromDatabase.createUser(username, password, allUsers);
    req.session.loggedIn = true;
    req.session.username = username;
    res.send();
  }
});

//this function handles clients searching for users
app.get("/users", (req,res,next)=>{
  //if the user searched for is in the database
  if(fromDatabase.getIDByUsername(req.query.user)){
    //render the user's page
    res.render("ViewUsers",{"someUser":allUsers[req.query.user], "name": req.query.user});
  }else{
    next(); //call next and get all user's that match the search criteria
  }
}, (req, res) =>{
  //get all matches to the search criteria
  let similarUsers = fromDatabase.findSimilarUsers(req.query.user,parseInt(req.query.pageNum));
  if(req.query.user === ""){//all usernames should match so render everyons
    res.render("ViewSimilarUsers",{"someUser":similarUsers, "searchCriteria": "All Users"});
  }else{
    //render all search matches
    res.render("ViewSimilarUsers",{"someUser":similarUsers, "searchCriteria": req.query.user});
  }
});

//this function finds the maximum pages need to display all users that meet the serached criteria
app.get("/findMaxPageUser?", (req,res) =>{
  let maxPageNum = fromDatabase.findMaxUsers(req.query.user,allUsers);
  res.send(maxPageNum.toString());
});

//this function redirects the user to the user page
app.get("/userPage", auth ,(req,res)=>{
  res.render("ViewUsers",{"someUser":allUsers[req.session.username], "name": req.session.username});
});

//this function redirects the user to the login page
app.get("/loginPage", (req, res) =>{
  res.render("ViewLoginPage",{});
});

//this function logs a user in. Notice it uses a post request to try to keep
//the passowrd being sent secure
app.post("/loginUser", (req, res) =>{
  let username= req.body.username;
  let password = req.body.password;
  if(fromDatabase.getIDByUsername(username)){
    if(allUsers[username].password === password){
      //the user is logged in, set current sessoin accordingly
      req.session.loggedIn = true;
      req.session.username = username;
      res.send();
    }else{
      res.status(442).send(); //invalid password
    }
  }else{
    res.status(440).send(); //entered an invalid username
  }
});
//this function logs a user out by destroying the current session
app.get("/logout", (req, res)=>{
  req.session.destroy();
  res.render("HomePage",{});
});

//this function checks if a user is logged in
app.get("/checkLoggedIn", auth, (req,res) =>{
  res.send();
});

//this function checks if the current logged in user is following a person
app.get("/checkIfFollowing",auth,(req,res)=>{
  if(allUsers[req.session.username].followingPeople.includes(req.query.name.trim())){
    res.send();
  }else{
  res.status(460).send();
  }
});

//this function checks for any alerts that need to be handled
app.get("/checkForAlerts", (req,res) =>{
  res.send(JSON.stringify({alerts:fromDatabase.handleAlerts(req.session.username, allUsers)}));
});

//this function is called when viewing the user's page. It checks if the current
//user is visiting their own pag
app.get("/checkCurrUser",(req, res)=>{
  if(req.session.username === req.query.user){
    res.send();//they are visiting their own page
  }else{
    res.status(430).send();//this error code means that they are on another user's page
  }
});

//this function checks if a user is a contributing user
app.get("/checkContributing",auth,(req, res)=>{
  if(allUsers[req.session.username].contributing){
    res.send();
  }
});

//this function checks if the calling user if following some other user
app.get("/isFollowingUser",auth,(req, res)=>{
  if(allUsers[req.session.username].followingUsers.includes(req.query.user)){
    res.send(); //they are following the user
  }else{
    res.status(470).send();//they aren't following the user, send an error code
  }
});

//this function toggles the user (contributing/regular) usertype
app.get("/switchUserType",auth,(req, res)=>{
  fromDatabase.changeUserType(req.session.username);
  res.send();
});

//this redirects the user to the page that lets them add movies to the database
app.get("/addMoviePage",(req, res)=>{
  res.render("ViewAddMovie",{"someUser":allUsers[req.query.username], "name": req.query.username});
});
//this redirects the user to the page that lets them add revies to the movie
app.get("/addReviewPage",auth,(req, res)=>{
  res.render("ViewAddReview",{someUser: req.session.username, movieTitle:req.query.title});
});

//this function adds a review to the database
app.post("/addReview",auth,(req, res)=>{
  if(parseInt(req.body.score) <= 10 && parseInt(req.body.score) >= 0){
    if((req.body.review === "" && req.body.summary !== "") || (req.body.review !== "" && req.body.summary === "")){
      res.status(481).send();//the user did not enter a valid full review
    }else{
      //create the review object with the post body information
      fromDatabase.addReview(req.session.username, req.query.title.trim(),
        {score:req.body.score, review:req.body.review, summary:req.body.summary},
        movieDatabase, allUsers);
        //add the review to the movie
      fromDatabase.addAlertConcerningUser(req.session.username, req.query.title.trim(), allUsers);
      res.send()
    }
  }else{
    res.status(480).send(); //the user entered a value exceeding the valid range (0-10)
  }
});

//this redirects the user to the page that lets them add people to the database/movie
app.get("/addPersonPage",auth,(req, res)=>{
  res.render("ViewAddPerson",{someUser: req.session.username, movieTitle:req.query.title});
});

//this method adds a person to a movie
app.post("/addPersonToMovie",auth,(req, res)=>{
  if(fromDatabase.getIDByName(req.body.name.trim())){
    if(req.body.profession.trim().toUpperCase() !== "ACTOR" && req.body.profession.trim().toUpperCase() !== "DIRECTOR" && req.body.profession.trim().toUpperCase() !== "WRITER"){
      res.status(491).send();//the person entered an invalid role (i.e., actor, director, writer)
    }else{
      //add the person and handle any alerts to users that need to be sent
      fromDatabase.addPersonToMovie(req.query.title, req.body.name.trim(), req.body.profession.trim().toUpperCase(), movieDatabase, peopleDatabase)
      fromDatabase.addAlertConcerningPerson(req.body.name.trim(),req.query.title, req.body.profession.trim(), allUsers);
      res.send();
    }
  }else{
    res.status(490).send(); //the person doesn't exist in the database
  }
});

//this method adds a person to the database
app.post("/addPersonToDatabase",auth,(req, res)=>{
  if(fromDatabase.getIDByName(req.body.name.trim()) || req.body.name === ""){
    res.status(492).send(); //the person already exists in the databasse
  }else{
    if(req.body.profession.trim().toUpperCase() !== "ACTOR" && req.body.profession.trim().toUpperCase() !== "DIRECTOR" && req.body.profession.trim().toUpperCase() !== "WRITER"){
      res.status(491).send(); //the user entered an invalid role (i.e., actor, director, writer)
    }else{
      //everything is good, add the user to the database
      fromDatabase.createPerson(req.body.name.trim(), req.body.profession.toUpperCase().trim(), "", movieDatabase, peopleDatabase);
      res.send();
    }
  }
});

//not gonna get into it, this function just auto generates x movies to be addded
//(where x is the iteration )

app.post("/addMovie:auto",auth,(req, res)=>{
  //createMovie(title, writer, director, actor, movieDatabase, peopleDatabase)
  let iteration = parseInt(req.body.auto);
  for(let i = 0; i < iteration; i++){
    let actors = ""
    let writers = ""
    let randomTitleIndex = Math.floor(Math.random()*fromDatabase.randomMoiveTitles.length);
    let randomGenreIndex = Math.floor(Math.random()*fromDatabase.randomGenres.length);
    let randomDirectorIndex = Math.floor((Math.random()*Object.keys(peopleDatabase).length)+1000000);
    for(let j = 0; j < 5; j++){
      let randomActorIndex = Math.floor((Math.random()*Object.keys(peopleDatabase).length)+1000000);
      actors += peopleDatabase[randomActorIndex].name+","
    }
    for(let j = 0; j < 3;j++){
      let randomWriterIndex = Math.floor((Math.random()*Object.keys(peopleDatabase).length)+1000000);
      writers += peopleDatabase[randomWriterIndex].name+","
    }
    fromDatabase.createMovie(fromDatabase.randomMoiveTitles[randomTitleIndex],
      writers, peopleDatabase[randomDirectorIndex].name,
      actors);
    let addedMovieId = fromDatabase.getIDByTitle(fromDatabase.randomMoiveTitles[randomTitleIndex]);
    movieDatabase[addedMovieId].data.Genre = fromDatabase.randomGenres[randomGenreIndex];
    movieDatabase[addedMovieId].data.Runtime = Math.floor(Math.random()*360 + 120) + " min"
    console.log(movieDatabase[addedMovieId].data.Title)
  }
  res.send();
});

//this post method adds a movie tot he database
app.post("/addMovie",(req, res)=>{
    //get all data sent by the client
    let title, actor, director, writer, year, summary, genre, runtime;
    title = req.body.title;
    actor = req.body.actor;
    director = req.body.director;
    writer = req.body.writer;
    year = req.body.year;
    summary = req.body.summary;
    runtime = req.body.runtime;
    genre = req.body.genre;
    //try to add the movie to the database. If it can be added (all valid entries)
    if(fromDatabase.createMovie(title, writer, director, actor, movieDatabase, peopleDatabase, allUsers)){
      //don't forget to set the year, runtime, and genre
      if(parseInt(year)){
        movieDatabase[fromDatabase.getIDByTitle(title)].data.Released = year;
        movieDatabase[fromDatabase.getIDByTitle(title)].data.Year = year;
      }else{
        movieDatabase[fromDatabase.getIDByTitle(title)].data.Released = "";
        movieDatabase[fromDatabase.getIDByTitle(title)].data.Released = "";
      }
      if(parseInt(runtime)){
        movieDatabase[fromDatabase.getIDByTitle(title)].data.Runtime = runtime + " min";
      }else{
        movieDatabase[fromDatabase.getIDByTitle(title)].data.Runtime = "";

      }
      movieDatabase[fromDatabase.getIDByTitle(title)].data.Genre = genre;
      movieDatabase[fromDatabase.getIDByTitle(title)].data.Plot = summary;
      res.send();
    }else{
      if(fromDatabase.getIDByTitle(title)){
        //if the movie already exists send the correct error code
        res.status(451).send();
      }else{
        //the user must have entered someone who wasn't in the database, send the
        //appropriate error code
        res.status(452).send();
      }
    }
});

//toggle wether or not the client calling this route follows the person
app.get("/followPerson", (req, res) =>{
  let person = req.query.name.trim();
  let user = req.session.username;
  let checked = req.query.flag;
  if(checked === "checked"){
    fromDatabase.followPeople(user, person, peopleDatabase, allUsers);
  }else{
    fromDatabase.unfollowPerson(user, person, peopleDatabase, allUsers);
  }
});

//toggle wether or not the client calling this route follows the user
app.get("/followUnfollowUser", (req, res) =>{
  if(req.query.follow === "Follow"){
    fromDatabase.followUser(req.session.username, req.query.user, allUsers);
  }else{
    fromDatabase.unfollowUser(req.session.username, req.query.user, allUsers);
  }
  res.send();
});

//listen at the appropriate port
app.listen(port, ()=>{
  console.log("Currently Listening at http:/localHost: " + port)
});
