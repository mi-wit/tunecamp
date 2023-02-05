import { python } from "pythonia";
import SpotifyWebApi from 'spotify-web-api-node';
import express from 'express';
import bodyParser from 'express';

const app = new express();
const port = 3000
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

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

app.post('/recommend', async (req, res) => {
    const songs = req.body;
    const rs = await python("./recomendation.py");
            const spotifySongsData = await rs.read_data()

            const songsNotInDataSet = await rs.get_songs_not_present_in_dataset(spotifySongsData, songs);
            const missingSongs = await getMissingSongs(await songsNotInDataSet.valueOf());
            const supplementedDataset = await fillDataSetWithMissingSongs(spotifySongsData, missingSongs);

            const results = await rs.recommend_songs(songs, supplementedDataset);
            res.status(200).json(results);


            python.exit();

            async function getMissingSongs(_songsNotInDataset) {
                const missingSongs = [];
                for (const missingSong of _songsNotInDataset) {
                    const results = await searchForTrack(missingSong.name, missingSong.year);

                    if (results.body.tracks.items && results.body.tracks.items.length > 0) {
                        let foundSong = results.body.tracks.items[0];
                        missingSongs.push(
                            {
                                id: foundSong.id,
                                name: foundSong.name,
                                year: missingSong.year,
                                explicit: Number(foundSong.explicit),
                                duration_ms: foundSong.duration_ms,
                                popularity: foundSong.popularity
                            });
                    }
                }

                const ids = missingSongs.map(song => song.id);
                const audioForAllTracksFeatures = await spotifyWebApi.getAudioFeaturesForTracks(ids);

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

            async function searchForTrack(_name, _year) {
                return spotifyWebApi.searchTracks(`track:${_name} year:${_year}`)
                    .then(
                        function (data) {
                            return data
                        },
                        function (err) {
                            console.log(`error occurred, during searching for track: ${err}`);
                        }
                    );
            }


            async function fillDataSetWithMissingSongs(_spotifySongsData, _missingSongs) {
                const pd = await python('pandas');
                for await (const missingSong of _missingSongs) {
                    delete missingSong.type;
                    delete missingSong.uri;
                    delete missingSong.track_href;
                    delete missingSong.analysis_url;
                    delete missingSong.time_signature;

                    const song = await pd.DataFrame([missingSong]);
                    _spotifySongsData = await _spotifySongsData.append$(song, { ignore_index: true });
                }

                return _spotifySongsData;
            }
});


app.get('/search', async (req, res) => {
    console.log(req.query);

    const results = await spotifyWebApi.searchTracks(req.query.q);
    console.log(results.body.tracks);
    res.status(200).json(results);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

