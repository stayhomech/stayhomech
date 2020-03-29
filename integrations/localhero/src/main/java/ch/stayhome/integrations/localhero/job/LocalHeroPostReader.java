package ch.stayhome.integrations.localhero.job;

import ch.stayhome.integrations.localhero.config.LocalHeroProperties;
import ch.stayhome.integrations.localhero.infrastructure.feign.LocalHeroChApi;
import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import feign.Feign;
import feign.Retryer;
import feign.gson.GsonDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.support.AbstractItemCountingItemStreamItemReader;
import org.springframework.util.ClassUtils;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@Slf4j
public class LocalHeroPostReader extends AbstractItemCountingItemStreamItemReader<LocalHeroPost> {
    private final LocalHeroProperties config;
    //    private final List<LocalHeroChApi> apis = new ArrayList<>();
    private final Map<String, LocalHeroChApi> apis = new HashMap<>();

    private Deque<LocalHeroPost> postDeque = new ArrayDeque<>();

    LocalHeroPostReader(LocalHeroProperties config) {
        this.config = config;
        this.config.getSourceUrls().forEach(target -> apis.put(
                target,
                Feign.builder()
                        .decoder(new GsonDecoder())
                        .retryer(new Retryer.Default())
                        .target(LocalHeroChApi.class, target)
                )
        );
        this.setExecutionContextName(ClassUtils.getShortName(LocalHeroPostReader.class));
    }

    @Override
    protected LocalHeroPost doRead() {
        try {
            return postDeque.pop();
        } catch (NoSuchElementException e) {
            // no posts
            return null;
        }
    }

    @Override
    protected void doOpen() {
        if (postDeque.isEmpty()) {
            fetchPosts();
        }
    }

    @Override
    protected void doClose() {
        this.postDeque.clear();
    }

    private void fetchPosts() {
        postDeque = new ArrayDeque<>();
        apis.forEach((String key, LocalHeroChApi source) -> {
                    source.findAll(config.getRestRoute()).forEach(post -> postDeque.push(post));
                    log.info("Fetched {} posts from {}", postDeque.size(), key);
                }
        );
    }

}
