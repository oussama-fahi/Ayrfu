package com.ayrfu.ayrfu;

import com.ayrfu.ayrfu.config.FileStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.EnableAspectJAutoProxy;


@SpringBootApplication
@EnableConfigurationProperties({
		FileStorageProperties.class
})
@EnableAspectJAutoProxy
public class AyrfuApplication {

	public static void main(String[] args) {SpringApplication.run(AyrfuApplication.class, args);	}

}
