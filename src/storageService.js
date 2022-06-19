const fs = require("fs");
const path = require("path");
const util = require("util");
const { getStreamDir, getStreamFile } = require("./helpers/ssPaths");
const exec = util.promisify(require("child_process").exec);
const axios = require("axios");
const FormData = require("form-data");

async function transferRecording({ courseStreamKey, token, recordedFileName }) {
  var data = new FormData();
  data.append(
    "file",
    fs.createReadStream(getStreamFile(courseStreamKey, recordedFileName))
  );

  var config = {
    method: "post",
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    url: `${process.env.STORAGE_HOST}/video?t=${token}`,
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };

  let resp = await axios(config);
  let result = await resp.data;

  return result;
}

function getFileNames(dir) {
  const fnames = fs.readdirSync(dir);
  return fnames
    .filter((r) => r.endsWith(".mp4"))
    .map((r) => `file '${r}'`)
    .join("\n");
}

function writeFileList(dir, filenames) {
  fs.writeFileSync(dir, filenames);
}

async function concatMp4({ outputName, dir, mergeFileName }) {
  const { stdout, stderr } = await exec(
    `ffmpeg -f concat -safe 0 -i ${path.join(
      dir,
      mergeFileName
    )} -c copy ${path.join(dir, outputName)}`
  );

  if (stderr) {
    console.error(`Error: ${stderr}`);
  }
  console.log(`Number of files ${stdout}`);
}

async function mergeRecords({ streamKey, outputName, mergeFileName }) {
  const liveDir = getStreamDir(streamKey);
  const fileNames = getFileNames(liveDir);
  if (fileNames.split("\n").length == 1) {
    console.info("RENAME ON SINGLE RESOURSE");
    return fs.renameSync(
      getStreamFile(
        streamKey,
        fileNames.replace("file", "").replaceAll("'", "").trim()
      ),
      path.join(liveDir, outputName)
    );
  }
  writeFileList(path.join(liveDir, mergeFileName), fileNames);
  await concatMp4({ outputName, dir: liveDir, mergeFileName });
}

function pruneLiveResource(streamKey) {
  fs.readdir(getStreamDir(streamKey), (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(getStreamFile(streamKey, file), (err) => {
        if (err) throw err;
      });
    }
  });
}

module.exports = {
  transferRecording,
  mergeRecords,
  pruneLiveResource,
  getFileNames,
  concatMp4,
  writeFileList,
};
