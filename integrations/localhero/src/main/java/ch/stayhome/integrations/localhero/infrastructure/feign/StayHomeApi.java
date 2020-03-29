package ch.stayhome.integrations.localhero.infrastructure.feign;

import java.util.Map;

import ch.stayhome.integrations.localhero.model.StayHomeEntry;
import feign.HeaderMap;
import feign.Headers;
import feign.RequestLine;

public interface StayHomeApi {

	String PROVIDER_NAME = "X-SYNC-PROVIDER-NAME";

    String ENTRY_ID = "X-SYNC-PROVIDER-ENTRY-ID";

    @RequestLine("POST /api/business-entry/")
	@Headers({
			"Content-Type: application/json",
			"X-SYNC-PROVIDER-NAME: local-hero.ch",       // FIXME: this needs not to be hard coded
	})
	void createEntry(@HeaderMap Map<String, String> headers, StayHomeEntry entry);
}
