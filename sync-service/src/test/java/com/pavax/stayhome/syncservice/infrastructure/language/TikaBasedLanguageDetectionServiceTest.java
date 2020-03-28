package com.pavax.stayhome.syncservice.infrastructure.language;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.util.Optional;

import com.pavax.stayhome.syncservice.domain.BusinessRequest;
import com.pavax.stayhome.syncservice.domain.BusinessRequestFixture;
import com.pavax.stayhome.syncservice.service.Language;
import com.pavax.stayhome.syncservice.service.LanguageDetectionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TikaBasedLanguageDetectionServiceTest {

	private LanguageDetectionService languageDetectionService;

	@BeforeEach
	void setUp() throws IOException {
		this.languageDetectionService = new TikaBasedLanguageDetectionService();
	}

	@Test
	void testDetectGerman() {
		// given
		final BusinessRequest businessRequest = BusinessRequestFixture.test("001");
		businessRequest.setDescription("StayHome.ch ist eine Initative von privaten Personen, welche in Zeiten der Corona/Covid-19 Epidemie helfen möchten! Wir haben keinen kommerziellen Zweck.");

		// when
		final Optional<Language> language = languageDetectionService.detect(businessRequest);

		// then
		assertThat(language).contains(Language.GERMAN);
	}

	@Test
	void testDetectFrench() {
		// given
		final BusinessRequest businessRequest = BusinessRequestFixture.test("001");
		businessRequest.setDescription("StayHome.ch est une initiative privée d'une personne désireuse d'apporter son aide pour faire face aux conséquences de l'épidémie de COVID-19. Elle n'a aucun objectif mercantile.");

		// when
		final Optional<Language> language = languageDetectionService.detect(businessRequest);

		// then
		assertThat(language).contains(Language.FRENCH);
	}

	@Test
	void testDetectItalian() {
		// given
		final BusinessRequest businessRequest = BusinessRequestFixture.test("001");
		businessRequest.setDescription("StayHome.ch é un iniziativa privata di una persona desiderosa di aiutare di fronte alle conseguenze dell'epidemia di COVID-19. Iniziativa senza scopo di lucro.");

		// when
		final Optional<Language> language = languageDetectionService.detect(businessRequest);

		// then
		assertThat(language).contains(Language.ITALIAN);
	}

	@Test
	void testDetectEnglish() {
		// given
		final BusinessRequest businessRequest = BusinessRequestFixture.test("001");
		businessRequest.setDescription("StayHome.ch is an initiative of a private person willing to help to cope with the consequences of the COVID-19 epidemy. It has no commercial purpose.");

		// when
		final Optional<Language> language = languageDetectionService.detect(businessRequest);

		// then
		assertThat(language).contains(Language.ENGLISH);
	}

	@Test
	void testDetectMixedLanguage() {
		// given
		final BusinessRequest businessRequest = BusinessRequestFixture.test("001");
		businessRequest.setDescription(
				"StayHome.ch is an initiative of a private person willing to help to cope with the consequences of the COVID-19 epidemy. It has no commercial purpose." +
						"StayHome.ch ist eine Initative von privaten Personen, welche in Zeiten der Corona/Covid-19 Epidemie helfen möchten! Wir haben keinen kommerziellen Zweck." +
						"StayHome.ch est une initiative privée d'une personne désireuse d'apporter son aide pour faire face aux conséquences de l'épidémie de COVID-19. Elle n'a aucun objectif mercantile.");

		// when
		final Optional<Language> language = languageDetectionService.detect(businessRequest);

		// then
		assertThat(language).isNotPresent();
	}


	@Test
	void testDetectUnsupportedLanguage() {
		// given
		final BusinessRequest businessRequest = BusinessRequestFixture.test("001");
		businessRequest.setDescription("StayHome.ch es una iniciativa privada de una persona que desea ayudar a hacer frente a las consecuencias de la epidemia de COVID-19. No tiene objetivo mercantil.");

		// when
		final Optional<Language> language = languageDetectionService.detect(businessRequest);

		// then
		assertThat(language).isNotPresent();
	}
}
