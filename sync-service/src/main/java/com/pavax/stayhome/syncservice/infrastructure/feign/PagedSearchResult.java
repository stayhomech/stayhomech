package com.pavax.stayhome.syncservice.infrastructure.feign;

import java.util.List;

import com.pavax.stayhome.syncservice.domain.BusinessRequest;
import lombok.Data;

@Data
public class PagedSearchResult {

	private int count;

	private List<BusinessRequest> results;

}
