import request from "supertest";
const baseURL = "http://localhost:3000";

describe("GET /recommend", () => {
    it("Should return 200", async () => {
        const response = await request(baseURL).get("/recommend");
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(null);
    })
});