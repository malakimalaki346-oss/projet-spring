package com.example.mini_projet.services;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface BaseService<T, ID, RQ, RS> {
    RS create(RQ requestDTO);
    RS update(ID id, RQ requestDTO);
    RS findById(ID id);
    List<RS> findAll();
    Page<RS> findAll(Pageable pageable);
    void delete(ID id);
}