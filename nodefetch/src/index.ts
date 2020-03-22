import { DerBund } from "./der-bund";

console.log('Starting node crawler (nodefetch)...');

async function main() {
    var crawlers = [ new DerBund() ];

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

        var delay = new Promise(resolve => setTimeout(() => resolve(), 10 * 60 * 1000)); // wait 10 minutes
        await delay;
    }
}

main();