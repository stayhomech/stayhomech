package ch.stayhome.integrations.localhero.infrastructure.feign.querymap;

public interface PagingQueryMap {
    void setPage(Integer page);
    void setPageSize(Integer pageSize);
}
