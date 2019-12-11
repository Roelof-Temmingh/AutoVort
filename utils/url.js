export const cleanUrl = (url) => {
    if (url.includes('?')) {
        let splitUrl = url.split('?');
        url = splitUrl[0]
    }

    if (url.endsWith("/")) {
        url = url.slice(0, -1);
    }

    return url
};

export const isValidURL = (url) => {
    const regExp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#:.?+=&%@!\-\/]))?/;
    return regExp.test(url);
};

