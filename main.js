import { crawlPage } from './crawl.js';
import { printReport } from './report.js';

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

    const pages = await crawlPage(new URL(page));

    printReport(pages);

}

main();
