#CITATIONS:
#https://www.kaggle.com/rounakbanik/movie-recommender-systems/comments **Big thank you here
#https://www.kaggle.com/flaviobossolan/simple-efficient-movie-recommender
#https://towardsdatascience.com/the-4-recommendation-engines-that-can-predict-your-movie-tastes-109dc4e10c52
#https://cmry.github.io/notes/euclidean-v-cosine //why use cosine sim over euclidian distance


import numpy as np
import pandas as pd
import sys
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
def read_in():
    lines = sys.stdin.readlines();
    return lines;

def multiply(x):
    return [x,x,x]

def fixActors(x):
    for i in x:
        str.lower(i.replace(" ", ""))
        str.lower(i.replace(",", ""))
    return x;

def main():
    def movieRecommender(index):
        similarity_scores = list(enumerate(cosine_sim[index]))
        similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
        similarity_scores = similarity_scores[1:31]
        movie_indices = [i[0] for i in similarity_scores]
        return df_transposed.Title.iloc[movie_indices]

    lines = read_in()
    movieInfo = lines[0].split(",")
    df_transposed = pd.read_csv("./content/DataFrame.csv")
    df_transposed.Actors = df_transposed.Actors.apply(lambda x: [str.lower(i.replace(" ", "")) for i in x])
    df_transposed.Director = df_transposed.Director.apply(lambda x: str.lower(x.replace(" ", "")))
    df_transposed.Genre = df_transposed.Genre.apply(lambda x: [str.lower(x.replace(" ", ""))])

    #adds director four times (arbitrarily chosen) to give algorithm more weight
    df_transposed.Director = df_transposed.Director.apply(multiply)


    df_transposed["Amalgamate"] = df_transposed["Director"] + df_transposed["Actors"]+df_transposed["Genre"] + df_transposed["Genre"]
    df_transposed["Amalgamate"] = df_transposed["Amalgamate"].apply(lambda x: ' '.join(x))

    count = CountVectorizer(analyzer = "word",ngram_range=(1, 2),min_df=0, stop_words='english')
    count_matrix = count.fit_transform(df_transposed.Amalgamate)

    cosine_sim = cosine_similarity(count_matrix, count_matrix)
    index = pd.Series(df_transposed.index, index=df_transposed['Title'])[movieInfo[0]]


    #The recommender
    if(isinstance(index, (int, np.integer))):
        #takes a movie title
        placeHolder = movieRecommender(index).head(10)
        someString = ""
        for i in placeHolder:
            for letters in i:
                someString += letters
            someString+="|"
        print(someString)

    else:
        someString = ""
        #this should iterate over all movies with given title and find the correct one
        for i in range(len(index)):
            if(df_transposed.iloc[index[i]].Year == movieInfo[1].rstrip()):
                placeHolder = movieRecommender(index[i]).head(10)
                for i in placeHolder:
                    someString += "|"
                    for letters in i:
                        someString += letters
                    someString+="|"
        print(someString)


if __name__ == '__main__':
    main()
