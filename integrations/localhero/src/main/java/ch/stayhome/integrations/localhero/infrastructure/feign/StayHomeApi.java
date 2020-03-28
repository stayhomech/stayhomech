package ch.stayhome.integrations.localhero.infrastructure.feign;

import ch.stayhome.integrations.localhero.model.StayHomeEntry;
import feign.Headers;
import feign.RequestLine;

public interface StayHomeApi {
    @RequestLine("POST /api/business-entry/")
    @Headers({
            "Content-Type: application/json",
            "X-SYNC-PROVIDER-NAME: local-hero.ch",       // FIXME: this needs not to be hard coded
            "X-SYNC-PROVIDER-ENTRY-ID: 666"              // FIXME: What should go here?
    })
    void createEntry(StayHomeEntry entry);
}
