package com.pavax.stayhome.syncservice.infrastructure.checksum;

import static org.assertj.core.api.Assertions.assertThat;

import com.pavax.stayhome.syncservice.service.BusinessRequestDto;
import org.junit.jupiter.api.Test;

class DefaultChecksumStrategyTest {

	private DefaultChecksumStrategy checksumStrategy = new DefaultChecksumStrategy();

	@Test
	void testCalculateButIgnoreEmptyAndNullProperties() {
		// given
		final BusinessRequestDto businessRequestOne = BusinessRequestDto.builder()
				.name("My Request")
				.description("My description")
				.address("My Street")
				.location("My City")
				.delivery("")
				.categories("")
				.email("")
				.website("")
				.phone("")
				.build();

		final BusinessRequestDto businessRequestTwo = BusinessRequestDto.builder()
				.name("My Request")
				.description("My description")
				.address("My Street")
				.location("My City")
				.delivery(null)
				.build();
		// when
		final String checksumOne = checksumStrategy.calcChecksum(businessRequestOne);
		final String checksumTwo = checksumStrategy.calcChecksum(businessRequestTwo);

		//then
		assertThat(checksumOne).isEqualTo(checksumTwo);

	}
}
