package org.spearal.samples.springangular.config;

import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class PersonWebAppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

	@Override
	protected Class<?>[] getRootConfigClasses() {
		return null;
	}
	
	@Override
	protected Class<?>[] getServletConfigClasses() {
		return new Class[] { PersonJpaConfig.class, PersonWebConfig.class };
	}
	
    @Override
    protected String[] getServletMappings() {
        return new String[] { "/resources/*" };
    }

}