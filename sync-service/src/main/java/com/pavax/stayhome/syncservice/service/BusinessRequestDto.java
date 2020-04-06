package com.pavax.stayhome.syncservice.service;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data()
@ToString
@EqualsAndHashCode
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BusinessRequestDto {

	private String categories;

	private String delivery;

	@NotBlank
	private String description;

	private String contact;

	@Size(max = 255)
	private String email;

	@NotBlank
	@Size(max = 200)
	private String id;

	@Size(max = 255)
	@NotBlank
	private String name;

	@Size(max = 255)
	private String phone;

	@NotBlank
	@Size(max = 55)
	private String providerName;

	@Size(max = 255)
	private String website;

	@Size(max = 255)
	private String location;

	@Size(max = 255)
	private String address;

	private Language language;

	private Long ttl;

}
