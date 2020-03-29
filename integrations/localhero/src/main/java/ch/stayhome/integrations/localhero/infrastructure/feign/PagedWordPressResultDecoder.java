package ch.stayhome.integrations.localhero.infrastructure.feign;

import java.io.IOException;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;

import ch.stayhome.integrations.localhero.model.PagedWordPressResult;
import com.google.gson.reflect.TypeToken;
import feign.FeignException;
import feign.Response;
import feign.codec.Decoder;

public class PagedWordPressResultDecoder implements Decoder {

	private static final String WP_HEADER_TOTAL_POSTS = "x-wp-total";

	private static final String WP_HEADER_TOTAL_PAGES = "x-wp-totalpages";

	private final Decoder delegate;

	public PagedWordPressResultDecoder(Decoder delegate) {
		this.delegate = delegate;
	}

	@Override
	public Object decode(Response response, Type type) throws FeignException, IOException {
		if (!isPagedWordPressResult(type)) {
			return delegate.decode(response, type);
		}
		final String totalItems = firstHeader(response, WP_HEADER_TOTAL_POSTS);
		final String totalPages = firstHeader(response, WP_HEADER_TOTAL_PAGES);
		final Object content = delegate.decode(response, new ListParameterType(actualTypeArgument(type)));
		return PagedWordPressResult.builder()
				.totalItems(Integer.parseInt(totalItems))
				.totalPages(Integer.parseInt(totalPages))
				.content((List<Object>) content)
				.build();
	}

	private Type actualTypeArgument(Type type) {
		ParameterizedType pt = (ParameterizedType) type;
		return pt.getActualTypeArguments().length > 0 ? pt.getActualTypeArguments()[0] : null;
	}

	private String firstHeader(Response response, String s) {
		return response.headers().get(s).iterator().next();
	}

	private boolean isPagedWordPressResult(Type type) {
		// TODO Improve this check
		return type.getTypeName().contains("PagedWordPressResult");
	}

	static class ListParameterType implements ParameterizedType {

		private static final ParameterizedType LIST_TYPE = (ParameterizedType) new TypeToken<List<Object>>() {}.getType();

		private final Type actualArgumentType;

		public ListParameterType(Type type) {
			this.actualArgumentType = type;
		}

		@Override
		public Type[] getActualTypeArguments() {
			return new Type[] {actualArgumentType};
		}

		@Override
		public Type getRawType() {
			return LIST_TYPE.getRawType();
		}

		@Override
		public Type getOwnerType() {
			return LIST_TYPE.getOwnerType();
		}
	}
}
