import { JSDOM } from 'jsdom';

function normalizeUrl(url) {
    const parsed = new URL(url);
    if (parsed.pathname === '/') {
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
            url = new URL(baseUrl + a.getAttribute('href'));
        }
        return url.protocol + "//" + url.hostname + url.pathname

    });

    return hrefs;

}

async function crawlPage(currentUrl) {
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

    console.log(bodyText);
}

async function main() {
    const actArgs = process.argv.splice(2);
    if (actArgs.length < 1) {
        console.error("Pass a base url");
        return;
    }
    if (actArgs.length > 1) {
        console.error("Pass only ONE url you moron... Jesus Christ...");
        return;
    }
    const page = actArgs[0];
    console.log(`Starting the crawl: ${page}`);

    await crawlPage(page);
}

main();

export { normalizeUrl, getUrlsFromHtml };
