from prometheus_client import Counter, Summary

_STATS_PREFIX = 'stayhome_'

STATS = {
    
    # Page hits
    'page_hits_pre_cache': Counter(_STATS_PREFIX + 'page_hits_pre_cache', 'Hits on page , pre-cache', ['page', 'language']),
    'page_hits_post_cache': Counter(_STATS_PREFIX + 'page_hits_post_cache', 'Hits on page , post-cache', ['page', 'language']),

    # Results
    'results_npa': Counter(_STATS_PREFIX + 'results_npa', 'Results displayed for NPA', ['npa', 'name']),
    'results_municipality': Counter(_STATS_PREFIX + 'results_municipality', 'Results displayed for municipality', ['id', 'name']),
    'results_district': Counter(_STATS_PREFIX + 'results_district', 'Results displayed for district', ['id', 'name']),
    'results_canton': Counter(_STATS_PREFIX + 'results_canton', 'Results displayed for canton', ['code', 'name']),

    # Results quantity average
    'results_avg_npa': Summary(_STATS_PREFIX + 'results_avg_npa', 'Average number of results displayed for NPA', ['npa', 'name']),
    'results_avg_municipality': Summary(_STATS_PREFIX + 'results_avg_municipality', 'Average number of results displayed for municipality', ['id', 'name']),
    'results_avg_district': Summary(_STATS_PREFIX + 'results_avg_district', 'Average number of results displayed for district', ['id', 'name']),
    'results_avg_canton': Summary(_STATS_PREFIX + 'results_avg_canton', 'Average number of results displayed for canton', ['code', 'name']),

    # Caching of businesses
    'businesses_cache_hits': Counter(_STATS_PREFIX + 'businesses_cache_hits', 'Hits on businesses cache'),
    'businesses_cache_misses': Counter(_STATS_PREFIX + 'businesses_cache_misses', 'Misses on businesses cache'),

}
