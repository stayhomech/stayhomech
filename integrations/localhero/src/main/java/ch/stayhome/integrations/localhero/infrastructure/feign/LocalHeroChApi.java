package ch.stayhome.integrations.localhero.infrastructure.feign;

import ch.stayhome.integrations.localhero.infrastructure.feign.querymap.PagingQueryMap;
import ch.stayhome.integrations.localhero.model.LocalHeroCategory;
import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import ch.stayhome.integrations.localhero.model.PagedWordPressResult;
import feign.Param;
import feign.QueryMap;
import feign.RequestLine;


public interface LocalHeroChApi {

	@RequestLine("GET /wp-json/wp/v2/posts")
	PagedWordPressResult<LocalHeroPost> findAll(@QueryMap PagingQueryMap queryMap);

	@RequestLine("GET /wp-json/wp/v2/categories/{id}")
	LocalHeroCategory getCategory(@Param("id") String id);

}
