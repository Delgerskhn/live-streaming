const NodeMediaServer = require("node-media-server"),
  config = require("../node-media-server.config").rtmp_server;

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
