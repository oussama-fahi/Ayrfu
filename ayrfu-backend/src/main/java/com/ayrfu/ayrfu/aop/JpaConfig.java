package com.ayrfu.ayrfu.aop;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing
public class JpaConfig {
    // This empty class enables JPA auditing functionality with @CreatedDate and @LastModifiedDate
}