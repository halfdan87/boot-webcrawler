import { JSDOM } from 'jsdom';

function normalizeUrl(url) {
    const parsed = new URL(url);
    if (!parsed.pathname || parsed.pathname === '/') {
        return parsed.host;
    }
    return parsed.host + parsed.pathname;
}

function getUrlsFromHtml(htmlBody, baseUrl) {
    const domItem = new JSDOM(htmlBody);

    const as = domItem.window.document.querySelectorAll('a');

    const hrefs = Array.from(as).map(a => {
        let url = null;
        try {
            url = new URL(a.getAttribute('href'));
        } catch (e) {
            url = new URL(baseUrl.protocol + "//" + baseUrl.hostname + a.getAttribute('href'));
        }
        return url.toString();
    });

    return hrefs;

}

async function crawlPage(baseUrl, currentUrl = baseUrl, pages = {}) {
    console.log('uuuu', currentUrl);
    if (baseUrl.hostname !== currentUrl.hostname) {
        console.log(`1111 [${baseUrl.hostname}] != [${currentUrl.hostname}]`)
        return pages;
    }

    const normalized = normalizeUrl(currentUrl);
    console.log('normalized', normalized);
    if (pages[normalized]) {
        pages[normalized]++;
        return pages;
    } else {
        pages[normalized] = 1;
    }


    const body = await fetchUrl(currentUrl);

    const urls = getUrlsFromHtml(body, baseUrl);
    console.log(urls);

    for (let url of urls) {

        console.log(`Try : ${url}`);
        const newPages = await crawlPage(baseUrl, new URL(url), pages);
        console.log('new', newPages);
        for (let key in newPages) {
            console.log('aaaa', key);
            pages[key] = newPages[key];
        }
    }

    return pages;
}

async function fetchUrl(currentUrl) {
    const res = await fetch(currentUrl);
    if (!res.ok) {
        console.error(res.body);
        return;
    }

    if (!res.headers.get('Content-Type').startsWith('text/html')) {
        console.error(`Wrong content type: ${res.headers.get('Content-Type')}`);
        return;
    }

    const bodyText = await res.text();
    return bodyText;
}


export { crawlPage, normalizeUrl, getUrlsFromHtml };
