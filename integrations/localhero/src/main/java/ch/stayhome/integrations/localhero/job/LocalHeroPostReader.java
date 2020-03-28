package ch.stayhome.integrations.localhero.job;

import ch.stayhome.integrations.localhero.config.LocalHeroProperties;
import ch.stayhome.integrations.localhero.infrastructure.feign.LocalHeroChApi;
import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import feign.Feign;
import feign.RetryableException;
import feign.Retryer;
import feign.gson.GsonDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.ItemReader;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.NoSuchElementException;

@Slf4j
public class LocalHeroPostReader implements ItemReader<LocalHeroPost> {
    private final LocalHeroProperties config;
    private final List<LocalHeroChApi> apis = new ArrayList<>();

    private Deque<LocalHeroPost> postDeque = new ArrayDeque<>();

    LocalHeroPostReader(LocalHeroProperties config) {
        this.config = config;
        this.config.getSourceUrls().forEach(target -> apis.add(
                Feign.builder()
                        .decoder(new GsonDecoder())
                        .retryer(new Retryer.Default())
                        .target(LocalHeroChApi.class, target)
                )
        );

    }

    @Override
    public LocalHeroPost read() {
        if (postDeque.isEmpty()) {
            try {
                fetchPosts();
            } catch (RetryableException e) {
                log.error(e.getMessage());
                return null;
            }
        }

        try {
            return postDeque.pop();
        } catch (NoSuchElementException e) {
            // no posts
            return null;
        }
    }

    private void fetchPosts() {
        postDeque = new ArrayDeque<>();

        apis.forEach(source -> source.findAll(config.getRestRoute())
                .forEach(post -> postDeque.push(post))
        );
    }
}
