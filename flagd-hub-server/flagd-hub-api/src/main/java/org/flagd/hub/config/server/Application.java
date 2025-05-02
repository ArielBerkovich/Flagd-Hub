package org.flagd.hub.config.server;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.flagd.hub.config.server.repositories.featureflags.FeatureFlagEntity;
import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.repository.CrudRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@SpringBootApplication
public class Application {

	private static final Logger log = LoggerFactory.getLogger(Application.class);

	@Autowired
	private CrudRepository<FeatureFlagEntity,String> featureFlagRepository;

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@PostConstruct
	private void initFlags() {
		String filePath = System.getProperty("feature.flags.path", "./feature-flags.json");
		List<FeatureFlag> featureFlags = loadFeatureFlags(filePath);
		if (featureFlags != null) {
			saveNewFlags(featureFlags);
		} else {
			log.warn("No feature flags loaded from {}", filePath);
		}
	}

	private List<FeatureFlag> loadFeatureFlags(String filePath) {
		try {
			byte[] bytes = Files.readAllBytes(Paths.get(filePath));  // Read the file as bytes
			ObjectMapper objectMapper = new ObjectMapper();
			return objectMapper.readValue(bytes, new TypeReference<List<FeatureFlag>>() {});
		} catch (IOException e) {
			log.error("Error reading feature flags from {}: {}", filePath, e.getMessage());
			return null;
		}
	}

	private void saveNewFlags(List<FeatureFlag> featureFlags) {
		featureFlags.forEach(flag -> {
			if (!featureFlagRepository.existsById(flag.getKey())) {
				featureFlagRepository.save(new FeatureFlagEntity(flag.getKey(), flag));
				log.info("Saved new flag: {}", flag);
			} else {
				log.info("Flag {} already exists, skipping flag initialization", flag.getKey());
			}
		});
	}
}
