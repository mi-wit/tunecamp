import os
import numpy as np
import pandas as pd

from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

from collections import defaultdict
from scipy.spatial.distance import cdist

def read_data():
    data = pd.read_csv("./spotify-dataset/data.csv")
    data['artists'] = data['artists'].apply(lambda x: x[1:-1].replace("'", ''))
    return data

# Przygotowanie scaler'a w celu standaryzacji danych.
# Dzięki temu dane będzie można wykorzystać w żądanym formacie od -1 do 1
def fit_songs_numeric_data(data):

    all_songs_pipeline = Pipeline([('scaler', StandardScaler())], verbose=False)

    X = data.select_dtypes(np.number)
    # number_cols = list(X.columns)
    all_songs_pipeline.fit(X)

    return all_songs_pipeline

def get_songs_not_present_in_dataset(spotify_data, songs):
    not_present_songs = []

    for song in songs:
        try:
            song_data = spotify_data[(spotify_data['name'] == song['name']) 
                                    & (spotify_data['year'] == song['year'])].iloc[0]
        except IndexError:
            not_present_songs.append(song)

    return not_present_songs



number_cols = ['valence', 'year', 'acousticness', 'danceability', 'duration_ms', 'energy', 'explicit',
    'instrumentalness', 'key', 'liveness', 'loudness', 'mode', 'popularity', 'speechiness', 'tempo']


def get_song_data(song, spotify_data):
    
    try:
        song_data = spotify_data[(spotify_data['name'] == song['name']) 
                                & (spotify_data['year'] == song['year'])].iloc[0]
        return song_data
    
    except IndexError:
        song_data = None
        return song_data
        

def get_mean_vector(song_list, spotify_data):
    
    song_vectors = []
    
    for song in song_list:
        song_data = get_song_data(song, spotify_data)
        if song_data is None:
            print('Warning: {} does not exist in Spotify or in database'.format(song['name']))
            continue
        song_vector = song_data[number_cols].values
        song_vectors.append(song_vector)  
    
    song_matrix = np.array(list(song_vectors))
    return np.mean(song_matrix, axis=0)


def flatten_dict_list(dict_list):
    
    flattened_dict = defaultdict()
    for key in dict_list[0].keys():
        flattened_dict[key] = []
    
    for dictionary in dict_list:
        for key, value in dictionary.items():
            flattened_dict[key].append(value)
            
    return flattened_dict


def recommend_songs(input_song_list, spotify_data, n_songs=10):
    
    # Fit the numeric data of all songs in spotify_data (compute the mean)
    all_songs_pipeline = fit_songs_numeric_data(spotify_data)
    
    # Find mean of songs attributes from input list
    song_center = get_mean_vector(input_song_list, spotify_data)
    # Scale the numeric data of all songs in spotify_data
    scaled_data = all_songs_pipeline.transform(spotify_data[number_cols])
    # Scale the numeric data of song_center using the same pipeline
    scaled_song_center = all_songs_pipeline.transform(song_center.reshape(1, -1))
    
    # Calculate cosine distances (Songs closest to input songs)
    distances = cdist(scaled_song_center, scaled_data, 'cosine')
    # Get index'es of the n_songs closest to song_center
    index = list(np.argsort(distances)[:, :n_songs][0])
    
    # Create a dictionary from input_song_list
    song_dict = flatten_dict_list(input_song_list)
    # Select recommended songs from spotify_data using index'es
    recommended_songs = spotify_data.iloc[index]
    # Filter out songs that are already in song_list
    recommended_songs = recommended_songs[~recommended_songs['name'].isin(song_dict['name'])]
    
    metadata_cols = ['name', 'year', 'artists', 'id']
    return recommended_songs[metadata_cols].to_json(orient='records')