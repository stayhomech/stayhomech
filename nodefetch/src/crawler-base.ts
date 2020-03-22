import fetch from "node-fetch";
import { SyncRequest } from "./sync-request";
import { Globals } from "./globals";

export abstract class CrawlerBase {
    abstract loadData(): Promise<void>;

    async postToSyncService(request: SyncRequest) : Promise<void> {
        await fetch(Globals.SyncServiceBaseUrl + 'business-entry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(request)
        });
    }

    log(...message: any) {
        console.log(`[${this.constructor.name}]`, ...message);
    }
}