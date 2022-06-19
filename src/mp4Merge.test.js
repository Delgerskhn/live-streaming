const { getStreamDir } = require("./helpers/ssPaths");
const { getFileNames, concatMp4, writeFileList } = require("./storageService");
const fs = require("fs");
describe("Should merge live videos", () => {
  afterAll(() => {
    console.log("after");
  });

  test("Should get all mp4 file names in dir", () => {
    let dir = getStreamDir("testDir");
    let fileNames = getFileNames(dir);
    console.log(fileNames);
    expect(fileNames.split("\n").length).toEqual(3);
  });
});
