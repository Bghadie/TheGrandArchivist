Name: Billal Ghadie
Student# 100888260
Project: Movie Database
Partner: None

Installations:  

	•	Everything should be downloaded and installed.
		All you need to do is go into the "The Grand
		Cinema" directory through terminal and type:
			"npm start"

	•	If there is some error, enter "npm install" then
		try npm start again.

Open Stack Information:

	•	Instance ID: BillalGhadie 
	•	Public IP: 134.117.128.84
	•	Username: Student 
	•	Password: GrandCinema 


Running & Testing:

	•	Running the server is fairly straightforward. Simply 
		call “node movieServer.js” or “npm start” in your 
		command line and open up http://localhost:3000/ in 
		google chrome. 


	•	To help streamline testing I've set up to users in the 
		database:

		•	Username: JeganPurushothaman
			•	Password: Password123

		•	Username: BillalGhadie
			•	Password: Password123

	•	I suggest logging in under Jegan to test a majority of 
		the functionality (you are not a contributing user). Of 
		key importance, leave a couple of reviews on some 
		movies. Billal is actually 
		following Jegan. So after you are done a majority of 
		your testing, log into Billal's account to test the 
		notification system (i.e., an alert should be sent 
		when ever Jegan writes a review). 

	•	Some other things to note with respects to testing.

		•	You can use the auto generate portion of 
			adding movies to create a bunch of movies 
			(specify some number) and add it to the 
			database. I made sure that doing so would 
			console log the title of any movie you added 
			this way so you can search the title. Also, if you 
			want to test the "add a new person to the 
			database", add yourself to "Toy Story".
	
		•	To test a multi parametric search, go to the home page, select the search criteria you 
			would like (i.e., Title, Genre, Mini-rating, Year) then enter something into the search 
			bar. Do not press "search", instead, press "Add Search Criteria". You have now filtered 
			you search. You can do this for any combination of the remaining search criteria. Once 
			you have build your search, press the search button. 

List of HTML/CSS/Pug/JS Files:

1) HTML - Unimportant, there only as backups  

2) CSS - All my CSS files, used to make my website “pretty”. 
		The names of each CSS file should be nearly 
		identical to the page that they style. I incorporated flex 
		box everywhere. The files can be found in the 
		“layouts” folder, and unless you’re curious about 
		some specific feature, I’d ignore these:

		•	AddStyle.css (the layout for the adding movies/
			reviews/people page).

		•	SimilarMovies.css (the layout for when a search 
			result matches multiple criteria).

3) PUG files - All my pug files, found in the “views” folder, that 
			are used to dynamically build each webpage 
			when needed. I couldn’t figure out how to 
			comment in pug but its all fairly self explanatory I 
			think:

	•	ViewAddMovie.pug
	•	ViewAddPerson.pug
	•	ViewAddReview.pug
	•	ViewSimilarUsers.pug
	•	ViewPeople.pug
	•	ViewMovieList.pug
	•	ViewGenre.pug
	•	ViewLoginpage.pug

	•	ReccMovieGen.pug (this is actually only part of a 
		webpage, the part with all similar movies, that is 
		rendered after a user navigates to a specific movie. 
		Stands for Recommend Movie General)


