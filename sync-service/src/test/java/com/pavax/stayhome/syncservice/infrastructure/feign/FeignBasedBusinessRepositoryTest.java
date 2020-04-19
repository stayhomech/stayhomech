package com.pavax.stayhome.syncservice.infrastructure.feign;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@ActiveProfiles("test")
@Disabled("waiting for integration platform")
class FeignBasedBusinessRepositoryTest {

	@Autowired
	private FeignBasedBusinessRepository repository;

	@Test
	void findByCorrelationId() {
		final PagedSearchResult pagedSearchResult = this.repository.findBySourceId("aargauerzeitung-7.61325490000002_47.191717_0_243f2046455255d4690ab5537973699c");

		assertThat(pagedSearchResult).isNotNull();
	}

}
