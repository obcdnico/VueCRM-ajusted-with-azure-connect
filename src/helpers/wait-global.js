var waitForGlobal = function(key, callback, timeout = 100) {
  if (window[key]) {
    callback();
  } else {
    setTimeout(function() {
      waitForGlobal(key, callback);
    }, timeout);
  }
};
// Use as this for wait a variable on window scope
// waitForGlobal("jQuery", function() {
//   console.log("found it");
// });
export default waitForGlobal;