4) JS files - There are a few JavaScripts file so rather than 
		      broadly summarizing them all, I’ll include a 
		      description with each one listed. Most of my JS 
		      files are saved in the “content” folder except for 
		      movieServer.js:

	•	movieServer.js
		⁃	My server. All requests are found here.

	•	buisnessLogic.js
		⁃	Every function my server calls is found in here. 

	•	ViewPeopleFunctionality.js
		⁃	Code that adds functionality when viewing a 
			person's page. Namely, it makes calls to the 
			server for logging in/returning back to the logged 
			in users account, the ability to follow/unfollow the 
			person, and for directing users to different pages 
			if they press on movie titles/people's names listed 
			in this page.

	•	ViewMovieFunctionality.js
		⁃	Code that adds functionality when viewing a 
			movie's page. Namely, it makes calls to the 
			server for logging in/returning back to the logged 
			in users account, the ability to add a review or a 
			person to the movie, and for directing users to 
			different pages if they press on movie titles/
			people's names/genres/etc listed in this page.

	•	SearchFunctionality.js
		⁃	Code that adds the searching functionality to my 
			database. It creates a query string of what ever 
			the search field yields and sends it to the server, 
			with the appropriate requests. The server 
			redirects the user to the appropriate page based 
			on the search criteria. Furthermore, it makes calls 
			to the server to redirect users to the add person/
			movie to the database page, the login page, or 
			back to the signed in users account

	•	loginFunctionality.js
		⁃	This code makes calls to the server to validate 
			the user's input and log the user in/create a new 
			account (which then adds them to the database).

	•	userDatabase.json, movieDatabase.json, peopleDatabase.json
		⁃	My pre-made, sort of janky databases. Hopefully 
			these are temporary and will be replaced with 
			some Mongo DB's.
		-	Note, movie ID's range from 0 - 9124, and people 
			ID's range from 1000000 - 1039845

	•	addMovieFunctionality.js
		⁃	This code makes the request that adds a movie to 
			the database if the listed specifications are met. 
			Kinda tedious, so maybe add one or two movies 
			yourself then use the "auto generate" 
			functionality.

	•	addReviewFunctionality.js
		⁃	This code makes the requests to add a partial or 
			full review to the current movie being viewed. 
			After a review has been added it will redirect you 
			back to the movie page so you can see your 
			review. NOTE, you can only add one review per 
			user, try to add more, it'll just overwrite your 
			previous review. Also, the portion of the webpage 
			that displays the review does not grow infinitely. If 
			the max size if met, you will have to scroll through 
			the reviews (the horizontal scroll attribute is set)

	•	addPersonFunctionality.js
		⁃	This code makes the request to the server that 
			adds people to the database OR to a specific movie, 
			depending on the given parameters. Namely, the 
			server sends a title to this page in the query string, it 
			must want to add the person to a movie. If no title is 
			specified, its adding the person database. 
			Depending on which the functionality changes 
			slightly. That is, you can't add a non existing person 
			to a movie and you can't add an already existing 
			person to the database. You must specify  either 
			"Director", "Actor" or "Director" (its not case  
			sensitive). 

	•	userFunctionality.js
		⁃	All the server requests that need to be made 
			when viewing the user page is done with this 
			code. For example, if you are visiting  a user's page 
			and logged in, you can follow the user, stop 
			following the user, see if they are contributing 
			(the checkbox next to "contributing" will be 
			checked) or not, and navigate to the movies 
			they've reviewed, the people they follow, or the 
			user's they follow. What's more, if you are logged 
			in you can navigate back to your personal page, if you 
			aren't logged in you can navigate to the log in 
			page. If you are visiting our own page you can 
			switch to and from a contributing user and you 
			can logout, as well as do all that navigating stuff. 

	•	matchedSearchCriteria.js
		⁃	There is a LOT of code in this one, let me explain. 
			Consider a user who searched for a movie with 
			"the" in the title. Thats a lot of movies (about 2850 
			of them!). Ideally, I only want to display 50 movies 
			per page so I'm going to need 57 pages total that 
			the user will be able to navigate through. Well 
			this JS file handles navigating to the next/
			previous page. But not just for movie searches, 
			this file handles the next/prev functionality for any 
			search criteria that yields a multiple results. Also, 
			the searched results are links that the user can 
			press to navigate to that links page. Take a 
			look at the "ViewMovieList.pug" file, you'll notice 
			that each movie title has a link called 
			"findMovie" (note, the function takes a single 
			parameter, the object calling it. This way I can get 
			the movie title name. All clickable links have this 
			feature). The findMovie function, and all similar 	
			functions, are handled by this JS file. 

	

5) API - so far I've only included the following functionality:

	•	Listing all the API requests would be tedious at best. 
		There are a ton of them but I did my best to 1) name 
		them appropriated and 2) add a comment describing 
		what they do.

6) Miscellaneous files:

	•	movieRecommender.py
		⁃	Uses a movie's genres, actors, and directors (and 
			a nifty little algorithm) to generate similar movies/
			movies I could recommend to the user. 


	•	DataFrame.csv
		⁃	A database of "valid movies" which I use to 
			generate my list of recommended/similar movies. 
			Basically, it turns out the data Dave gave me has 
			some "invalid" entries (Search for a movie title 
			called "dupe"). I didn't know what to do with them 
			(and still don't) but they kept breaking my movie 
			recommendation algorithm. So I created a 
			separate database that removed these invalid 
			entries.
















