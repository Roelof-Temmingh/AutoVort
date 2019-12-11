

export const sleep = (s) => {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
};


export const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
};


export const prettyPrintObj = (obj) => {
    return JSON.stringify(obj, null, 2)
};


export const addMessage = (message, status) => {
    $('#messageBox').append(`
<div class="alert alert-${status} fade show" role="alert">
  ${message}
</div>
`);
};


export const clearMessages = () => {
    $('#messageBox').empty()
};