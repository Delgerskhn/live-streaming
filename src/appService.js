const { default: fetch } = require("node-fetch");

async function requestEndStreaming(stream_key, id) {
  let resp = await fetch(
    `${process.env.APP_HOST}/api/lessons/validateStream?key=` + stream_key,
    {
      method: "DELETE",
    }
  );
  let result = await resp.json();
  console.log("Request to end stream result:", result);
  return result;
}
async function validateStreamAndNotifyGoingLive(stream_key, id) {
  try {
    let resp = await fetch(
      `${process.env.APP_HOST}/api/lessons/validateStream?key=` + stream_key
    );
    let result = await resp.json();
    console.info("key validation result:", result);
    if (result == false) {
      throw "Unauthorized";
    }
  } catch (e) {
    console.error(e);
    let session = nms.getSession(id);
    session.reject();
  }
}

async function saveLiveResource({ courseStreamKey, videoFileName }) {
  let resp = await fetch(
    `${process.env.APP_HOST}/api/lessons/saveLiveVideo?streamKey=${courseStreamKey}&videoFileName=${videoFileName}`
  );
  let result = await resp.json();
  console.log("SAVING CONVERTED HLS VIDEO TO APP", result);
  return result;
}

module.exports = {
  requestEndStreaming,
  validateStreamAndNotifyGoingLive,
  saveLiveResource,
};
