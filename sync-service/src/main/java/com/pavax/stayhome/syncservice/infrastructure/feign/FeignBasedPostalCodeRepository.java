package com.pavax.stayhome.syncservice.infrastructure.feign;

import java.util.List;

import com.pavax.stayhome.syncservice.domain.PostalCode;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(value = "stayhome", contextId = "stayhome-npa", path = "/npas/", url = "${stayhome.api.url}")
interface FeignBasedPostalCodeRepository {

	@GetMapping
	List<PostalCode> findByNpa(@RequestParam("npa") String npa);

}
