package ch.stayhome.integrations.localhero.job;

import ch.stayhome.integrations.localhero.config.LocalHeroProperties.SourceConfig;
import ch.stayhome.integrations.localhero.infrastructure.feign.LocalHeroChApi;
import ch.stayhome.integrations.localhero.model.LocalHeroCategory;
import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import ch.stayhome.integrations.localhero.model.RenderedContent;
import ch.stayhome.integrations.localhero.model.StayHomeEntry;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.stringContainsInOrder;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doReturn;

@RunWith(MockitoJUnitRunner.class)
public class LocalHeroPostProcessorTest {
    private LocalHeroPostProcessor processor;

    @Mock
    private SourceConfig sourceConfig;

    @Mock
    private LocalHeroChApi localHeroChApi;

    // final class, cannot be mocked
    private Duration defaultTTL = Duration.ofSeconds(1L);

    @Before
    public void setup() {
        processor = new LocalHeroPostProcessor(sourceConfig, localHeroChApi, defaultTTL);
    }

    @Test
    public void shouldProcessAndSanitizeLocalHeroPost() {
        // given
        LocalHeroPost post = localHeroPost();

        doReturn("test-provider").when(sourceConfig).getProviderName();
        doReturn("test-place").when(sourceConfig).getPlace();

        doAnswer(invocation -> new LocalHeroCategory(invocation.getArgument(0)))
                .when(localHeroChApi).getCategory(any(String.class));

        // when
        StayHomeEntry result = processor.process(post);

        // then
        assertThat(result.getCategories(), is(equalTo("cat 1, cat 2, cat 3")));
        assertThat(result.getDescription(), not(stringContainsInOrder("<p>", "</p>", "&#8211;", "&#8230;")));
        assertThat(result.getWebsite(), is(equalTo("https://www.steuerprofis.ch/")));
        assertThat(result.getEmail(), is(equalTo("foo@example.com")));
        assertThat(result.getPhone(), is(equalTo("+41 32 623 71 91")));
        assertThat(result.getDescription(), is(equalTo(
                "Aufgrund der aktuellen Lage wegen – der Covid19-Pandemie bleibt der Schalter der Neutralen Beratung Treuhand GmbH bis … auf Weiteres geschlossen."
        )));
    }

    private LocalHeroPost localHeroPost() {
        List<String> categories = new ArrayList<>(3);
        categories.add("cat 1");
        categories.add("cat 2");
        categories.add("cat 3");

        RenderedContent content = RenderedContent.builder()
                .rendered(
                        "<p>Aufgrund der aktuellen Lage wegen der Covid19-Pandemie bleibt der Schalter der Neutralen Beratung " +
                                "Treuhand GmbH bis auf Weiteres geschlossen. &#8211; <strong>Die Neutrale Beratung Treuhand ist per E-Mail und " +
                                "per Telefon <a href=\"http://+41326237191\" data-wplink-url-error=\"true\">032 623 71 91</a> " +
                                "erreichbar</strong>.</p><p>Sie können Ihre Unterlagen neben unserem Büro in den grossen Briefkasten " +
                                "legen oder uns diese per Post zusenden. &#8230; Für Rückfragen bitte einfach eine Telefonnummer dazu schreiben. " +
                                "Ihre Steuererklärung wird dann wie gewohnt von uns für Sie erstellt.</p><p>Um eine Abgabefrist per " +
                                "31. Juli garantieren zu können, müssten die Unterlagen bis spätestens am 30.06.2020 bei uns eingegangen " +
                                "sein.</p><p>Wir bedanken uns für Ihr Verständnis und wünschen Ihnen und Ihrer Familie alles Gute.</p>" +
                                "<p>Neutrale Beratung Treuhand GmbH<br />Rötistrasse 3, 4500 Solothurn</p><p>Thomas Hodel &amp; Heidi " +
                                "Pfister<br /><a href=\"tel:+41326237191\">032 623 71 91</a></p>" +
                                "<p><a href=\"https://www.steuerprofis.ch/\">www.steuerprofis.ch</a></p>" +
                                "<p>Email: <a href=\"mailto:foo@example.com\">foo@example.com</a></p>"
                )
                .build();

        RenderedContent excerpt = RenderedContent.builder()
                .rendered(
                        "<p>Aufgrund der aktuellen Lage wegen &#8211; der Covid19-Pandemie bleibt der Schalter der Neutralen Beratung " +
                                "Treuhand GmbH bis &#8230; auf Weiteres geschlossen."
                )
                .build();

        RenderedContent guid = RenderedContent.builder()
                .rendered("guid")
                .build();

        RenderedContent title = RenderedContent.builder()
                .rendered("<p>title &#8211; &#8230; </p>")
                .build();


        return LocalHeroPost.builder()
                .categories(categories)
                .content(content)
                .excerpt(excerpt)
                .guid(guid)
                .id(123)
                .title(title)
                .build();
    }
}
