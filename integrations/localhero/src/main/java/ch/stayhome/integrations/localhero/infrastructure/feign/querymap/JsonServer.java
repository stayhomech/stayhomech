package ch.stayhome.integrations.localhero.infrastructure.feign.querymap;

import lombok.Getter;

@Getter
@SuppressWarnings("java:S116")      // disable sonarlint naming convention warning
public class JsonServer implements PagingQueryMap {
    private Integer _page;
    private Integer _limit;


    @Override
    public void setPage(Integer page) {
        _page = page;
    }

    @Override
    public void setPageSize(Integer pageSize) {
        _limit = pageSize;
    }
}
