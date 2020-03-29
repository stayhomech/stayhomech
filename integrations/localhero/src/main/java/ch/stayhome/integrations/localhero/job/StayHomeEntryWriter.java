package ch.stayhome.integrations.localhero.job;

import java.util.List;
import java.util.Map;

import ch.stayhome.integrations.localhero.config.LocalHeroProperties;
import ch.stayhome.integrations.localhero.infrastructure.feign.StayHomeApi;
import ch.stayhome.integrations.localhero.model.StayHomeEntry;
import feign.Feign;
import feign.Logger;
import feign.Retryer;
import feign.gson.GsonEncoder;
import lombok.extern.slf4j.Slf4j;

import org.springframework.batch.item.ItemWriter;

@Slf4j
public class StayHomeEntryWriter implements ItemWriter<StayHomeEntry> {
	private final LocalHeroProperties config;
	private final StayHomeApi api;

	StayHomeEntryWriter(LocalHeroProperties config) {
		this.config = config;
		this.api = Feign.builder()
				.encoder(new GsonEncoder())
				.retryer(new Retryer.Default())
				.logLevel(Logger.Level.FULL)
				.target(StayHomeApi.class, config.getTargetUrl())
		;
	}

	@Override
	public void write(List<? extends StayHomeEntry> items) {
		items.forEach(item -> {
			log.info("POSTing entry to stayhome sync-service: {}", item);
			api.createEntry(prepareHeaders(item), item);
		});
	}

	private Map<String, String> prepareHeaders(StayHomeEntry item) {
		return Map.of(
				StayHomeApi.PROVIDER_NAME, item.getProviderName(),
				StayHomeApi.ENTRY_ID, item.getId()
		);
	}

}
