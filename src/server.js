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
  console.log(
    "[NodeEvent on prePublish]",
    `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
  );
  console.log(process.env.APP_HOST);
  fetch("http://localhost:4000/api/lessons/validateStream?key=" + stream_key)
    .then((res) => res.json())
    .then((res) => {
      console.log("key validation result:", res);
      if (res == false) {
        let session = nms.getSession(id);
        session.reject();
      }
    });
  //TODO: send request to main service and validate user by streamkey
  // User.findOne({stream_key: stream_key}, (err, user) => {
  //     if (!err) {
  //         if (!user) {
  //             let session = nms.getSession(id);
  //             session.reject();
  //         } else {
  //             // do stuff
  //         }
  //     }
  // });
});

const getStreamKeyFromStreamPath = (path) => {
  let parts = path.split("/");
  return parts[parts.length - 1];
};

module.exports = nms;
