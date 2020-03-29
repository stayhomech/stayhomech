package ch.stayhome.integrations.localhero.job;

import java.util.stream.Collectors;

import ch.stayhome.integrations.localhero.config.LocalHeroProperties;
import ch.stayhome.integrations.localhero.model.LocalHeroCategory;
import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import ch.stayhome.integrations.localhero.model.StayHomeEntry;
import lombok.extern.slf4j.Slf4j;

import org.springframework.batch.item.ItemProcessor;

@Slf4j
public class LocalHeroPostProcessor implements ItemProcessor<LocalHeroPost, StayHomeEntry> {

	private final LocalHeroProperties config;

	LocalHeroPostProcessor(final LocalHeroProperties config) {
		this.config = config;
	}

	@Override
	public StayHomeEntry process(LocalHeroPost item) {
		return StayHomeEntry.builder()
				.id(String.valueOf(item.getId()))
				.name(item.getTitle().getRendered())
				.description(item.getExcerpt().getRendered())
				.website(item.getGuid().getRendered())
				.providerName(config.getProviderName())
				.location("Bern")                   // FIXME: don't hard code, there are multiple locations
				.categories(determineCategories(item))
				.delivery("Bern")                   // FIXME: What's the exact requirement for this
				.contact("")
				.email("")
				.phone("")
				.ttl(config.getTtlSeconds())

				.build();
	}

	private String determineCategories(LocalHeroPost item) {
		return item.getCategories().stream()
				.map(category -> item.getApi().getCategory(category))
				.map(LocalHeroCategory::getName)
				.collect(Collectors.joining(", "));
	}
}
