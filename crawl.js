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

function main() {
    const actArgs = process.argv.splice(2);
    if (actArgs.length < 1) {
        console.error("Pass a base url");
        return;
    }
    if (actArgs.length > 1) {
        console.error("Pass only ONE url you moron... Jesus Christ...");
        return;
    }
    console.log(`Starting the crawl: ${actArgs[0]}`);
    
}

main();

export { normalizeUrl, getUrlsFromHtml };
