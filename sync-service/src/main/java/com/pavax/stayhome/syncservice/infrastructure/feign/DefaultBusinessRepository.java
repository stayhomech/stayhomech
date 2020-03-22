package com.pavax.stayhome.syncservice.infrastructure.feign;

import java.util.List;
import java.util.Optional;

import com.pavax.stayhome.syncservice.domain.BusinessRequest;
import com.pavax.stayhome.syncservice.domain.BusinessRequestRepository;

import org.springframework.stereotype.Repository;

@Repository
class DefaultBusinessRepository implements BusinessRequestRepository {

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
		return this.feignBasedBusinessRepository.save(businessRequest);
	}
}
