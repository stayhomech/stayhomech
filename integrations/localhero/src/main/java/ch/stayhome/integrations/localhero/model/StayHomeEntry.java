package ch.stayhome.integrations.localhero.model;

import javax.validation.constraints.NotNull;

import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

@Data
@Builder
public class StayHomeEntry {

	@NotNull
	@NonNull
	private String id;

	@NotNull
	@NonNull
	private String providerName;

	@NotNull
	@NonNull
	private String name;

	@NotNull
	@NonNull
	private String description;

	@NotNull
	private String contact;

	@NonNull
	private String location;

	@NonNull
	private String email;

	@NonNull
	private String phone;

	@NonNull
	private String delivery;

	@NonNull
	private String categories;

	@NonNull
	private Long ttl;

	@NotNull
	@NonNull
	private String website;
}
