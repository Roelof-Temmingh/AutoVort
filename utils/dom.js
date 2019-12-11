

export const getCurrentURL = () => {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
            function (tabs) {
                if (tabs.length === 1) {
                    resolve(tabs[0].url)
                } else {
                    reject()
                }
            }
        );
    })
};

export const updateActiveTab = (url) => {
    return new Promise(resolve => {
        chrome.tabs.update({url: url}, resolve)
    })
};


export const runScroll = async (scrollAmount) => {
    const code = `window.scrollBy({top: ${scrollAmount}, left: 0, behavior: 'smooth'});`;
    return await getResponseFromDom(code);
};


export const scrollToTop = async () => {
    return await getResponseFromDom("window.scrollTo({top: 0,left: 0,behavior: 'smooth'});");
};

export const getPageSize = async () => {
    return await getResponseFromDom("window.innerHeight");
};


export const getScrollPosition = async () => {
    return await getResponseFromDom("window.scrollY");
};


export const getScrollHeight = async () => {
    return await getResponseFromDom("Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );");  // https://stackoverflow.com/questions/1145850/how-to-get-height-of-entire-document-with-javascript
};


export const getResponseFromDom = (code) => {
    return new Promise((resolve, reject) => {
        chrome.tabs.executeScript(
            {code: code},
            (data) => {
                if (data.length === 1) {
                    resolve(data[0])
                } else {
                    reject()
                }
            }
        );
    })
};