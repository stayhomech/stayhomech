package ch.stayhome.integrations.localhero.job;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import ch.stayhome.integrations.localhero.infrastructure.feign.LocalHeroChApi;
import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import ch.stayhome.integrations.localhero.model.PagedWordPressResult;
import lombok.extern.slf4j.Slf4j;

import org.springframework.batch.item.database.AbstractPagingItemReader;
import org.springframework.util.ClassUtils;

@Slf4j
public class LocalHeroPostReader extends AbstractPagingItemReader<LocalHeroPost> {

	private final LocalHeroChApi api;

	private Integer totalPages;

	public LocalHeroPostReader(int pageSize, LocalHeroChApi localHeroChApi) {
		this.api = localHeroChApi;
		setName(ClassUtils.getShortName(LocalHeroPostReader.class));
		setPageSize(pageSize);
	}

	@Override
	protected void doReadPage() {
		if (results == null) {
			results = new CopyOnWriteArrayList<>();
		} else {
			results.clear();
		}
		final int currentPage = super.getPage() + 1;
		if (this.totalPages != null && currentPage > this.totalPages) {
			logger.info("No more pages to fetch");
			return;
		}
		final PagedWordPressResult<LocalHeroPost> results = api.findAll(getPage() + 1, getPageSize());
		this.totalPages = results.getTotalPages();
		final List<LocalHeroPost> content = results.getContent();
		this.results.addAll(content);
	}

	@Override
	protected void doJumpToPage(int itemIndex) {
		// nothing to do
	}

}
