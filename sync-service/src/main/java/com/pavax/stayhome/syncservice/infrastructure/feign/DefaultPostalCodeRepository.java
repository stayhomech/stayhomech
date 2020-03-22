package com.pavax.stayhome.syncservice.infrastructure.feign;

import java.util.List;
import java.util.Optional;

import com.pavax.stayhome.syncservice.domain.PostalCode;
import com.pavax.stayhome.syncservice.domain.PostalCodeRepository;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

@Component
class DefaultPostalCodeRepository implements PostalCodeRepository {

	private final FeignBasedPostalCodeRepository feignBasedPostalCodeRepository;

	public DefaultPostalCodeRepository(FeignBasedPostalCodeRepository feignBasedPostalCodeRepository) {
		this.feignBasedPostalCodeRepository = feignBasedPostalCodeRepository;
	}

	@Override
	public Optional<PostalCode> findByZipCode(String zipCode) {
		final List<PostalCode> results = this.feignBasedPostalCodeRepository.findByNpa(zipCode);
		if (results.isEmpty()) {
			return Optional.empty();
		}
		return Optional.of(results.get(0));
	}

	@Cacheable(cacheNames = "postalCodeRepository.get-by-zip-code")
	@Override
	public PostalCode getByZipCode(String zipCode) {
		return this.findByZipCode(zipCode).orElseThrow(() -> new PostalCodeNotFoundException(zipCode));
	}

}
