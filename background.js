// /* Event: Runs when extension is installed */
// chrome.runtime.onInstalled.addListener(function() {

//   // Set which URL the extension can run on
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//     chrome.declarativeContent.onPageChanged.addRules([{
//       conditions: [
//         new chrome.declarativeContent.PageStateMatcher({
//             pageUrl: { hostEquals: 'crm-dev.apartmentsource.com' }
//         }),
//       ],
//       actions: [new chrome.declarativeContent.ShowPageAction()]
//     }]);
//   });

//   // Init default settings into storage
//   chrome.storage.sync.set({ interval: 5000 }, null);

// });

// let timer;
// let timerInterval = 5 * 1000;  //seconds
// let inPosition = false;

// /* Event: Runs when background receives a message */
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {

//     // Get latest settings from storage
//     chrome.storage.sync.get(null, function(data) {
//       timerInterval = parseInt(data.interval);
//     });
    
//     // Execute action
//     if (request.action == "start") {
//       startAutomation();
//     }
//     else if (request.action == "stop") {
//       stopAutomation();
//     }

//     // Send response back to caller (popup.js)
//     // Note: This is required even when we're not sending anything back.
//     sendResponse();
//   }
// );

// // function startAutomation() {
// //   timer = setInterval(onTimerElapsed, timerInterval);
// // }

// function stopAutomation() {
//   clearInterval(timer);
// }

// function startAutomation() {

//   let pageAction = '';
//   if (inPosition == false) {
//     pageAction = 'open-position';
//   }
//   else {
//     pageAction = 'close-position';
//   }

//   chrome.tabs.create({url: 'https://post.craigslist.org'});

//   chrome.tabs.query({active: true}, function(tabs) {
//         // Call executeScript second time to run our contentscript.js file
//         chrome.tabs.executeScript(tabs[0].id, {file: 'contentscript.js'});
//   });

// }