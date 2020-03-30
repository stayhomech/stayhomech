package ch.stayhome.integrations.localhero.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PagedWordPressResult<T> {

	private int totalPages;

	private int totalItems;

	private List<T> content;

}
