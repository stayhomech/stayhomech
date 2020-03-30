package ch.stayhome.integrations.localhero.model;

import java.util.List;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocalHeroPost {
	@NotNull
	@NonNull
	private Integer id;

	@NotNull
	@NonNull
	private RenderedContent title;          // --> name

	@NotNull
	@NonNull
	private RenderedContent excerpt;        // --> description

	@NotNull
	@NonNull
	private RenderedContent guid;           // --> website

	@NotNull
	@NonNull
	private List<String> categories;

	public class RenderedContent {
		@Getter
		@Setter
		private String rendered;
	}
}
