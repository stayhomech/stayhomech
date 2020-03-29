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

	private static final ParameterizedType LIST_TYPE = (ParameterizedType) new TypeToken<List<Object>>() {}.getType();

	private final Decoder delegate;

	public PagedWordPressResultDecoder(Decoder delegate) {
		this.delegate = delegate;
	}

	@Override
	public Object decode(Response response, Type type) throws FeignException, IOException {
		if (supports(type)) {
			final String totalItems = firstHeader(response, "x-wp-total");
			final String totalPages = firstHeader(response, "x-wp-totalpages");
			final Object decode = delegate.decode(response, new ListParameterType(actualTypeArgument(type)));
			return PagedWordPressResult.builder()
					.totalItems(Integer.parseInt(totalItems))
					.totalPages(Integer.parseInt(totalPages))
					.content((List<Object>) decode)
					.build();
		}
		return delegate.decode(response, type);
	}

	private Type actualTypeArgument(Type type) {
		ParameterizedType pt = (ParameterizedType) type;
		return pt.getActualTypeArguments().length > 0 ? pt.getActualTypeArguments()[0] : null;
	}

	private String firstHeader(Response response, String s) {
		return response.headers().get(s).iterator().next();
	}

	private boolean supports(Type type) {
		return type.getTypeName().contains("PagedWordPressResult");
	}

	static class ListParameterType implements ParameterizedType {

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
