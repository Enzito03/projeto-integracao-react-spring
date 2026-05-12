package backend.controller;

import backend.model.Address;
import backend.repository.AddressRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/address")
@CrossOrigin("*")
public class AddressController {

    @Autowired
    private AddressRepository repository;

    @GetMapping
    public List<Address> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Address cadastrar(
            @RequestBody Address address) {

        return repository.save(address);
    }

    @PutMapping("/{cep}")
    public Address atualizarEndereco(
            @PathVariable String cep,
            @RequestBody Address novoEndereco) {

        Address endereco =
                repository.findById(cep).orElseThrow();

        endereco.setRua(novoEndereco.getRua());
        endereco.setBairro(novoEndereco.getBairro());
        endereco.setCidade(novoEndereco.getCidade());

        return repository.save(endereco);
    }

    @GetMapping("/cidade/{cidade}")
    public List<Address> buscarPorCidade(
            @PathVariable String cidade) {

        return repository.findByCidade(cidade);
    }

    @GetMapping("/count")
    public Map<String, Long> contarEnderecos() {

        long total = repository.count();

        return Map.of("total", total);
    }
}