package ch.stayhome.integrations.localhero.infrastructure.feign.querymap;

import lombok.Getter;

@Getter
@SuppressWarnings("java:S116")      // disable sonarlint naming convention warning
public class LocalHero implements PagingQueryMap {
    private Integer per_page;
    private Integer page;

    @Override
    public void setPage(Integer page) {
        this.page = page;
    }

    @Override
    public void setPageSize(Integer pageSize) {
        per_page = pageSize;
    }
}
