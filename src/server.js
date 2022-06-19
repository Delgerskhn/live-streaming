const NodeMediaServer = require("node-media-server"),
  config = require("../node-media-server.config").rtmp_server;
const {
  validateStreamAndNotifyGoingLive,
  requestEndStreaming,
  saveLiveResource,
} = require("./appService");
const {
  transferRecording,
  mergeRecords,
  pruneLiveResource,
} = require("./storageService");
const nms = new NodeMediaServer(config);

nms.on("prePublish", async (id, StreamPath, args) => {
  let stream_key = getStreamKeyFromStreamPath(StreamPath);
  console.log(
    "[NodeEvent on prePublish]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
  validateStreamAndNotifyGoingLive(stream_key, id);
});

nms.on("donePublish", async (id, StreamPath, args) => {
  let stream_key = getStreamKeyFromStreamPath(StreamPath);
  console.log(
    "[NodeEvent on donePublish]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
  const { token } = await requestEndStreaming(stream_key, id);
  console.log(stream_key, id);
  await mergeRecords({
    streamKey: stream_key,
    outputName: "mergedVideo.mp4",
    mergeFileName: "fileList.txt",
  });
  const { fname } = await transferRecording({
    courseStreamKey: stream_key,
    token,
    recordedFileName: "mergedVideo.mp4",
  });
  saveLiveResource({ courseStreamKey: stream_key, videoFileName: fname });
  pruneLiveResource(stream_key);
});

const getStreamKeyFromStreamPath = (path) => {
  let parts = path.split("/");
  return parts[parts.length - 1];
};

module.exports = nms;
