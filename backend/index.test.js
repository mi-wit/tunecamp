import request from "supertest";
const baseURL = "http://localhost:3000";

describe("POST /recommend", () => {
    const DEFAULT_NUM_OF_RECOMMENDATIONS = 5;
    const inputSongs = [
        { 'name': 'Everything In Its Right Place', 'year': 2000 },
        { 'name': 'Smells Like Teen Spirit', 'year': 1991 },
        { 'name': 'Optimistic', 'year': 2000 },
        { 'name': 'Karma Police', 'year': 1997 },
        { 'name': 'No Surprises', 'year': 1997 },
        { 'name': 'Song that does not exist', 'year': 1800 },
        { 'name': 'You Will Never Work In Television Again', 'year': 2022 },
        { 'name': 'We Don\'t Know What Tomorrow Brings', 'year': 2022 },
    ];

    it("Should return 200", async () => {
        const response = await request(baseURL).post("/recommend").send(inputSongs);
        expect(response.statusCode).toBe(200);
    });
    
    it("Should return at least 5 recommendations", async () => {
        const response = await request(baseURL).post("/recommend").send(inputSongs);
        expect(JSON.parse(response.body).length).toBeGreaterThan(DEFAULT_NUM_OF_RECOMMENDATIONS);
    });

    it("Should return songs", async () => {
        const response = await request(baseURL).post("/recommend").send(inputSongs);
        const song = JSON.parse(response.body)[0];
        expect(song).toHaveProperty('id');
        expect(song).toHaveProperty('name');
    });
});