package com.pavax.stayhome.syncservice.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class BusinessRequestTest {

	@Test
	void prepareForSaving_removes_special_characters() {
		// given
		BusinessRequest businessRequest = BusinessRequestFixture.test("1234");

		//when
		businessRequest.setDescription("\uD83D\uDC9A This is a Text containing emoji: \uD83D\uDC96 but also umlaute: üöäèêé and symbols: -,.*/-");

		// then
		assertThat(businessRequest.getDescription()).isEqualTo("This is a Text containing emoji:  but also umlaute: üöäèêé and symbols: -,.*/-");
	}

}
