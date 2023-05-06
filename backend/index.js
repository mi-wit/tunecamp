import { python } from "pythonia";
import SpotifyWebApi from 'spotify-web-api-node';
import express from 'express';
import bodyParser from 'express';
import cors from 'cors';

const app = new express();
const port = 3000
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors());

app.use(express.static('dist/tunecamp-frontend', {root: '.'}));

// credentials are optional
var spotifyWebApi = new SpotifyWebApi({
    clientId: 'f202f5c368574d2090c0ebb673923466',
    clientSecret: 'a3d32684fd8c461bbc783bdca305ef14'
});
// Retrieve an access token.
await spotifyWebApi.clientCredentialsGrant().then(
    function (data) {
        // Save the access token so that it's used in future calls
        spotifyWebApi.setAccessToken(data.body['access_token']);

        // console.log('The access token ' + data.body['access_token']);
        // console.log('The access token is ' + spotifyApi.getAccessToken());
        return spotifyWebApi
    },
    function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    }
);

let spotifySongsData;
let rs;

app.post('/api/recommend', wrapAsync( async (req, res) => {
    const songs = req.body;

    const songsNotInDataSet = await rs.get_songs_not_present_in_dataset(spotifySongsData, songs);
    // console.log(['songs not in dataset', songsNotInDataSet, 'all songs', songs]);
    const missingSongs = await getMissingSongs(await songsNotInDataSet.valueOf());
    // console.log(['founbd songs', missingSongs]);
    const supplementedDataset = await fillDataSetWithMissingSongs(spotifySongsData, missingSongs);
    const results = await rs.recommend_songs(songs, supplementedDataset);
    
    const tracksWithAllInfo = await getAllTracksInfo(results);
    
    res.status(200).json(tracksWithAllInfo);



}));

async function getMissingSongs(_songsNotInDataset) {
    if (_songsNotInDataset.length <= 0) {
        return [];
    }

    const missingSongs = [];

    const ids = _songsNotInDataset.map((track) => track.id);
    const results = await spotifyWebApi.getTracks(ids);
    for (const missingSong of results.body.tracks) {
        if (missingSong) {
            missingSongs.push(
            {
                id: missingSong.id,
                name: missingSong.name,
                year: new Date(missingSong.album.release_date).getFullYear(),
                explicit: Number(missingSong.explicit),
                duration_ms: missingSong.duration_ms,
                popularity: missingSong.popularity
            });
        }
    }

    const ids_for_features = missingSongs.map(song => song.id);
    const audioForAllTracksFeatures = await spotifyWebApi.getAudioFeaturesForTracks(ids_for_features);

    for (const song of missingSongs) {
        const audioTrackFeatures =
            audioForAllTracksFeatures.body.audio_features
                .find(features => features.id === song.id);

        for (let key in audioTrackFeatures) {
            const value = audioTrackFeatures[key];
            song[key] = value;
        }
    }
    return missingSongs;
}

async function fillDataSetWithMissingSongs(_spotifySongsData, _missingSongs) {
    const pd = await python('pandas');
    let songs = [];
    for await (const missingSong of _missingSongs) {
        delete missingSong.type;
        delete missingSong.uri;
        delete missingSong.track_href;
        delete missingSong.analysis_url;
        delete missingSong.time_signature;

        songs.push(await missingSong);
    }
    const coll = await pd.DataFrame(songs);
    _spotifySongsData = await pd.concat$([_spotifySongsData, coll], { ignore_index: true });

    return _spotifySongsData;
}

async function getAllTracksInfo(_tracks) {
    const ids = JSON.parse(_tracks).map((track) => track.id);
    return await spotifyWebApi.getTracks(ids);
}

app.get('/api/search', wrapAsync(async (req, res) => {
    const results = await spotifyWebApi.searchTracks(req.query.q)
    .then((data) => {
        res.json(data);
    }, (error) => {
        res.json(error);
    });

}));

app.listen(port, async () => {
    // load python script
    rs = await python("./recomendation.py");
    // load songs dataset
    spotifySongsData = await rs.read_data();
    console.log(`Example app listening on port ${port}`)
})


// used for handling async errors
function wrapAsync(fn) {
    return function(req, res, next) {
      fn(req, res, next).catch(next);
    };
  }