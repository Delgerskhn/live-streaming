const { getStreamDir } = require("./ssPaths");

test("Should get absolute url", function () {
  let res = getStreamDir("cl0aea9hq001954vomql0tuq3");
  expect(res).toBe(
    "C:\\Users\\delge\\source\\repos\\elearn-ws\\elearn-streaming\\media\\live\\cl0aea9hq001954vomql0tuq3"
  );
});
