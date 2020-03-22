import fetch from "node-fetch";
import { ApiRequest } from "./api-request";
import { Globals } from "./globals";

export abstract class CrawlerBase {
    abstract loadData(): Promise<void>;

    async postToApi(request: ApiRequest) : Promise<void> {
        await fetch(Globals.ApiBaseUrl + 'requests/', {
            method: 'POST',
            headers: {
                'Authorization': 'Token ' + Globals.ApiKey,
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(request)
        });
    }

    log(...message: any) {
        console.log(`[${this.constructor.name}]`, ...message);
    }
}