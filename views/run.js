import {domainSettingMatch} from "./domainSettings.js";
import {isValidURL} from "../utils/url.js";
import {
    getPageSize,
    getScrollHeight,
    getScrollPosition,
    runScroll,
    scrollToTop,
    updateActiveTab
} from "../utils/dom.js";
import {addMessage, getRandomNumber, sleep} from "../utils/helper.js";
import {getRunSettings} from "./runSettings.js";


const setStatus = (text) => {
    $("#currentStatus").text(text);
};


const clearScrollText = () => {
    $('#scrollTarget').text("");
    $('#pxPerPage').text("");
    setStatus("");
};

export const getSettings = async () => {
    let settings = await getRunSettings();
    settings['domainSpecificCheck'] = $("#domainSpecificCheck").is(':checked');
    return settings
};

export const validateUrls = (urlPairs) => {
    for (const urlPair of urlPairs) {
        if (!isValidURL(urlPair.url)) {
            addMessage(`'${urlPair.url}' is not a valid URL.`, 'danger');
            return false
        }
    }
    return true
};

export const parseUrlPairs = (allUrls, defaultScrollLength) => {
    let urlPairs = [];

    for (const line of allUrls) {
        if (line !== "") {
            let urlPair;

            const splitLine = line.split(',');

            if (splitLine.length === 1) {
                urlPair = {
                    url: splitLine[0],
                    scrollLength: defaultScrollLength
                };
            } else if (splitLine.length === 2) {
                let scrollLength = parseFloat(splitLine[1]);

                if (Number.isNaN(scrollLength)) {
                    scrollLength = defaultScrollLength
                }

                urlPair = {
                    url: splitLine[0],
                    scrollLength: scrollLength
                };
            } else {
                continue
            }
            urlPairs.push(urlPair);
        }
    }
    return urlPairs
};


export const addDomainSpecificUrls = async (urlPairs, settings) => {
    let extendedUrlPairs = [];

    for (const up of urlPairs) {
        const urlBase = up.url;
        extendedUrlPairs.push(up);
        const matchedDomain = await domainSettingMatch(urlBase);

        if (matchedDomain) {
            for (const matchPath of matchedDomain.paths) {

                let urlPair;
                const url = urlBase + matchPath.path;

                if ('scrollLength' in matchPath) {
                    urlPair = {
                        url: url,
                        scrollLength: matchPath.scrollLength
                    }
                } else {
                    urlPair = {
                        url: url,
                        scrollLength: settings.defaultScrollLength
                    }
                }
                extendedUrlPairs.push(urlPair)
            }
        }
    }
    return extendedUrlPairs
};


const updateProgressBar = (id, valueNow, valueMax) => {
    const progressBar = $(`#${id}`);
    valueNow = valueNow.toFixed();
    valueMax = valueMax.toFixed();

    const percent = ((valueNow / valueMax) * 100).toFixed();

    progressBar.attr('aria-valuemax', valueMax);
    progressBar.attr('aria-valuenow', valueNow);
    progressBar.css('width', percent + '%');
    progressBar.text(`${valueNow} / ${valueMax}`);
};


const clearProgressBar = (id) => {
    const progressBar = $(`#${id}`);

    progressBar.attr('aria-valuemax', 0);
    progressBar.attr('aria-valuenow', 0);
    progressBar.css('width', 0);
    progressBar.text('');
};

export const runScroller = async (scrollLength, settings) => {
    const pageSize = await getPageSize();
    const scrollTarget = pageSize * scrollLength;
    let scrollPosition = await getScrollPosition();

    $('#scrollTarget').text(`${scrollLength} pages`);
    $('#pxPerPage').text(`${pageSize} px`);

    while (scrollPosition <= scrollTarget) {

        const scrollAmount = getRandomNumber(0, 2 * pageSize);
        await runScroll(scrollAmount);
        const scrollHeight = await getScrollHeight();
        scrollPosition = await getScrollPosition();

        updateProgressBar('scrollProgressBar', scrollPosition, scrollTarget);

        if ((pageSize + scrollPosition + 1) >= scrollHeight) {
            setStatus('Hit the bottom of the page.');
            await sleep(2);
            break
        }

        let scrollWaitRandom = getRandomNumber(settings.scrollWaitMin, settings.scrollWaitMax);
        setStatus(`Waiting ${scrollWaitRandom.toFixed(1)} seconds before next scroll.`);
        await sleep(scrollWaitRandom);
    }
    clearProgressBar('scrollProgressBar')
};


export const runEnumerator = async (urlPairs, settings) => {
    $("#runFormPage").hide();
    $("#runPage").show();

    for (const i in urlPairs) {
        clearScrollText();

        const pair = urlPairs[i];
        await updateActiveTab(pair.url);
        $("#currentUrl").text(pair.url);

        updateProgressBar('urlProgressBar', parseInt(i) + 1, urlPairs.length);
        const urlWaitRandom = getRandomNumber(settings.urlWaitMin, settings.urlWaitMax);

        if (parseInt(pair.scrollLength, 10) <= 0) {
            setStatus(`Not scrolling. Waiting ${urlWaitRandom.toFixed(1)} seconds before next load.`);
            await sleep(urlWaitRandom);
        } else {
            setStatus(`Waiting ${urlWaitRandom.toFixed(1)} seconds before scrolling starts.`);
            await sleep(urlWaitRandom);

            await runScroller(pair.scrollLength, settings);

            setStatus(`Waiting ${urlWaitRandom.toFixed(1)} seconds before scrolling to top.`);
            await sleep(urlWaitRandom);
            await scrollToTop();

            setStatus(`Waiting ${urlWaitRandom.toFixed(1)} seconds before next load.`);
            await sleep(urlWaitRandom);
        }

    }
    setStatus('Complete');
};

