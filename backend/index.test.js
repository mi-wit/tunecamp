import request from "supertest";
const baseURL = "http://localhost:3000/api";

describe("POST /recommend", () => {
    const DEFAULT_NUM_OF_RECOMMENDATIONS = 5;
    const inputSongs = [
        { 'id': '2kRFrWaLWiKq48YYVdGcm8', 'name': 'Everything In Its Right Place', 'year': 2000 },
        { 'id': '4CeeEOM32jQcH3eN9Q2dGj', 'name': 'Smells Like Teen Spirit', 'year': 1991 },
        { 'id': '1FoUsSi9BCTlNt2Vd7V8XA', 'name': 'Optimistic', 'year': 2000 },
        { 'id': '63OQupATfueTdZMWTxW03A', 'name': 'Karma Police', 'year': 1997 },
        { 'id': '10nyNJ6zNy2YVYLrcwLccB', 'name': 'No Surprises', 'year': 1997 },
        { 'id': '', 'name': 'Song that does not exist', 'year': 1800 },
        { 'id': '2ownDSIYHvydbtauGZW4ln', 'name': 'You Will Never Work In Television Again', 'year': 2022 },
        { 'id': '0ks2zjjl7XhJVqBU60GhHR', 'name': 'We Don\'t Know What Tomorrow Brings', 'year': 2022 },
    ];

    let response;
    beforeAll(async () => {
        response = await request(baseURL).post("/recommend").send(inputSongs);
    });

    it("Should return 200", async () => {
        expect(response.statusCode).toBe(200);
    });
    
    it("Should return at least 5 recommendations", async () => {
        expect(response.body.body.tracks.length).toBeGreaterThan(DEFAULT_NUM_OF_RECOMMENDATIONS);
    });

    it("Should return songs", async () => {
        const song = response.body.body.tracks[0];
        expect(song).toHaveProperty('id');
        expect(song).toHaveProperty('name');
        expect(song).toHaveProperty('album');
    });
});

describe("POST /recommend only one song that does not exist in dataset", () => {
    const DEFAULT_NUM_OF_RECOMMENDATIONS = 5;
    const inputSongs = [
        { 'id': '66pyIjGqsggVOBIcKl2oKS', 'name': 'Metropolis', 'year': 2021 },
    ];

    let response;
    beforeAll(async () => {
        response = await request(baseURL).post("/recommend").send(inputSongs);
    });

    it("Should return 200", async () => {
        expect(response.statusCode).toBe(200);
    });
    
    it("Should return at least 5 recommendations", async () => {
        expect(response.body.body.tracks.length).toBeGreaterThan(DEFAULT_NUM_OF_RECOMMENDATIONS);
    });

    it("Should return songs", async () => {
        const song = response.body.body.tracks[0];
        expect(song).toHaveProperty('id');
        expect(song).toHaveProperty('name');
        expect(song).toHaveProperty('album');
    });
});

describe("POST /recommend returning same songs for different input", () => {
    const DEFAULT_NUM_OF_RECOMMENDATIONS = 5;
    const inputSongs = [
        { 'id': '3acVF2BODFmqy6igvdJjZP', 'name': 'AAAAA', 'year': 2018 },
        { 'id': '1mea3bSkSGXuIRvnydlB5b', 'name': 'Viva La Vida', 'year': 2008 },
    ];

    let response;
    beforeAll(async () => {
        response = await request(baseURL).post("/recommend").send(inputSongs);
    });

    it("Should return 200", async () => {
        expect(response.statusCode).toBe(200);
    });
    
    it("Should return at least 5 recommendations", async () => {
        expect(response.body.body.tracks.length).toBeGreaterThan(DEFAULT_NUM_OF_RECOMMENDATIONS);
    });

    it("Should return songs", async () => {
        const song = response.body.body.tracks[0];
        expect(song).toHaveProperty('id');
        expect(song).toHaveProperty('name');
        expect(song).toHaveProperty('album');
    });

    it("Should not be the same weird songs", async () => {
        const song = response.body.body.tracks[0];
        expect(song.artists[0]).not().toBe('Sergei Rachmaninoff');
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

// describe("Get /search, but empty", () => {
//     it("Should return error code 400", async () => {
//         const res = await request(baseURL).get("/search");
//         console.log(res);
//         expect(res.statusCode).toBe(400);
//     });
// });