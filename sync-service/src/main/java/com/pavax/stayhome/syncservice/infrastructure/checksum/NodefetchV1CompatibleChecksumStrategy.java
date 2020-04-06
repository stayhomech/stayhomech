package com.pavax.stayhome.syncservice.infrastructure.checksum;

import java.util.Set;

import com.google.common.collect.Sets;
import com.pavax.stayhome.syncservice.service.BusinessRequestDto;
import com.pavax.stayhome.syncservice.service.ChecksumStrategy;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;


@Component
@Order(100)
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
				businessRequestDto.getLanguage() +
				businessRequestDto.getDelivery();
		return DigestUtils.md5DigestAsHex(checkSumString.getBytes());
	}

}
