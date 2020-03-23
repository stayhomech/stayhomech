package ch.stayhome.integrations.localhero.model;

import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

import javax.validation.constraints.NotNull;

@Data
@Builder
public class StayHomeEntry {
    @NotNull
    @NonNull
    private String id;

    @NotNull
    @NonNull
    private String name;

    @NotNull
    @NonNull
    private String description;

    @NotNull
    @NonNull
    private String website;

    @NotNull
    @NonNull
    private String providerName;
}
