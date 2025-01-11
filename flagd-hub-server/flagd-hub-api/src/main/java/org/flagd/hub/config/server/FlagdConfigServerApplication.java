package org.flagd.hub.config.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
public class FlagdConfigServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(FlagdConfigServerApplication.class, args);
	}

}
