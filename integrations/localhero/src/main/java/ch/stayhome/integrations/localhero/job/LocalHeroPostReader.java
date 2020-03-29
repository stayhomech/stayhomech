package ch.stayhome.integrations.localhero.job;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import ch.stayhome.integrations.localhero.config.LocalHeroProperties;
import ch.stayhome.integrations.localhero.infrastructure.feign.LocalHeroChApi;
import ch.stayhome.integrations.localhero.infrastructure.feign.PagedWordPressResultDecoder;
import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import ch.stayhome.integrations.localhero.model.PagedWordPressResult;
import feign.Feign;
import feign.Retryer;
import feign.gson.GsonDecoder;
import feign.gson.GsonEncoder;
import lombok.extern.slf4j.Slf4j;

import org.springframework.batch.item.database.AbstractPagingItemReader;
import org.springframework.util.ClassUtils;

@Slf4j
public class LocalHeroPostReader extends AbstractPagingItemReader<LocalHeroPost> {

	private final LocalHeroProperties config;

	private final List<LocalHeroChApi> apis = new ArrayList<>();

	LocalHeroPostReader(LocalHeroProperties config) {
		this.config = config;
		this.config.getSourceUrls().forEach(target -> apis.add(
				Feign.builder()
						.decoder(new PagedWordPressResultDecoder(new GsonDecoder()))
						.encoder(new GsonEncoder())
						.retryer(new Retryer.Default())
						.target(LocalHeroChApi.class, target)
				)
		);
		setName(ClassUtils.getShortName(LocalHeroPostReader.class));
		setPageSize(config.getPageSize());
	}

	@Override
	protected void doReadPage() {
		if (results == null) {
			results = new CopyOnWriteArrayList<>();
		} else {
			results.clear();
		}
		apis.forEach(source -> {
			final PagedWordPressResult<LocalHeroPost> results = source.findAll(getPage() + 1, getPageSize());
			final int currentPage = super.getPage() + 1;
			if (currentPage <= results.getTotalPages()) {
				this.results.addAll(results.getContent());
			} else {
				logger.info("Last Page reached. Total-Pages: " + results.getTotalPages() + ", Total:items: " + results.getTotalItems());
			}
		});
	}

	@Override
	protected void doJumpToPage(int itemIndex) {
		// nothing to do
	}

}
