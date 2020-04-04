import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { CrawlerBase } from './crawler-base';

export class Laedelishop extends CrawlerBase {
    private readonly baseUrl = 'https://laedelishop.ch/';
    private readonly categoryMap = {};
    constructor() {
        super();
    }
    
    async loadData(): Promise<void> {
        var url = this.baseUrl + 'laedelis/';
        this.log('Loading root', url);
        var result = await fetch(url);
        var html = await result.text();
        var $ = cheerio.load(html);
        var cards = $('.vendor-card').toArray();

        await this.loadCategoryMap($('.menu-item-object-product_cat a').attr('href'));

        var counter = 0;
        for (const c of cards) {
            try {
                var card = $(c);
                var link = card.find('a').attr('href');
                var name = card.find('.name').text();
                if (card.hasClass('has-no-products')) {
                    this.log('No products for:', name);
                    continue;
                }

                await this.loadShop(name, link);
                counter++;
            } catch (error) {
                this.log('Item parse error', error);
            }
        }

        this.log(`Posted a total of ${counter} entries`);
        /*
    id: string;
    providerName: string;
    name: string;
    description: string;
    contact?: string; // free text field if none of the other fields (eg. email, website, location) fits
    location?: string;
    email?: string;
    phone?: string;
    delivery?: string;
    website?: string;
    categories?: string;
    ttl?: number; // in seconds*/
    }

    private async loadCategoryMap(url: string) {
        this.log('Loading categories from', url);
        var result = await fetch(url);
        var html = await result.text();
        var $ = cheerio.load(html);

        $('li.cat-item a').each((i, e) => {
            var link = $(e).attr('href');
            // link looks something like this:
            // https://laedelishop.ch/produkt-kategorie/sport-freizeit/musik/instrumente/
            //   0   1       2                 3              4          5       6       7
            var parts = link.split('/');
            for (let i = 4; i < parts.length; i++) {
                const part = parts[i];
                if (part) {
                    this.categoryMap[parts[i]] = parts[4];
                }
                
            }
        });
    }

    private async loadShop(name: string, link: string) {
        var result = await fetch(link);
        var html = await result.text();
        var $ = cheerio.load(html);

        var categories = {};

        $('li.type-product').each((i, e) => {
            var product = $(e);
            for (const clazz of product.attr('class').split(/\s+/)) {
                var match = clazz.match(/^product_cat-(.+)$/);
                if (match) {
                    categories[this.categoryMap[match[1]]] = true;
                }
            }
        });

        var address = $('.wcv-widget-store-address1').text();
        var zip = $('.wcv-widget-store-post-code').text();
        var city = $('.wcv-widget-store-city').text();
        var request = {
            id: link,
            providerName: 'laedelishop',
            name: name,
            description: $('.wcv-store-description').text().trim(),
            contact: '',
            location: `${address}\n${zip} ${city}`,
            categories: Object.keys(categories).join(', '),
            // TODO: remove those fields once they are no longer required:
            website: link,
            phone: $('.wcv-widget-store-phone').text(),
            email: $('.wcv-widget-store-email').text(),
            delivery: 'Lädelishop = ganze Schweiz'
        };
        this.log(request);
        await this.postToSyncService(request);
    }
}