// Utility functions for storage, validation, and messaging

// Storage utility
const storageUtil = {
    saveToLocalStorage: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    getFromLocalStorage: (key) => {
        return JSON.parse(localStorage.getItem(key));
    },
};

// Validation utility
const validationUtil = {
    isValidEmail: (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    },
    isNotEmpty: (value) => {
        return value && value.trim() !== '';
    },
};

// Messaging utility
const messagingUtil = {
    showAlert: (message) => {
        alert(message);
    },
    logMessage: (message) => {
        console.log(message);
    },
};

export { storageUtil, validationUtil, messagingUtil };