package ch.stayhome.integrations.utils;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;


class ContactInformationGuesserTest {

    private ContactInformationGuesser guesser;

    @BeforeEach
    void setUp() {
        guesser = new ContactInformationGuesser();
    }

    @Test
    public void testExtractWebsiteFromComplexInfo() {
        // given
        final String text = "<p>Aufgrund der aktuellen Lage wegen der Covid19-Pandemie bleibt der Schalter der Neutralen Beratung " +
                "Treuhand GmbH bis auf Weiteres geschlossen. <strong>Die Neutrale Beratung Treuhand ist per E-Mail und " +
                "per Telefon <a href=\"http://+41326237191\" data-wplink-url-error=\"true\">032 623 71 91</a> " +
                "erreichbar</strong>.</p><p>Sie können Ihre Unterlagen neben unserem Büro in den grossen Briefkasten " +
                "legen oder uns diese per Post zusenden. Für Rückfragen bitte einfach eine Telefonnummer dazu schreiben. " +
                "Ihre Steuererklärung wird dann wie gewohnt von uns für Sie erstellt.</p><p>Um eine Abgabefrist per " +
                "31. Juli garantieren zu können, müssten die Unterlagen bis spätestens am 30.06.2020 bei uns eingegangen " +
                "sein.</p><p>Wir bedanken uns für Ihr Verständnis und wünschen Ihnen und Ihrer Familie alles Gute.</p>" +
                "<p>Neutrale Beratung Treuhand GmbH<br />Rötistrasse 3, 4500 Solothurn</p><p>Thomas Hodel &amp; Heidi " +
                "Pfister<br /><a href=\"tel:+41326237191\">032 623 71 91</a></p>" +
                "<p><a href=\"https://www.steuerprofis.ch/\">www.steuerprofis.ch</a></p>" +
                "<p>Email: <a href=\"mailto:foo@example.com\">foo@example.com</a></p>";


        // when
        final String result = this.guesser.extractWebsite(text);

        // then
        assertThat(result).isEqualTo("https://www.steuerprofis.ch/");
    }

    @Test
    public void testExtractEmailFromComplexInfo() {
        // given
        final String text = "<p>Aufgrund der aktuellen Lage wegen der Covid19-Pandemie bleibt der Schalter der Neutralen Beratung " +
                "Treuhand GmbH bis auf Weiteres geschlossen. <strong>Die Neutrale Beratung Treuhand ist per E-Mail und " +
                "per Telefon <a href=\"http://+41326237191\" data-wplink-url-error=\"true\">032 623 71 91</a> " +
                "erreichbar</strong>.</p><p>Sie können Ihre Unterlagen neben unserem Büro in den grossen Briefkasten " +
                "legen oder uns diese per Post zusenden. Für Rückfragen bitte einfach eine Telefonnummer dazu schreiben. " +
                "Ihre Steuererklärung wird dann wie gewohnt von uns für Sie erstellt.</p><p>Um eine Abgabefrist per " +
                "31. Juli garantieren zu können, müssten die Unterlagen bis spätestens am 30.06.2020 bei uns eingegangen " +
                "sein.</p><p>Wir bedanken uns für Ihr Verständnis und wünschen Ihnen und Ihrer Familie alles Gute.</p>" +
                "<p>Neutrale Beratung Treuhand GmbH<br />Rötistrasse 3, 4500 Solothurn</p><p>Thomas Hodel &amp; Heidi " +
                "Pfister<br /><a href=\"tel:+41326237191\">032 623 71 91</a></p>" +
                "<p><a href=\"https://www.steuerprofis.ch/\">www.steuerprofis.ch</a></p>" +
                "<p>Email: <a href=\"mailto:foo@example.com\">foo@example.com</a></p>";


        // when
        final String result = this.guesser.extractEmail(text);

        // then
        assertThat(result).isEqualTo("foo@example.com");
    }

