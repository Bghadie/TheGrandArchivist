#CITATIONS:
#https://towardsdatascience.com/the-4-recommendation-engines-that-can-predict-your-movie-tastes-109dc4e10c52
#https://cmry.github.io/notes/euclidean-v-cosine //why use cosine sim over euclidian distance

#import all librarys
import numpy as np
import pandas as pd
import sys
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

#my read in function that gets args from the command line
def read_in():
    lines = sys.stdin.readlines();
    return lines;

#increases the "weight" of a particular feature of a movie
def multiply(x):
    return [x,x,x]

def main():
    #this function is my actual movie recommender
    def movieRecommender(index):
        #get the similarity scores from the matrix at the given index
        similarity_scores = list(enumerate(cosine_sim[index]))
        #sore the similarity scores in descending order. NOTE the key in this case is the similarity scores, by nature of how dataframes are set up
        #that is, each score is actually an index and a score (i.e., (0, 0.7), (1, 0.6), etc)
        similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
        #get the top 31 movies based on dimilarity
        similarity_scores = similarity_scores[1:31]
        #Dataframe things, gets the actual indecies of the top 31 movies
        movie_indices = [i[0] for i in similarity_scores]
        #return the similar movies
        return df_transposed.Title.iloc[movie_indices]

    newThings = []
    #with open("mongooseMovieDatabase.json") as json_file:
#        data = json.load(json_file);
#        for p in data:
#            newThings.append(p)
    #get the dataframe
    df_transposed = pd.read_csv("./DataFrame.csv")
    #These three functions get the actors, directors, and genres of the given movie title. Note the lambda functions are used to
    #make the data more readable (i.e., remove white spaces, remove commas, etc)

    df_transposed.Actors = df_transposed.Actors.apply(lambda x: [str.lower(i.replace(" ", "")) for i in x])
    df_transposed.Director = df_transposed.Director.apply(lambda x: str.lower(x.replace(" ", "")))
    df_transposed.Genre = df_transposed.Genre.apply(lambda x: [str.lower(x.replace(" ", ""))])

    #adds director three times (arbitrarily chosen) to give algorithm more weight
    #Because I felt that the director should have more weight on a movies similarities (e.g., two movies directed by the same person are probably kinda similar, take M. Knight Shamalyan for example)
    #I trippled the amount of times the director is added in the databse, giving it more weight
    df_transposed.Director = df_transposed.Director.apply(multiply)

    #create a new column with all the data joined together by a single space that will be used to determine how similar movies are
    df_transposed["Amalgamate"] = df_transposed["Director"] + df_transposed["Actors"]+df_transposed["Genre"] + df_transposed["Genre"]
    df_transposed["Amalgamate"] = df_transposed["Amalgamate"].apply(lambda x: ' '.join(x))

    #count how many similar words each movies has with each other and store the
    #in a matrix. For example, if two movies have the same actor (3 actors),
    #director(1 director), AND genre (1 genre), the count would be 5
    # store the counts in a matrix
    count = CountVectorizer(analyzer = "word",ngram_range=(1, 2),min_df=0, stop_words='english')
    count_matrix = count.fit_transform(df_transposed.Amalgamate)
    #this nifty little function (cosine similarity), uses the counts to create a similarity
    #score between 0-1. I was initially gonna use ecludian distance but decided against it
    #I will discuss why in the final paper
    cosine_sim = cosine_similarity(count_matrix, count_matrix)

    index = pd.Series(df_transposed.index, index=df_transposed['Title'])["Cry, the Beloved Country"]

    for films in newThings:
        #read the commandline
        lines = films["Title"] + "|"+ films["Year"]

        #get the movie title (the command lime object should be a string consisting of  "title,year")
        movieInfo = lines.split("|")

        if(movieInfo[0] != "#DUPE#"):
            index = pd.Series(df_transposed.index, index=df_transposed['Title'])[movieInfo[0]]
            if(isinstance(index, (int, np.integer))):
                placeHolder = movieRecommender(index).head(10)
                someString = ""
                for i in placeHolder:
                    for letters in i:
                        someString += letters
                    someString+="|"
                someString = someString.split("|")
                someString.pop()

            else:
                someString = ""
                #this should iterate over all movies with given title and find the correct one
                #it handles when two movies have the same name
                for i in range(len(index)):
                    if(df_transposed.iloc[index[i]].Year == movieInfo[1].rstrip()):
                        placeHolder = movieRecommender(index[i]).head(10)
                        for i in placeHolder:
                            for letters in i:
                                someString += letters
                            someString+="|"
                someString = someString.split("|")
                someString.pop()
            films["recommended"] = someString
#    with open('mongooseMovieDatabase.json', 'w') as outfile:
#        json.dump(newThings, outfile)



if __name__ == '__main__':
    main()
