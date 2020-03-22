import { DerBund } from "./der-bund";
import { CrawlerBase } from "./crawler-base";

console.log('Starting node crawler (nodefetch)...');

async function main() {
    var derbund = new DerBund();
    var crawlers = [ derbund ] as CrawlerBase[];

    while (true) {
        crawlers.forEach(async crawler => {
            try {
                crawler.log('Crawling...');
                await crawler.loadData();
                crawler.log('Crawling done');
            } catch (error) {
                crawler.log('Crawling error:', error);
            }
        });

        var delay = new Promise(resolve => setTimeout(() => resolve(), 1 * 60 * 1000)); // wait 1 minute
        await delay;
    }
}

main();