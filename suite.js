const urlParams = new URLSearchParams(window.location.search);
const page = urlParams.get('module');
// const action = urlParams.get('action');
const record = urlParams.get('record');
chrome.storage.local.set({reloadcount: 0}, function() {
    console.log('suite relaod is set to 0');
});
if(page === 'crm_Posting') { 
    chrome.storage.local.set({record: record}, function() {
        console.log('Value is set to ' + record);
    });
} else {
    chrome.storage.local.set({record: null}, function() {
        console.log('Value is set to empty');
    });
}




/*const urlParams = new URLSearchParams(window.location.search);
const page = urlParams.get('module');
const action = urlParams.get('action');
const record = urlParams.get('record');

console.log(`Page: ${page}`);
console.log(`Action: ${action}`);
console.log(`Record: ${record}`);
 
if(page === 'crm_Listings' && action === 'DetailView') { 
    chrome.storage.local.set({record: record}, function() {
        console.log('Value is set to ' + record);
    });
} else {
    chrome.storage.local.set({record: null}, function() {
        console.log('Value is set to empty');
    });
}*/
