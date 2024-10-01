package com.example.collegedirectory.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.collegedirectory.entities.Role;
import com.example.collegedirectory.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    List<User> findAllByRole(Role role);
    List<User> findByIdIn(List<Long> studentIds);
}
