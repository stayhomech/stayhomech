package ch.stayhome.integrations.localhero.infrastructure.feign;

import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import ch.stayhome.integrations.localhero.model.PagedWordPressResult;
import feign.Param;
import feign.RequestLine;

public interface LocalHeroChApi {

	// @RequestLine("GET /index.php?rest_route={restRoute}&_page={page}&_limit={size}")
	@RequestLine("GET /?rest_route={restRoute}&page={page}&per_page={size}")
	PagedWordPressResult<LocalHeroPost> findAll(@Param("page") Integer page, @Param("size") Integer size);

}
