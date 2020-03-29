package ch.stayhome.integrations.localhero.job;

import java.util.Date;
import java.util.List;

import ch.stayhome.integrations.localhero.config.LocalHeroProperties;
import ch.stayhome.integrations.localhero.infrastructure.feign.LocalHeroChApi;
import ch.stayhome.integrations.localhero.infrastructure.feign.PagedWordPressResultDecoder;
import ch.stayhome.integrations.localhero.model.LocalHeroPost;
import ch.stayhome.integrations.localhero.model.StayHomeEntry;
import feign.Feign;
import feign.Retryer;
import feign.gson.GsonDecoder;
import feign.gson.GsonEncoder;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.job.builder.FlowBuilder;
import org.springframework.batch.core.job.flow.Flow;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.item.ItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.SimpleAsyncTaskExecutor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableBatchProcessing
@EnableScheduling
@Slf4j
public class ImportBatch {
	private final LocalHeroProperties localHeroProperties;
	private final JobBuilderFactory jobBuilderFactory;
	private final StepBuilderFactory stepBuilderFactory;
	private final JobLauncher jobLauncher;

	public ImportBatch(final LocalHeroProperties localHeroProperties, final JobBuilderFactory jobBuilderFactory, final StepBuilderFactory stepBuilderFactory, final JobLauncher jobLauncher) {
		this.localHeroProperties = localHeroProperties;
		this.jobBuilderFactory = jobBuilderFactory;
		this.stepBuilderFactory = stepBuilderFactory;
		this.jobLauncher = jobLauncher;
	}

	@SneakyThrows
	@Scheduled(cron = "${stayhome.integrations.localhero.scrape-cron}")
	public void perform() {
		log.info("Import started at {}", new Date());

		JobParameters params = new JobParametersBuilder()
				.addString("ID", String.valueOf(System.currentTimeMillis()))
				.toJobParameters();

		jobLauncher.run(importLocalHeroJob(), params);
	}

	@Bean
	public Job importLocalHeroJob() {
		return jobBuilderFactory.get("localHeroImportJob")
				.incrementer(new RunIdIncrementer())
				.start(this.parallelFlow())
				.build();
	}

	@Bean
	Step parallelFlow() {
		final List<String> sourceUrls = this.localHeroProperties.getSourceUrls();
		return this.stepBuilderFactory.get("importing-steps")
				.flow(new FlowBuilder<Flow>("importing-flows")
						.split(this.parallelTaskExecutor())
						.add(sourceUrls.stream()
								.map(this::stepFlow)
								.toArray(Flow[]::new))
						.build())
				.build();
	}

	Flow stepFlow(String sourceUrl) {
		return new FlowBuilder<Flow>("flow-" + sourceUrl)
				.start(step(sourceUrl))
				.build();
	}

	Step step(String sourceUrl) {
		final LocalHeroChApi localHeroChApi = this.buildApi(sourceUrl);
		return stepBuilderFactory.get("import-step")
				.<LocalHeroPost, StayHomeEntry>chunk(localHeroProperties.getChunkSize())
				.reader(reader(localHeroChApi))
				.processor(processor(localHeroChApi))
				.writer(writer())
				.build();
	}

	public LocalHeroPostProcessor processor(LocalHeroChApi localHeroChApi) {
		return new LocalHeroPostProcessor(localHeroProperties, localHeroChApi);
	}

	public LocalHeroPostReader reader(LocalHeroChApi localHeroChApi) {
		return new LocalHeroPostReader(localHeroProperties.getPageSize(), localHeroChApi);
	}

	public ItemWriter<StayHomeEntry> writer() {
		return new StayHomeEntryWriter(localHeroProperties);
	}

	public LocalHeroChApi buildApi(String targetUrl) {
		return Feign.builder()
				.decoder(new PagedWordPressResultDecoder(new GsonDecoder()))
				.encoder(new GsonEncoder())
				.retryer(new Retryer.Default())
				.target(LocalHeroChApi.class, targetUrl);
	}

	private SimpleAsyncTaskExecutor parallelTaskExecutor() {
		SimpleAsyncTaskExecutor taskExecutor = new SimpleAsyncTaskExecutor();
		taskExecutor.setConcurrencyLimit(this.localHeroProperties.getParallelThreads());
		taskExecutor.setThreadGroupName("import-grp");
		taskExecutor.setThreadNamePrefix("import-");
		return taskExecutor;
	}

}
