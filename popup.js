import {domainSettingMatch, getDomainSettings, updateDomainSettings} from "./views/domainSettings.js";
import {addDomainSpecificUrls, parseUrlPairs, runEnumerator, validateUrls, getSettings} from "./views/run.js";
import {getCurrentURL} from "./utils/dom.js";
import {cleanUrl} from "./utils/url.js";
import {addMessage, clearMessages, prettyPrintObj} from "./utils/helper.js";
import {domainSettingsDefault} from "./utils/constants.js";
import {getRunSettings, updateRunSettings} from "./views/runSettings.js";


$("#runFromSubmit").click(async (e) => {
    e.preventDefault();
    clearMessages();

    const settings = await getSettings();
    const urlListLines = $("#urlList").val().split('\n');
    let urlPairs = parseUrlPairs(urlListLines, settings.defaultScrollLength);

    if (settings.domainSpecificCheck) {
        urlPairs = await addDomainSpecificUrls(urlPairs, settings)
    }

    if (validateUrls(urlPairs)) {
        await runEnumerator(urlPairs, settings);
    }
});


$("#enumerateNowButton").click(async (e) => {
    e.preventDefault();
    clearMessages();

    let url = cleanUrl(await getCurrentURL());
    const settings = await getSettings();
    const urlPairs = await addDomainSpecificUrls([{url: url, scrollLength: settings.defaultScrollLength}], settings);

    if (validateUrls(urlPairs)) {
        await runEnumerator(urlPairs, settings);
    }
});


$("#updateDomainSettings").click(async (e) => {
    e.preventDefault();
    clearMessages();

    const domainSettings = $("#domainSettings").val();
    await updateDomainSettings(domainSettings)
});


$("#cancelRun").click(() => {
    window.close();
});


$("#resetDomainSettings").click(async (e) => {
    e.preventDefault();
    clearMessages();

    $("#domainSettings").val(prettyPrintObj(domainSettingsDefault));
    addMessage("Default settings restored. Click 'Save' to confirm.", 'success')
});


$("#showDomainSettings").click(async (e) => {
    e.preventDefault();
    clearMessages();

    $("#runPage").hide();
    $("#runFormPage").hide();
    $("#runSettingsPage").hide();
    $("#domainSettingsPage").show();

    const domainSettings = await getDomainSettings();
    $("#domainSettings").val(prettyPrintObj(domainSettings));
});


$("#showRunSettings").click(async (e) => {
    e.preventDefault();
    clearMessages();

    $("#runPage").hide();
    $("#runFormPage").hide();
    $("#domainSettingsPage").hide();
    $("#runSettingsPage").show();

    const runSettings = await getRunSettings();

    for (const field_id in runSettings) {
        $(`#${field_id}`).val(runSettings[field_id]);
    }
});


$("#updateRunSettings").click(async (e) => {
    e.preventDefault();
    clearMessages();

    await updateRunSettings()
});


$("[name='backToRunForm']").click((e) => {
    e.preventDefault();
    clearMessages();

    $("#runPage").hide();
    $("#domainSettingsPage").hide();
    $("#runSettingsPage").hide();
    $("#runFormPage").show();
});


$(document).ready(async () => {

    // chrome.storage.sync.clear()
    $("body").tooltip({ selector: '[data-toggle=tooltip]' }); // This gets tooltips to work.

    $("#runPage").hide();
    $("#domainSettingsPage").hide();
    $("#runSettingsPage").hide();

    const url = await getCurrentURL();
    const matchedDomain = await domainSettingMatch(url);

    if (matchedDomain) {
        $("#enumerateNowButton").text(`Enumerate ${matchedDomain.name}`)
    } else {
        $("#enumerateNow").hide()
    }
});


