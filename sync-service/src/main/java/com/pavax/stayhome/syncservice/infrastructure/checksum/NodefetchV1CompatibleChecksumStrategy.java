package com.pavax.stayhome.syncservice.infrastructure.checksum;

import java.util.Set;

import com.google.common.collect.Sets;
import com.pavax.stayhome.syncservice.service.BusinessRequestDto;
import com.pavax.stayhome.syncservice.service.ChecksumStrategy;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;


/**
 * Nodefetch compatible ChecksumStrategy for the version we have on our Production (git commit: 88bb663237793648119f37feb553d41729c97175)
 */
@Component
@Order(100)
@ConditionalOnProperty(value = "sync-service.checksum.strategy.nodefetch", havingValue = "v1", matchIfMissing = false)
class NodefetchV1CompatibleChecksumStrategy implements ChecksumStrategy {

	private Set<String> providerNames = Sets.newHashSet("DerBund", "laedelishop");

	@Override
	public boolean supports(BusinessRequestDto businessRequestDto) {
		return providerNames.contains(businessRequestDto.getProviderName());
	}

	@Override
	public String calcChecksum(BusinessRequestDto businessRequestDto) {
		final String checkSumString = businessRequestDto.getName() +
				businessRequestDto.getDescription() +
				businessRequestDto.getLocation() +
				businessRequestDto.getWebsite() +
				businessRequestDto.getPhone() +
				businessRequestDto.getEmail() +
				businessRequestDto.getCategories() +
				businessRequestDto.getContact() +
				"de" +
				businessRequestDto.getDelivery();
		return DigestUtils.md5DigestAsHex(checkSumString.getBytes());
	}

}
