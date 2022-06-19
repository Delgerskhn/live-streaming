const {
  INCREMENTAL_RETRY_REQUEST_INITIAL_DELAY_SECONDS,
} = require("../appConfig");
const { incrementalRetry } = require("./incrementalRetry");

describe("Incrementally request over http", () => {
  let mockCallback;
  beforeEach(() => {
    mockCallback = jest.fn(() => {
      return Promise.resolve({
        status: 500,
      });
    });
  });
  test(`Should increment timeout period`, async () => {
    await incrementalRetry({ requestFn: mockCallback, timeIncrementUnit: 1 });

    setTimeout(() => {
      console.log(mockCallback.mock.calls.length);
      expect(mockCallback.mock.calls.length).toBe(1);
    }, 1000);

    setTimeout(() => {
      console.log(mockCallback.mock.calls.length);
      expect(mockCallback.mock.calls.length).toBe(2);
    }, 2500);
  });

  //   test("should call callback", async () => {
  //     await incrementalRetry({ requestFn: mockCallback, timeIncrementUnit: 0 });
  //     expect(mockCallback.mock.calls.length).toBe(1);
  //     jest.runAllTimers();
  //     expect(mockCallback.mock.calls.length).toBe(2);
  //   });
});
