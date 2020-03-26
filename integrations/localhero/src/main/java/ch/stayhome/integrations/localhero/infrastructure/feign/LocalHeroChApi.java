package ch.stayhome.integrations.localhero.infrastructure.feign;

import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import feign.Param;
import feign.RequestLine;

import java.util.List;

public interface LocalHeroChApi {
    @RequestLine("GET /index.php?rest_route={restRoute}")
    List<LocalHeroPost> findAll(@Param("restRoute") String restRoute);
}
