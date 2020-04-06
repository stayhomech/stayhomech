package com.pavax.stayhome.syncservice.infrastructure.checksum;

import com.pavax.stayhome.syncservice.service.BusinessRequestDto;
import com.pavax.stayhome.syncservice.service.ChecksumStrategy;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;


@Component
@Order(Ordered.LOWEST_PRECEDENCE)
class DefaultChecksumStrategy implements ChecksumStrategy {

	@Override
	public boolean supports(BusinessRequestDto businessRequestDto) {
		return true;
	}

	@Override
	public String calcChecksum(BusinessRequestDto businessRequestDto) {
		return new ChecksumBuilder(s -> DigestUtils.md5DigestAsHex(s.getBytes()))
				.append(businessRequestDto.getName())
				.append(businessRequestDto.getDescription())
				.append(businessRequestDto.getAddress())
				.append(businessRequestDto.getLocation())
				.append(businessRequestDto.getContact())
				.append(businessRequestDto.getWebsite())
				.append(businessRequestDto.getPhone())
				.append(businessRequestDto.getEmail())
				.append(businessRequestDto.getCategories())
				.append(businessRequestDto.getDelivery())
				.toCheckSum();
	}

}
