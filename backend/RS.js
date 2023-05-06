import { readFileSync } from "fs";
import { DataFrame } from "dataframe-js";
import { mean, std } from 'mathjs'
import { resolve } from "path";

async function readData() {
    const data = await DataFrame.fromCSV(resolve("./spotify-dataset/data.csv")).then(df => {
        df = df.withColumn(
            "artists",
            (row) => row.get("artists").replace(/\[|\]|'/g, "")
        );
        return df
    });

    return data;
}

const numberCols = ['valence', 'year', 'acousticness', 'danceability', 'duration_ms', 'energy', 'explicit',
    'instrumentalness', 'key', 'liveness', 'loudness', 'mode', 'popularity', 'speechiness', 'tempo'];

async function fitSongsNumericData(data) {
    const scaler = (x) => (x - mean(x)) / std(x);

    for await (const column of numberCols) {
        await data.chain(
            row => row.set(column, scaler(row.get(column)))
        );
    }

    return data;
}

async function recommendSongs(inputSongList, spotifyData, nSongs = 10) {
    spotifyData = await readData();
    // console.log(spotifyData.head());
    // console.log(spotifyData.listColumns());
    const scaledData = await fitSongsNumericData(spotifyData);
    console.log(scaledData.getRow(1));
    // const songCenter = getMeanVector(inputSongList, spotifyData);

}

recommendSongs([], []);