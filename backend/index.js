import { python } from "pythonia";
import SpotifyWebApi from 'spotify-web-api-node';

// credentials are optional
var spotifyWebApi = new SpotifyWebApi({
    clientId: 'f202f5c368574d2090c0ebb673923466',
    clientSecret: 'a3d32684fd8c461bbc783bdca305ef14'
});
// Retrieve an access token.
spotifyWebApi.clientCredentialsGrant().then(
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
).then(
    async function (spotifyApi) {

        const rs = await python("./recomendation.py");
        const spotifySongsData = await rs.read_data()
        // console.log(spotifySongsData);

        const songs = [
            { 'name': 'Everything In Its Right Place', 'year': 2000 },
            { 'name': 'Smells Like Teen Spirit', 'year': 1991 },
            { 'name': 'Optimistic', 'year': 2000 },
            { 'name': 'Karma Police', 'year': 1997 },
            { 'name': 'No Surprises', 'year': 1997 },
            { 'name': 'Song that does not exist', 'year': 1800},
            { 'name': 'You Will Never Work In Television Again', 'year': 2022},
            { 'name': 'We Don\'t Know What Tomorrow Brings', 'year': 2022},

        ];

        const songsNotInDataSet = await rs.get_songs_not_present_in_dataset(spotifySongsData, songs);
        // console.log(['songs not in dataset', songsNotInDataSet]);
        const missingSongs = await getMissingSongs(await songsNotInDataSet.valueOf());
        // console.log(['found missing songs', missingSongs]);
        const supplementedDataset = await fillDataSetWithMissingSongs(spotifySongsData, missingSongs);

        console.log(await rs.recommend_songs(songs, supplementedDataset));

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
            const audioForAllTracksFeatures = await spotifyApi.getAudioFeaturesForTracks(ids);
        
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
            return spotifyApi.searchTracks(`track:${_name} year:${_year}`)
            .then(
                function (data) {
                    return data
                },
                function(err) {
                    console.log(`error occurred: ${err}`);
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
                _spotifySongsData = await _spotifySongsData.append$(song, {ignore_index: true});
            }

            return _spotifySongsData;
        }

    }
);




