import fetch from "node-fetch";
import { SyncRequest } from "./sync-request";
import { Globals } from "./globals";

export abstract class CrawlerBase {
    abstract loadData(): Promise<void>;

    async postToSyncService(request: SyncRequest) : Promise<void> {
        this.log('Adding', request.name, request.id);

        let response = await fetch(Globals.SyncServiceBaseUrl + 'business-entry/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(request)
        });
        if (response.status < 200 && response.status >= 300) {
            throw new Error(response.statusText || response.status.toString());
        }
    }

    log(...message: any) {
        console.log(`[${this.constructor.name}]`, ...message);
    }
}