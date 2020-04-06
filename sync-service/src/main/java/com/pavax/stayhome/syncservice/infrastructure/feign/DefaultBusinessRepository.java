package com.pavax.stayhome.syncservice.infrastructure.feign;

import java.util.List;
import java.util.Optional;

import com.pavax.stayhome.syncservice.domain.BusinessRequest;
import com.pavax.stayhome.syncservice.domain.BusinessRequestRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Repository;

@Repository
@Retryable(backoff = @Backoff(delay = 2_000, multiplier = 1.5, maxDelay = 30_000))
class DefaultBusinessRepository implements BusinessRequestRepository {

	private static final Logger LOGGER = LoggerFactory.getLogger(DefaultBusinessRepository.class);

	private final FeignBasedBusinessRepository feignBasedBusinessRepository;

	public DefaultBusinessRepository(FeignBasedBusinessRepository feignBasedBusinessRepository) {
		this.feignBasedBusinessRepository = feignBasedBusinessRepository;
	}

	@Override
	public Optional<BusinessRequest> findByCorrelationId(String correlationId) {
		final List<BusinessRequest> byCorrelationId = this.feignBasedBusinessRepository.findByCorrelationId(correlationId);
		if (byCorrelationId.isEmpty()) {
			return Optional.empty();
		}
		return Optional.of(byCorrelationId.get(0));
	}

	@Override
	public BusinessRequest save(BusinessRequest businessRequest) {
		LOGGER.debug("Create a new Business-Request: {}", businessRequest.getSourceUUid());
		businessRequest.prepareForSaving();
		return this.feignBasedBusinessRepository.save(businessRequest);
	}

	@Override
	public void update(BusinessRequest businessRequest) {
		LOGGER.debug("Update a existing Business-Request: {}", businessRequest.getUuid());
		businessRequest.prepareForSaving();
		this.feignBasedBusinessRepository.update(businessRequest.getUuid(), businessRequest);
	}

}
