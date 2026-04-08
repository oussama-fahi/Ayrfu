package com.ayrfu.ayrfu.repository;

import com.ayrfu.ayrfu.entity.Client;
import com.ayrfu.ayrfu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Long id);
    Optional<Client> findByUser(User user);
}