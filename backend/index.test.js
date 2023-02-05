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

    let response;
    beforeAll(async () => {
        response = await request(baseURL).post("/recommend").send(inputSongs);
    });

    it("Should return 200", async () => {
        expect(response.statusCode).toBe(200);
    });
    
    it("Should return at least 5 recommendations", async () => {
        expect(JSON.parse(response.body).length).toBeGreaterThan(DEFAULT_NUM_OF_RECOMMENDATIONS);
    });

    it("Should return songs", async () => {
        const song = JSON.parse(response.body)[0];
        expect(song).toHaveProperty('id');
        expect(song).toHaveProperty('name');
    });
});

describe("GET /search", () => {

    let response;
    beforeAll(async () => {
        const q = `Radiohead creep`;
        const query = {
            q: q,
        };
        response = await request(baseURL).get("/search").query(query);
    });

    it("Should return not null", async () => {
        expect(response).not.toBeNull();
    });

    it("Should return 200", async () => {
        expect(response.statusCode).toBe(200);
    });

    it("Should return Radiohead Creep", async () => {
        expect(response.body.body.tracks.items[0].name).toBe('Creep');
    });

    it("Should return few songs", async () => {
        expect(response.body.body.tracks.items.length).toBeGreaterThan(0);
        expect(response.body.body.tracks.items.length).toBeLessThan(30);
    });

    it("Should return songs", async () => {
        expect(response.body.body.tracks.items[0]).toHaveProperty('name', 'id', 'artists', 'release_day');
    });
});
