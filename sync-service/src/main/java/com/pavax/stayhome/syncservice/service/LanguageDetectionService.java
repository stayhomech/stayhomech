package com.pavax.stayhome.syncservice.service;

import java.util.Optional;

public interface LanguageDetectionService {

	Optional<Language> detect(String... values);

}
