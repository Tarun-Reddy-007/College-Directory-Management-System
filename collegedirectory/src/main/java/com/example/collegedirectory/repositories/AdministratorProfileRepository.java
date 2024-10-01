package com.example.collegedirectory.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.collegedirectory.entities.AdministratorProfile;

public interface AdministratorProfileRepository extends JpaRepository<AdministratorProfile, Long> {
}
