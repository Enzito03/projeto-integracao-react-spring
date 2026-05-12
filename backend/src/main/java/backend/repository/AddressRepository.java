package backend.repository;

import backend.model.Address;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository
        extends JpaRepository<Address, String> {

    List<Address> findByCidade(String cidade);

}