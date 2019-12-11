import {addMessage} from "../utils/helper.js";
import {getStorage, setStorage} from "../utils/storage.js";
import {runSettingsDefault} from "../utils/constants.js";

const runSettingsKey = 'runSettings';


export const getRunSettings = async () => {
    try {
        return await getStorage(runSettingsKey);
    } catch (e) {
        return runSettingsDefault
    }
};


export const updateRunSettings = async () => {

    const runSettings = {
        urlWaitMin: parseFloat($("#urlWaitMin").val()),
        urlWaitMax: parseFloat($("#urlWaitMax").val()),
        scrollWaitMin: parseFloat($("#scrollWaitMin").val()),
        scrollWaitMax: parseFloat($("#scrollWaitMax").val()),
        defaultScrollLength: parseFloat($("#defaultScrollLength").val())
    };

    for (const key in runSettings) {
        if (Number.isNaN(runSettings[key])) {
            addMessage('All values must be valid floats/integers.', 'danger');
            return false
        }
    }

    const errorMessage = 'Minimum wait time must be less than the maximum.';

    if (runSettings.scrollWaitMin >= runSettings.scrollWaitMax) {
        addMessage(errorMessage, 'danger');
        return false
    }

    if (runSettings.urlWaitMin >= runSettings.urlWaitMax) {
        addMessage(errorMessage, 'danger');
        return false
    }

    await setStorage(runSettingsKey, runSettings);
    addMessage('Saved new run settings', 'success');
};

