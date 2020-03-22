package com.pavax.stayhome.syncservice.domain;

import java.util.Optional;


public interface BusinessRequestRepository {

	Optional<BusinessRequest> findByCorrelationId(String correlationId);

	BusinessRequest save(BusinessRequest businessRequest);

}
