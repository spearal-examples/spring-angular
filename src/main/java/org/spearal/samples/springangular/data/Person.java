package org.spearal.samples.springangular.data;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;

/**
 * Simple entity.
 *
 * @author Roberto Cortez
 */
@Entity
public class Person implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "id")
    @SequenceGenerator(name = "id", sequenceName = "id")
    private Long id;

    private String name;

    private String description;

    private String imageUrl;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String link) {
        this.imageUrl = link;
    }
/*    
    @ManyToOne(fetch=FetchType.LAZY)
    private Person bestFriend;
    
    public Person getBestFriend() {
		return bestFriend;
	}

	public void setBestFriend(Person bestFriend) {
		this.bestFriend = bestFriend;
	}
	
	@ManyToOne
	private Person worstEnemy;

	public Person getWorstEnemy() {
		return worstEnemy;
	}

	public void setWorstEnemy(Person worstEnemy) {
		this.worstEnemy = worstEnemy;
	}
*/

    @Override
    public boolean equals(Object o) {
        if (this == o) { return true; }
        if (o == null || getClass() != o.getClass()) { return false; }

        Person person = (Person) o;

        return id.equals(person.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