    @Test
    public void testExtractPhoneFromComplexInfo() {
        // given
        final String text = "<p>Aufgrund der aktuellen Lage wegen der Covid19-Pandemie bleibt der Schalter der Neutralen Beratung " +
                "Treuhand GmbH bis auf Weiteres geschlossen. <strong>Die Neutrale Beratung Treuhand ist per E-Mail und " +
                "per Telefon <a href=\"http://+41326237191\" data-wplink-url-error=\"true\">032 623 71 91</a> " +
                "erreichbar</strong>.</p><p>Sie können Ihre Unterlagen neben unserem Büro in den grossen Briefkasten " +
                "legen oder uns diese per Post zusenden. Für Rückfragen bitte einfach eine Telefonnummer dazu schreiben. " +
                "Ihre Steuererklärung wird dann wie gewohnt von uns für Sie erstellt.</p><p>Um eine Abgabefrist per " +
                "31. Juli garantieren zu können, müssten die Unterlagen bis spätestens am 30.06.2020 bei uns eingegangen " +
                "sein.</p><p>Wir bedanken uns für Ihr Verständnis und wünschen Ihnen und Ihrer Familie alles Gute.</p>" +
                "<p>Neutrale Beratung Treuhand GmbH<br />Rötistrasse 3, 4500 Solothurn</p><p>Thomas Hodel &amp; Heidi " +
                "Pfister<br /><a href=\"tel:+41326237191\">032 623 71 91</a></p>" +
                "<p><a href=\"https://www.steuerprofis.ch/\">www.steuerprofis.ch</a></p>" +
                "<p>Email: <a href=\"mailto:foo@example.com\">foo@example.com</a></p>";


        // when
        final String result = this.guesser.extractPhoneNumber(text);

        // then
        assertThat(result).isEqualTo("+41 32 623 71 91");
    }

    @Test
    void testExtractPhoneNumber() {
        // given
        final String text = "Telefon: 032 622 63 64\n" +
                "                    E-Mail: info@chuchilade.ch\n" +
                "                    https://hautecuisine.ch/ \n" +
                "                ";
        // when
        final String result = this.guesser.extractPhoneNumber(text);

        // then
        assertThat(result).isEqualTo("+41 32 622 63 64");
    }

    @Test
    void testExtractEmail() {
        // given
        final String text = "Telefon: 032 622 63 64\n" +
                "                    E-Mail: info@chuchilade.ch\n" +
                "                    https://hautecuisine.ch/ \n" +
                "                ";
        // when
        final String result = this.guesser.extractEmail(text);

        // then
        assertThat(result).isEqualTo("info@chuchilade.ch");
    }

    @Test
    public void extractNoWebsite() {
        // given
        final String text = "This does not contain a website";

        // when
        final String result = this.guesser.extractWebsite(text);

        // then
        assertThat(result).isEqualTo("");
    }

    @Test
    public void extractNoWebsiteButEmail() {
        // given
        final String text = "Here is just an email address: foo@example.com and it should not be extracted";

        // when
        final String result = this.guesser.extractWebsite(text);

        // then
        assertThat(result).isEqualTo("");
    }

    @Test
    void testExtractWebsite() {
        // given
        final String text = "Telefon: 032 622 63 64\n" +
                "                    E-Mail: info@chuchilade.ch\n" +
                "                    https://hautecuisine.ch/ \n" +
                "                ";
        // when
        final String result = this.guesser.extractWebsite(text);

        // then
        assertThat(result).isEqualTo("https://hautecuisine.ch/");
    }

    @Test
    void testExtractStreet() {
        // given
        final String text = "Aweird-STrééétNäämüä 47 , another-string";
        // when
        final String result = this.guesser.extractStreet(text);

        // then
        assertThat(result).isEqualTo("Aweird-STrééétNäämüä 47");
    }


    @Test
    void testExtractInvalidStreet() {
        // given
        final String text = "nonsone";
        // when
        final String result = this.guesser.extractStreet(text);

        // then
        assertThat(result).isEqualTo("");
    }

}
