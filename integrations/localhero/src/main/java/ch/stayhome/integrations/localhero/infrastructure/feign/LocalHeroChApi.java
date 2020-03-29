package ch.stayhome.integrations.localhero.infrastructure.feign;

import ch.stayhome.integrations.localhero.model.LocalHeroCategory;
import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import ch.stayhome.integrations.localhero.model.PagedWordPressResult;
import feign.Param;
import feign.RequestLine;


public interface LocalHeroChApi {

	@RequestLine("GET /wp-json/wp/v2/posts?rest_route={restRoute}&page={page}&per_page={size}")
	PagedWordPressResult<LocalHeroPost> findAll(@Param("page") Integer page, @Param("size") Integer size);

	// TODO if this was a bean we could easily cache it using spring's cache
	@RequestLine("GET /wp-json/wp/v2/categories/{id}")
	LocalHeroCategory getCategory(@Param("id") String id);

}
