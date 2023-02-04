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

# Przygotowanie scalera w celu standaryzacji danych.
# Dzięki temu dane będzie można wykorzystać w żądanym formacie od -1 do 1
def scale_songs_numeric_data(data):

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
        # song_data = find_song(song['name'], song['year'])
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


def recommend_songs(song_list, spotify_data, n_songs=10):
    
    all_songs_pipeline = scale_songs_numeric_data(spotify_data)

    metadata_cols = ['name', 'year', 'artists']
    song_dict = flatten_dict_list(song_list)
    
    # Find mean of songs attributes from input list
    song_center = get_mean_vector(song_list, spotify_data)
    # Transform all songs dataset attributes
    scaled_data = all_songs_pipeline.transform(spotify_data[number_cols])
    # Transform input song
    scaled_song_center = all_songs_pipeline.transform(song_center.reshape(1, -1))
    
    # Calculate distances (Songs closest to input songs)
    distances = cdist(scaled_song_center, scaled_data, 'cosine')
    # Sort and pick best ones
    index = list(np.argsort(distances)[:, :n_songs][0])
    
    rec_songs = spotify_data.iloc[index]
    rec_songs = rec_songs[~rec_songs['name'].isin(song_dict['name'])]
    return rec_songs[metadata_cols].to_dict(orient='records')