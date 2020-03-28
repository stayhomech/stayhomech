package com.pavax.stayhome.syncservice.service;

import java.util.Optional;

import com.pavax.stayhome.syncservice.domain.BusinessRequest;

public interface LanguageDetectionService {

	Optional<Language> detect(BusinessRequest businessRequest);

}
