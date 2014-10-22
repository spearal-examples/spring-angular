package org.spearal.samples.springangular.config;

import org.spearal.DefaultSpearalFactory;
import org.spearal.SpearalFactory;
import org.spearal.samples.springangular.rest.PersonResource;
import org.spearal.spring.rest.config.EnableSpearalRest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
@EnableWebMvc
@EnableSpearalRest
public class PersonWebConfig extends WebMvcConfigurerAdapter {
	
	@Bean
	public SpearalFactory spearalFactory() {
		return new DefaultSpearalFactory();
	}
	
	@Bean
	public PersonResource personResource() {
		return new PersonResource();
	}

}