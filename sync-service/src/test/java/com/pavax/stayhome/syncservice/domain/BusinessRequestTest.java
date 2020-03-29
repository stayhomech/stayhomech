package com.pavax.stayhome.syncservice.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class BusinessRequestTest {

	@Test
	void setDescription_removes_special_characters() {
		// given
		BusinessRequest businessRequest = BusinessRequestFixture.test("1234");

		//when
		businessRequest.setDescription("\uD83D\uDC9A This is a Text containing emoji: \uD83D\uDC96 but also umlaute: üöäèêé and symbols: -,.*/-");

		// then
		assertThat(businessRequest.getDescription()).isEqualTo("This is a Text containing emoji:  but also umlaute: üöäèêé and symbols: -,.*/-");
	}

	@Test
	void setDescription_keep_new_lines() {
		// given
		BusinessRequest businessRequest = BusinessRequestFixture.test("1234");

		//when
		businessRequest.setDescription("This Text contains \n new lines");

		// then
		assertThat(businessRequest.getDescription()).isEqualTo("This Text contains \n new lines");
	}

}
