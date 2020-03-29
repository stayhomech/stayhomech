package com.pavax.stayhome.syncservice.domain;

import java.util.Optional;


public interface BusinessRequestRepository {

	Optional<BusinessRequest> findBySourceId(String sourceId);

	BusinessRequest save(BusinessRequest businessRequest);

	void update(BusinessRequest businessRequest);

}
