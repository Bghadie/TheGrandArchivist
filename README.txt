Name: Billal Ghadie
Student# 100888260
Project: Movie Database
Partner: None

Installations:  
	•	Download the file I submitted, and in the same directory, copy and paste the following into your terminal:
		"npm install"
	•	Now that all the requisite node files have been downloaded, you can test and run the server. 


Running & Testing:

	•	Running the server is fairly straightforward. Simply call “node movieServer.js” or “npm start” in your command line and open up http://localhost:3000/ in google chrome. I don’t have Firefox so I haven’t tested the server on it (feel free to try and let me know if it works!). 
	•	Now that the server is up and running, there are a few functionalities you can test:

		1.	Just press the search bar, it should bring you to a random movie page 
		2.	You can test whether any of some 10000 movies are in the database by entering their name or ID. ID’s were pseudo randomly given to each movie can range from 1 - 10000. If a movie title or ID does not exist in the database, the webpage will display some random movie (this is a temporary feature so that you can easily test the server works without having to specify a movie name/ID each time). 
		3.	You can test the login functionality by pressing the “login” link at the top right of each page
		4.	You can test test the Person’s page by pressed the name of a person (Director, Writer, or Actor) in their respective movie page
	•	If you take a look at the movieServer.js source code, you will find a bunch of commented out tests (1-8). Each test checks whether a feature of my “business logic” works. I think they are pretty self explanatory but read the comments to discern exactly what each test checks and what the output should. the The business logic of my server starts at line 127 and ends at line 470… I apologize in advance for all that code. 

List of HTML/CSS/Pug/JS Files:

1) HTML - All can be found in my HTMLFiles folder, and frankly, should just be ignored. Most of the relevant HTML files has been converted to Pug. 
	•	HomePageSkeleton.html
		⁃	The homepage for my movie database
	 	- 	The logo is still being designed (although hopefully I SHOULD be done by next check-in)
	•	Login_CreateAccountSkeleton.html
		⁃	The page wherein users can login and/or create an account
	•	PeoplePageSkeleton.html
		⁃	The page where actors/directors/other famous people and subsequent information can be viewed
	•	SkeletonViewingMovies.html
		⁃	The page that will display a movies descriptive information 
	•	UserAccount_Skeleton.html
		⁃	The webpage that will display the user’s account information 

2) CSS - All my CSS files, used to make my website “pretty”. The names of each CSS file should be nearly identical to the page that they style. I incorporated flex box everywhere. The files can be found in the “layouts” folder, and unless you’re curious about some specific feature, I’d ignore these.
	•	HomePageStyle.css
	•	Login_CreatorStyle.css
	•	PeoplePageStyle.css
	•	ViewingMoviesStyle.css
	•	UserAccountStyle.css

3) PUG files - All my pug files, found int the “views” folder, that are used to dynamically build each webpage when needed. I couldn’t figure out how to comment in pug but its all fairly self explanatory I think. Plus, I used an online HTML to pug converted so if you are curious whats going on take a look at the associated HTML files for reference. 
	•	HomePage.pug
	•	ViewMovie.pug
	•	ViewPerson.pug
	•	ViewUsers.pug

4) JS files - There are a few JavaScripts file so rather than broadly summarizing them all, I’ll include a description with each one listed. All my JS files are saved in the “content” folder.
	•	movieServer.js
		⁃	My server. A majority of the business logic is found here as well as testing procedures.
	•	ViewPeopleFunctionality.js
		⁃	Code that adds functionality to the login button when on the viewing person page, pretty rudimentary.
	•	ViewMovieFunctionality.js
		⁃	Code that adds functionality to navigate to a person’s page if the link to their name is pressed
	•	SearchFunctionality.js
		⁃	Code that adds the searching functionality to my database. It creates a query string of all the search fields to the server using a get method, then updates the current page with the servers response (ideally the found movie)
	•	loginFunctionality.js
		⁃	This code provides the functionality for validating a username and password. 

Miscellaneous files:
	•	movieDatabase.json
		⁃	The database of the provided movies as a JSON object
	•	peopleDatabase.json
		⁃	The database of all famous people in the movies database as a JSON object


5) API - so far I've only included the following functionality:
	•	GET/movies & GET/movies:id
		- Will get a movie by ID or movie title
	•	GET/person & GET/person:id
		- Will get a person by ID or their name
