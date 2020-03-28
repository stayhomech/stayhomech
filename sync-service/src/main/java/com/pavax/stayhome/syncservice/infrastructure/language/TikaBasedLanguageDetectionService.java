package com.pavax.stayhome.syncservice.infrastructure.language;

import java.io.IOException;
import java.util.Optional;
import java.util.Set;

import com.google.common.collect.Sets;
import com.pavax.stayhome.syncservice.domain.BusinessRequest;
import com.pavax.stayhome.syncservice.service.Language;
import com.pavax.stayhome.syncservice.service.LanguageDetectionService;
import org.apache.tika.langdetect.OptimaizeLangDetector;
import org.apache.tika.language.detect.LanguageConfidence;
import org.apache.tika.language.detect.LanguageDetector;
import org.apache.tika.language.detect.LanguageResult;

import org.springframework.stereotype.Component;

@Component
class TikaBasedLanguageDetectionService implements LanguageDetectionService {

	private LanguageDetector languageDetector;

	public TikaBasedLanguageDetectionService() throws IOException {
		final OptimaizeLangDetector optimaizeLangDetector = new OptimaizeLangDetector();
		optimaizeLangDetector.loadModels();
		this.languageDetector = optimaizeLangDetector;
	}

	@Override
	public Optional<Language> detect(BusinessRequest businessRequest) {
		this.languageDetector.addText(businessRequest.getDescription());
		this.languageDetector.addText(businessRequest.getContact());
		final LanguageResult detect = this.languageDetector.detect();
		Set<LanguageConfidence> expectedConfidence = Sets.newHashSet(LanguageConfidence.HIGH);
		if (expectedConfidence.contains(detect.getConfidence())) {
			final String language = detect.getLanguage();
			return Language.of(language);
		}
		return Optional.empty();
	}

}
