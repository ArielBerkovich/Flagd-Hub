package org.flagd.hub.config.server;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.log4j.Log4j2;
import org.flagd.hub.config.server.repositories.FeatureFlagEntity;
import org.flagd.hub.config.server.repositories.FeatureFlagRepository;
import org.flagd.hub.rest.model.FeatureFlag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Log4j2
@SpringBootApplication
public class Application {

	@Autowired
	private FeatureFlagRepository featureFlagRepository;

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@PostConstruct
	private void initFlags() {
		List<FeatureFlag> featureFlags = loadFeatureFlags("/home/feature-flags.json");
		if (featureFlags != null) {
			saveNewFlags(featureFlags);
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
