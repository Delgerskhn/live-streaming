const NodeMediaServer = require("node-media-server"),
  config = require("../node-media-server.config").rtmp_server;
const fetch = require("node-fetch");
const nms = new NodeMediaServer(config);

nms.on("prePublish", async (id, StreamPath, args) => {
  let stream_key = getStreamKeyFromStreamPath(StreamPath);
  console.log(
    "[NodeEvent on prePublish]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
  try {
    let resp = await fetch(
      `${process.env.APP_HOST}/api/lessons/validateStream?key=` + stream_key
    );
    let result = await resp.json();
    console.log("key validation result:", result);
    if (result == false) {
      throw "Unauthorized";
    }
  } catch (e) {
    console.error(e);
    let session = nms.getSession(id);
    session.reject();
  }
});

const getStreamKeyFromStreamPath = (path) => {
  let parts = path.split("/");
  return parts[parts.length - 1];
};

module.exports = nms;
