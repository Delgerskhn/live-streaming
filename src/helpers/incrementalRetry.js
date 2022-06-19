const {
  INCREMENTAL_RETRY_REQUEST_INITIAL_DELAY_SECONDS,
} = require("../appConfig");

async function incrementalRetry({
  requestFn,
  timeIncrementUnit,
  onSuccess,
  onError,
}) {
  console.log(timeIncrementUnit);
  let resp = await requestFn();
  if (resp.status && resp.status != 200) {
    return setTimeout(async () => {
      console.log(`inside settimeout of ${timeIncrementUnit}`);
      await incrementalRetry({
        requestFn,
        timeIncrementUnit: ++timeIncrementUnit,
      });
    }, INCREMENTAL_RETRY_REQUEST_INITIAL_DELAY_SECONDS * timeIncrementUnit);
  }
  onSuccess && onSuccess(resp);
}

module.exports = {
  incrementalRetry,
};
