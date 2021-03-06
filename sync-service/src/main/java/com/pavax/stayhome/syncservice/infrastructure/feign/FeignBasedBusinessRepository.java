package com.pavax.stayhome.syncservice.infrastructure.feign;

import com.pavax.stayhome.syncservice.domain.BusinessRequest;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(value = "stayhome", contextId = "stayhome-requests", path = "/requests", url = "${stayhome.api.url}")
interface FeignBasedBusinessRepository {

	@GetMapping
	PagedSearchResult findBySourceId(@RequestParam("source_uuid") String sourceId);

	@PostMapping("/")
	BusinessRequest save(@RequestBody BusinessRequest businessRequest);

	@PutMapping("/{id}/")
	void update(@PathVariable("id") String id, @RequestBody BusinessRequest businessRequest);

}
