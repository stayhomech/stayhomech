package ch.stayhome.integrations.localhero.job;

import ch.stayhome.integrations.localhero.config.LocalHeroProperties.SourceConfig;
import ch.stayhome.integrations.localhero.infrastructure.feign.LocalHeroChApi;
import ch.stayhome.integrations.localhero.model.LocalHeroCategory;
import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import ch.stayhome.integrations.localhero.model.StayHomeEntry;
import ch.stayhome.integrations.utils.ContactInformationGuesser;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.springframework.batch.item.ItemProcessor;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
public class LocalHeroPostProcessor implements ItemProcessor<LocalHeroPost, StayHomeEntry> {
    private static final int MIN_LENGTH_WEBSITE = 11;        // http://a.ch


    private final SourceConfig sourceConfig;
    private final LocalHeroChApi localHeroChApi;
    private final Long defaultTTL;
    private final Map<String, LocalHeroCategory> categoryCache = new HashMap<>();
    private final ContactInformationGuesser guesser = new ContactInformationGuesser();

    LocalHeroPostProcessor(SourceConfig sourceConfig, LocalHeroChApi localHeroChApi, Duration defaultTTL) {
        this.sourceConfig = sourceConfig;
        this.localHeroChApi = localHeroChApi;
        this.defaultTTL = defaultTTL.getSeconds();
    }

    @Override
    public StayHomeEntry process(LocalHeroPost item) {
        // preparation for better readability
        final String id = String.valueOf(item.getId());
        final String name = Jsoup.parse(item.getTitle().getRendered()).text();
        final String text = Jsoup.parse(item.getExcerpt().getRendered()).text();
        final String website = getWebSite(item);
        final String providerName = this.sourceConfig.getProviderName();
        final String location = this.sourceConfig.getPlace();
        final String categories = determineCategories(item);
        final String delivery = this.sourceConfig.getPlace();
        final String contact = "";
        final String email = guesser.extractEmail(item.getContent().getRendered());
        final String phone = guesser.extractPhoneNumber(item.getContent().getRendered());

        // build
        return StayHomeEntry.builder()
                .id(id)
                .name(name)
                .description(text)
                .website(website)
                .providerName(providerName)
                .location(location)
                .categories(categories)
                .delivery(delivery)
                .contact(contact)
                .email(email)
                .phone(phone)
                .ttl(defaultTTL)
                .build();
    }

    private String getWebSite(LocalHeroPost item) {
        String guessed = guesser.extractWebsite(item.getContent().getRendered());

        return guessed.length() > MIN_LENGTH_WEBSITE ? guessed : item.getGuid().getRendered();
    }

    private String determineCategories(LocalHeroPost item) {
        return item.getCategories().stream()
                .map(this::resolveCategory)
                .map(LocalHeroCategory::getName)
                .collect(Collectors.joining(", "));
    }

    private LocalHeroCategory resolveCategory(String key) {
        return this.categoryCache.computeIfAbsent(key, localHeroChApi::getCategory);
    }

}
