package ch.stayhome.integrations.localhero.job;

import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import ch.stayhome.integrations.localhero.model.StayHomeEntry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.ItemProcessor;

@Slf4j
public class LocalHeroPostProcessor implements ItemProcessor<LocalHeroPost, StayHomeEntry> {
    private String providerName;

    LocalHeroPostProcessor(final String providerName) {
        this.providerName = providerName;
    }

    @Override
    public StayHomeEntry process(LocalHeroPost item) {
        return StayHomeEntry.builder()
                .id(providerName + "-" + item.getId())
                .name(item.getTitle().getRendered())
                .description(item.getExcerpt().getRendered())
                .website(item.getGuid().getRendered())
                .providerName(providerName)
                .build();
    }
}
