import fetch from "node-fetch";
import * as esprima from "esprima";
import { CrawlerBase } from "./crawler-base";

const crypto = require('crypto');


export abstract class TaMediaBase extends CrawlerBase {
    constructor(private readonly baseUrl: string) {
        super();
    }
    
    async loadData(): Promise<void> {
        var result = await fetch(this.baseUrl);
        var html = await result.text();
        var match = html.match(/assets\/main\.[0-9a-f]+\.js/i);
        if (!match) {
            throw new Error('main.js not found on website');
        }
        
        result = await fetch(this.baseUrl + match[0]);
        var js = await result.text();
        var geometries = undefined;
        esprima.parse(js, {}, node => {
            if (node.type === 'Property'
                && node.key
                && node.key.type === 'Identifier'
                && node.key.name === 'geometries'
                && node.value
                && node.value.type === 'ArrayExpression') {
                    /* the node we are looking for looks like this:
                    geometries: [{
                        type: "Point",
                        features: [[
                    */
                    geometries = node;
            }
        });

        if (!geometries) {
            throw new Error('Geometries not found on website');
        }
        
        var obj = geometries.value.elements[0];
        var elements = obj.properties[1].value.elements;
        for (const element of elements) {
            var [lat, lon] = this.unmingleArray(element.elements[0]);
            var [category, title, description, contact, address] = this.unmingleArray(element.elements[1]);

            const hash = crypto.createHash('md5');
            hash.update(title);

            await this.postToSyncService({
                id: `${lat}_${lon}_${hash.digest('hex')}`,
                providerName: 'DerBund',
                name: title,
                description: description,
                contact: contact,
                location: address,
                categories: category,
                // TODO: remove those fields once they are no longer required:
                website: '',
                phone: '',
                email: '',
                delivery: 'n/a'
            });
        }

        this.log(`Posted a total of ${elements.length} entries`);
    }

    private unmingleArray(astNode: any): any[] {
        return Array.from(astNode.elements, (e: any) => e.value);
    }
}