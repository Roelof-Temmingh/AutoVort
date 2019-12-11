export const setStorage = (key, value) => {
    return new Promise((resolve) => {
            chrome.storage.sync.set({[key]: value}, resolve);
        }
    )
};

export const getStorage = (key) => {
    return new Promise((resolve, reject) => {
            chrome.storage.sync.get([key], (result) => {
                if (key in result){
                    resolve(result[key]);
                }
                else {
                    reject()
                }
            });
        }
    )
};
