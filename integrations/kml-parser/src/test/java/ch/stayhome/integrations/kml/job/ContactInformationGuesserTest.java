package ch.stayhome.integrations.kml.job;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


class ContactInformationGuesserTest {

	private ContactInformationGuesser guesser;

	@BeforeEach
	void setUp() {
		guesser = new ContactInformationGuesser();
	}

	@Test
	void testExtractPhoneNumber() {
		// given
		final String text = "Telefon: 032 622 63 64\n" +
				"                    E-Mail: info@chuchilade.ch\n" +
				"                    https://hautecuisine.ch/ \n" +
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
				"                    https://hautecuisine.ch/ \n" +
				"                ";
		// when
		final String result = this.guesser.extractEmail(text);

		// then
		assertThat(result).isEqualTo("info@chuchilade.ch");
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

}
