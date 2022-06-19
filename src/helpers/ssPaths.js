const path = require("path");

function getStreamDir(streamKey) {
  const dir = path.join(__dirname, "../../media/live", streamKey);

  return dir;
}

function getStreamFile(streamKey, fileName) {
  return getStreamDir(`${streamKey}/${fileName}`);
}

module.exports = {
  getStreamDir,
  getStreamFile,
};
