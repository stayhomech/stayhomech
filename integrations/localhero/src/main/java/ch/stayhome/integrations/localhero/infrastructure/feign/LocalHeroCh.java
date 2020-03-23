package ch.stayhome.integrations.localhero.infrastructure.feign;

import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import feign.RequestLine;

import java.util.List;

public interface LocalHeroCh {
    @RequestLine("GET /wp-json/wp/v2/posts")
    List<LocalHeroPost> findAll();
}
