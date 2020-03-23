package ch.stayhome.integrations.localhero.config;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = LocalHeroProperties.class)
@ActiveProfiles("test")
public class LocalHeroPropertiesTest {
    @Autowired
    LocalHeroProperties localHeroProperties;

    @Test
    public void shouldSetValueFromYml() {
        assertThat(localHeroProperties.getScrapeCron(), is(equalTo("*/5 * * * * *")));
    }

}
