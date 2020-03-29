package ch.stayhome.integrations.localhero.job;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import ch.stayhome.integrations.localhero.config.LocalHeroProperties.SourceConfig;
import ch.stayhome.integrations.localhero.infrastructure.feign.LocalHeroChApi;
import ch.stayhome.integrations.localhero.model.LocalHeroCategory;
import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import ch.stayhome.integrations.localhero.model.StayHomeEntry;
import lombok.extern.slf4j.Slf4j;

import org.springframework.batch.item.ItemProcessor;

@Slf4j
public class LocalHeroPostProcessor implements ItemProcessor<LocalHeroPost, StayHomeEntry> {

	private final SourceConfig sourceConfig;

	private final LocalHeroChApi localHeroChApi;

	private final Long defaultTTL;

	private final Map<String, LocalHeroCategory> categoryCache = new HashMap<>();

	LocalHeroPostProcessor(SourceConfig sourceConfig, LocalHeroChApi localHeroChApi, Duration defaultTTL) {
		this.sourceConfig = sourceConfig;
		this.localHeroChApi = localHeroChApi;
		this.defaultTTL = defaultTTL.getSeconds();
	}

	@Override
	public StayHomeEntry process(LocalHeroPost item) {
		return StayHomeEntry.builder()
				.id(String.valueOf(item.getId()))
				.name(item.getTitle().getRendered())
				.description(item.getExcerpt().getRendered())
				.website(item.getGuid().getRendered())
				.providerName(this.sourceConfig.getProviderName())
				.location(this.sourceConfig.getPlace())
				.categories(determineCategories(item))
				.delivery(this.sourceConfig.getPlace())
				.contact("")
				.email("")
				.phone("")
				.ttl(defaultTTL)
				.build();
	}

	private String determineCategories(LocalHeroPost item) {
		return item.getCategories().stream()
				.map(this::resolveCategory)
				.map(LocalHeroCategory::getName)
				.collect(Collectors.joining(", "));
	}

	private LocalHeroCategory resolveCategory(String key) {
		return this.categoryCache.computeIfAbsent(key, s -> localHeroChApi.getCategory(key));
	}

}
