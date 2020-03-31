package ch.stayhome.integrations.localhero.job;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import ch.stayhome.integrations.localhero.infrastructure.feign.LocalHeroChApi;
import ch.stayhome.integrations.localhero.infrastructure.feign.querymap.PagingQueryMap;
import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import ch.stayhome.integrations.localhero.model.PagedWordPressResult;
import lombok.extern.slf4j.Slf4j;

import org.springframework.batch.item.database.AbstractPagingItemReader;
import org.springframework.util.ClassUtils;

@Slf4j
public class LocalHeroPostReader extends AbstractPagingItemReader<LocalHeroPost> {

	private final LocalHeroChApi api;
	private final PagingQueryMap queryMap;

	private Integer totalPages;

	public LocalHeroPostReader(int pageSize, LocalHeroChApi localHeroChApi, PagingQueryMap queryMap) {
		this.api = localHeroChApi;
		this.queryMap = queryMap;
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

		queryMap.setPage(currentPage);
		queryMap.setPageSize(getPageSize());

		final PagedWordPressResult<LocalHeroPost> results = api.findAll(queryMap);
		this.totalPages = results.getTotalPages();
		final List<LocalHeroPost> content = results.getContent();
		this.results.addAll(content);
	}

	@Override
	protected void doJumpToPage(int itemIndex) {
		// nothing to do
	}

}
