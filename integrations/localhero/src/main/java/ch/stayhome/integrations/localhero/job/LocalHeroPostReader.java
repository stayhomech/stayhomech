package ch.stayhome.integrations.localhero.job;

import ch.stayhome.integrations.localhero.infrastructure.feign.LocalHeroCh;
import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import feign.Feign;
import feign.gson.GsonDecoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.item.ItemReader;

import java.util.ArrayDeque;
import java.util.Deque;

@Slf4j
public class LocalHeroPostReader implements ItemReader<LocalHeroPost> {
    private final String target;

    private Deque<LocalHeroPost> postDeque = new ArrayDeque<>();

    LocalHeroPostReader(String target) {
        this.target = target;

        readPosts();
    }

    @Override
    public LocalHeroPost read() {
        return postDeque.pop();
    }

    private void readPosts() {
        LocalHeroCh localHeroCh = Feign.builder()
                .decoder(new GsonDecoder())
                .target(LocalHeroCh.class, target);

        localHeroCh.findAll().forEach(post -> postDeque.push(post));
    }
}
