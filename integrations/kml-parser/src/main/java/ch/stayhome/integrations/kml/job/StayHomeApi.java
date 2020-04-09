package ch.stayhome.integrations.kml.job;

import java.util.Map;

import feign.HeaderMap;
import feign.Headers;
import feign.RequestLine;

public interface StayHomeApi {

	String PROVIDER_NAME = "X-SYNC-PROVIDER-NAME";

	String ENTRY_ID = "X-SYNC-PROVIDER-ENTRY-ID";

	@RequestLine("POST /api/business-entry/")
	@Headers({"Content-Type: application/json"})
	void createEntry(@HeaderMap Map<String, String> headers, StayHomeEntry entry);

}
