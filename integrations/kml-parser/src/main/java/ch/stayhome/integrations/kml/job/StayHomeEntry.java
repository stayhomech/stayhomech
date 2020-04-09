package ch.stayhome.integrations.kml.job;

import javax.validation.constraints.NotBlank;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StayHomeEntry {

	@NotBlank
	private String id;

	@NotBlank
	private String providerName;

	@NotBlank
	private String name;

	@NotBlank
	private String description;

	@NotBlank
	private String contact;

	@NotBlank
	private String address;

	@NotBlank
	private String location;

	private String email;

	private String phone;

	@NotBlank
	private String delivery;

	@NotBlank
	private String categories;

	private Long ttl;

	private String website;

}
