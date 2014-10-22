package org.spearal.samples.springangular.rest;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.spearal.samples.springangular.data.Person;
import org.spearal.samples.springangular.pagination.PaginatedListWrapper;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Service to expose the data to display in the UI grid.
 *
 * @author Roberto Cortez
 * @author William Draï
 */
@RestController
@Transactional
public class PersonResource {
    
	@PersistenceContext
    private EntityManager entityManager;
	
    private Integer countPersons() {
        Query query = entityManager.createQuery("SELECT COUNT(p.id) FROM Person p");
        return ((Long) query.getSingleResult()).intValue();
    }

    @SuppressWarnings("unchecked")
    private List<Person> findPersons(int startPosition, int maxResults, String sortFields, String sortDirections) {
        Query query = entityManager.createQuery("SELECT p FROM Person p ORDER BY " + sortFields + " " + sortDirections);
        query.setFirstResult(startPosition);
        query.setMaxResults(maxResults);
        return query.getResultList();
    }

    private PaginatedListWrapper<Person> findPersons(PaginatedListWrapper<Person> wrapper) {
        wrapper.setTotalResults(countPersons());
        int start = (wrapper.getCurrentPage() - 1) * wrapper.getPageSize();
        wrapper.setList(findPersons(start,
                                    wrapper.getPageSize(),
                                    wrapper.getSortFields(),
                                    wrapper.getSortDirections()));
        return wrapper;
    }

    @RequestMapping(method=RequestMethod.GET, value="/persons")
    public PaginatedListWrapper<Person> listPersons(@RequestParam(value="page", defaultValue="1") Integer page,
													@RequestParam(value="pageSize", defaultValue="10") Integer pageSize,
    												@RequestParam(value="sortFields", defaultValue="id") String sortFields,
    												@RequestParam(value="sortDirections", defaultValue="asc") String sortDirections) {
        PaginatedListWrapper<Person> paginatedListWrapper = new PaginatedListWrapper<>();
        paginatedListWrapper.setCurrentPage(page);
        paginatedListWrapper.setSortFields(sortFields);
        paginatedListWrapper.setSortDirections(sortDirections);
        paginatedListWrapper.setPageSize(pageSize);
        return findPersons(paginatedListWrapper);
    }

    @RequestMapping(method=RequestMethod.GET, value="/persons/{id}")
    public Person getPerson(@PathVariable Long id) {
        return entityManager.find(Person.class, id);
    }
    
    @RequestMapping(method=RequestMethod.POST, value="/persons")
    public Person savePerson(@RequestBody Person person) {
        if (person.getId() == null) {
            Person personToSave = new Person();
            personToSave.setName(person.getName());
            personToSave.setDescription(person.getDescription());
            personToSave.setImageUrl(person.getImageUrl());
            entityManager.persist(person);
        } else {
            Person personToUpdate = getPerson(person.getId());
            personToUpdate.setName(person.getName());
            personToUpdate.setDescription(person.getDescription());
            personToUpdate.setImageUrl(person.getImageUrl());
            person = entityManager.merge(personToUpdate);
        }

        return person;
    }
    
    @RequestMapping(method=RequestMethod.DELETE, value="/persons/{id}")
    public void deletePerson(@PathVariable Long id) {
        entityManager.remove(getPerson(id));
    }
}
