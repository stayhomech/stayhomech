package ch.stayhome.integrations.localhero.job;

import ch.stayhome.integrations.localhero.infrastructure.feign.LocalHeroCh;
import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import feign.Feign;
import feign.RetryableException;
import feign.Retryer;
import feign.gson.GsonDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.ItemReader;

import java.util.ArrayDeque;
import java.util.Deque;

@Slf4j
public class LocalHeroPostReader implements ItemReader<LocalHeroPost> {
    private final LocalHeroCh source;

    private Deque<LocalHeroPost> postDeque = new ArrayDeque<>();

    LocalHeroPostReader(String target) {
        source = Feign.builder()
                .decoder(new GsonDecoder())
                .retryer(new Retryer.Default())
                .target(LocalHeroCh.class, target);
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

        return postDeque.pop();
    }

    private void fetchPosts() {
        postDeque =  new ArrayDeque<>();
        source.findAll().forEach(post -> postDeque.push(post));
    }
}
