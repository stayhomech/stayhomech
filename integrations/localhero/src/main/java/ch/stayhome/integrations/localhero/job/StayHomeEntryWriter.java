package ch.stayhome.integrations.localhero.job;

import ch.stayhome.integrations.localhero.model.StayHomeEntry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.ItemWriter;

import java.util.List;

@Slf4j
public class StayHomeEntryWriter implements ItemWriter<StayHomeEntry> {
    @Override
    public void write(List<? extends StayHomeEntry> items) {
        log.warn("ItemWriter not implemented yet");
    }
}
