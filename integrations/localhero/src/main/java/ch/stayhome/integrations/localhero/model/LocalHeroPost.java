package ch.stayhome.integrations.localhero.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

import javax.validation.constraints.NotNull;

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

    public class RenderedContent {
        @Getter
        @Setter
        private String rendered;
    }
}
