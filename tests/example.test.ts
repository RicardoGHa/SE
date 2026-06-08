import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "@jest/globals"


describe("Example Suite", () => {
    beforeAll(() => {
        console.log("beforeAll: running once before all tests")
    })

    beforeEach(() => {
        console.log("beforeEach: running before each test")
    })

    afterEach(() => {
        console.log("afterEach: running after each test")
    })

    afterAll(() => {
        console.log("afterAll: running once after all tests")
    })

    it("should run first test", () => {
        console.log("test: running sample test")
    })
    it("should run second test", () => {
        console.log("test: running sample test")
    })
})