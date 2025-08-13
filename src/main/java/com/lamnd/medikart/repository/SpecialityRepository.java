package com.lamnd.medikart.repository;

import com.lamnd.medikart.entity.Speciality;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpecialityRepository extends MongoRepository<Speciality, String> {
}
