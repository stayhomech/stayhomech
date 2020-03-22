package com.pavax.stayhome.syncservice.infrastructure.feign;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import com.pavax.stayhome.syncservice.domain.PostalCode;
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
class FeignBasedPostalCodeRepositoryTest {

	@Autowired
	private FeignBasedPostalCodeRepository feignBasedPostalCodeRepository;

	@Test
	void findByNpa() {
		// given
		final PostalCode postalCode = new PostalCode().setId("955").setName("Bern").setNpa("3000");

		// when
		final List<PostalCode> results = feignBasedPostalCodeRepository.findByNpa(postalCode.getNpa());

		// then
		assertThat(results).containsExactly(postalCode);
	}
}
