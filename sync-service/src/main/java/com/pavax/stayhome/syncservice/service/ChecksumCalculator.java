package com.pavax.stayhome.syncservice.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Component;

@Component
class ChecksumCalculator {

	private static final Logger LOGGER = LoggerFactory.getLogger(ChecksumCalculator.class);

	private final List<ChecksumStrategy> checksumStrategies;

	ChecksumCalculator(List<ChecksumStrategy> checksumStrategies) {
		LOGGER.info("Found {} checksum-strategies: {}", checksumStrategies.size(), checksumStrategies.toString());
		this.checksumStrategies = checksumStrategies;
	}

	public String calculate(BusinessRequestDto businessRequestDto) {
		return this.checksumStrategies.stream()
				.filter(checksumStrategy -> checksumStrategy.supports(businessRequestDto))
				.findFirst()
				.map(checksumStrategy -> checksumStrategy.calcChecksum(businessRequestDto))
				.orElseThrow(() -> new IllegalArgumentException("Could not find a checksum-strategy for " + businessRequestDto));

	}

}
