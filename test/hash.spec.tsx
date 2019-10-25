import app from "apprun";

import "../src/hash";

describe("hash router", () => {
	it("should be able to be imported", () => {
		expect(app).toBeTruthy();
		expect(app.route).toBeTruthy();
	});
});
