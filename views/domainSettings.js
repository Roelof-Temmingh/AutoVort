import {domainSettingsDefault} from "../utils/constants.js";
import {getStorage, setStorage,} from "../utils/storage.js";
import {addMessage} from "../utils/helper.js";


const domainSettingsKey = 'domainSettings';


export const domainSettingMatch = async (url) => {
    const domainSettings = await getDomainSettings();

    for (const ds of domainSettings) {
        let re = new RegExp(ds.regex);

        if (re.test(url)) {
            return ds
        }
    }
};


export const getDomainSettings = async () => {
    try {
        return await getStorage(domainSettingsKey);
    } catch (e) {
        return domainSettingsDefault
    }
};


const validateDomainSettings = (domainSettings) => {

    for (const ds of domainSettings) {
        if (!('name' in ds) || !('regex' in ds) || !('paths' in ds)) {
            addMessage("Each domain settings should contain a 'name', a 'regex' and 'paths'.", 'danger');
            return false
        }

        try {
            new RegExp(ds.regex);
        } catch (e) {
            addMessage(`Invalid regular expression: ${ds.regex}`, 'danger');
            return false
        }

        if (!Array.isArray(ds.paths)) {
            addMessage(`'paths' attribute should be in a list/array, not a '${typeof ds.paths}'.`, 'danger');
            return false
        }

        for (const p of ds.paths) {
            if (!('path' in p)) {
                addMessage("'path' attribute is missing from 'paths' list.", 'danger');
                return false
            }
            if (typeof p.path !== 'string') {
                addMessage("'path' attributes should be strings.", 'danger');
                return false
            }
            if ('scrollLength' in p) {
                if (!(typeof p.scrollLength === 'number')) {
                    addMessage("'scrollLength' attributes should be a number.", 'danger');
                    return false
                }
            }
        }
    }
    return true
};


export const updateDomainSettings = async (domainSettings) => {
    let domainSettingsObj;

    try {
        domainSettingsObj = JSON.parse(domainSettings);
    } catch (exception) {
        addMessage(exception, 'danger');
        return false
    }

    if (!Array.isArray(domainSettingsObj)) {
        addMessage(`Domain settings should be in a list/array, not a \'${typeof domainSettingsObj}\'.`, 'danger');
        return false
    }

    if (validateDomainSettings(domainSettingsObj)) {
        await setStorage(domainSettingsKey, domainSettingsObj);
        addMessage('Saved domain settings', 'success');
    }
};
