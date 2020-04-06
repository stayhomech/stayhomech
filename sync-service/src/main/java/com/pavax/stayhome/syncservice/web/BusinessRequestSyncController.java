package com.pavax.stayhome.syncservice.web;

import com.pavax.stayhome.syncservice.service.BusinessRequestDto;
import com.pavax.stayhome.syncservice.service.BusinessRequestSyncService;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/business-entry")
public class BusinessRequestSyncController {

	private final BusinessRequestSyncService businessRequestSyncService;

	public BusinessRequestSyncController(BusinessRequestSyncService businessRequestSyncService) {
		this.businessRequestSyncService = businessRequestSyncService;
	}

	@PostMapping("/")
	public void upsert(@RequestBody @Validated BusinessRequestDto businessRequestDto) {
		this.businessRequestSyncService.sync(businessRequestDto);
	}

}
