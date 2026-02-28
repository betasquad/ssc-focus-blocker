// messaging.js

// Centralized message handling for the chrome extension

// Function to handle messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Process the message here
    console.log('Message received:', request);

    // Send a response back
    sendResponse({ status: 'success' });
});

// Example of sending a message
function sendMessageToContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
            console.log('Response from content script:', response);
        });
    });
}