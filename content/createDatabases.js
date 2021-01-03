const mongoose = require("mongoose");

let database = require("./movieDatabase.json")

let mongoooseDB = [];

for(keys of Object.keys(database)){
  database[keys].data.review = JSON.stringify(database[keys].data.review);
  mongoooseDB.push(database[keys].data)
}


mongoose.connect("mongodb://localhost:27017/Movies", {useNewURLParser:true});
let db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to Mongoose"));


let movieSchema = mongoose.Schema({
  Title: {type: String,required:true},
  Year: {type: String,required:true},
  Rated: {type: String,required:true},
  Released: {type: String,required:true},
  Runtime: {type: String,required:true},
  Genre: {type: String,required:true},
  Director: {type: String,required:true},
  Writer: {type: String,required:true},
  Actors: {type: String,required:true},
  Plot: {type: String,required:true},
  Poster: {type: String,required:true},
  Ratings: {type: Array,required:true},
  Metascore: {type: String,required:true},
  imdbRating: {type: String,required:true},
  review: {type: String,required:true},
  id: {type: Number,required:true},
  recommended: {type: Array,required:true},
});

let movieModel = mongoose.model("movies", movieSchema);

// Add tables to our database (populating the database)
function databaseInitializer()
{
    movieModel.collection.drop(); //erase existing database

    movieModel.insertMany(mongoooseDB, function(err,result)
    {
      console.log(result)
        if(err) throw err;
    });

}
databaseInitializer();
