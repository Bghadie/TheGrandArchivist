const fs = require('fs');

const allInformation = require("./movie-data.json");
database = {};

// creates movie database:
index = 0;
for(films of allInformation){
  let data = films
  database[index] = {data}
  database[index].data.review = {};
  index++;
}
let json = JSON.stringify(database);
fs.writeFile('movieDatabase1.json', json, 'utf8', function(err) {
    if (err) throw err;
    console.log('complete');
    }
);

/*
id = 1000000;
count = 0;
for(films of allInformation){
  console.log(count++)
  for(writers of films.Writer.split(",")){
    let person = {profession: "WRITER", name: writers.trim(), films: films.Title};
    if(!containsObject(person, database)){
      //Remove the paraentheses from any writers that contain them
      let newPerson = removePara(person);
      database[id] = newPerson;
      id++;
    }else{
      let id = getIDByName(database, person.name);
      database[id].films += "," + films.Title;
    }
  }
  for(actor of films.Actors.split(",")){
    let person = {profession: "ACTOR", name: actor.trim(), films: films.Title};
    if(!containsObject(person, database)){
      let newPerson = removePara(person);
      database[id] = newPerson;
      id++;
    }else{
      let id = getIDByName(database, person.name);
      database[id].films += "," + films.Title;
    }
  }
  for(director of films.Director.split(",")){
    let person = {profession: "DIRECTOR", name: director.trim(), films: films.Title};
    if(!containsObject(person, database)){
      let newPerson = removePara(person);
      database[id] = newPerson;
      id++;
    }else{
      let id = getIDByName(database, person.name);
      database[id].films += "," + films.Title;
    }
  }
}
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
function getIDByName(object, value) {
  return Object.keys(object).find(key => JSON.stringify(object[key].name.toUpperCase()) === JSON.stringify(value.toUpperCase()));
}
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

let json = JSON.stringify(database);
fs.writeFile('peopleDatabase.json', json, 'utf8', function(err) {
    if (err) throw err;
    console.log('complete');
    }
);*/
