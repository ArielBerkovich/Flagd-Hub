package org.flagd.hub.config.server.repositories;

import org.springframework.data.repository.CrudRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public abstract class AbstractInMemoryRepository<T, ID> implements CrudRepository<T, ID> {

    // In-memory store using a HashMap
    protected final Map<ID, T> store = new HashMap<>();

    // Default implementation for save
    public <S extends T> S save(S entity, ID id) {
        store.put(id, entity);
        return entity;
    }

    @Override
    public Optional<T> findById(ID id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public boolean existsById(ID id) {
        return store.containsKey(id);
    }

    @Override
    public Iterable<T> findAll() {
        return store.values();
    }

    @Override
    public Iterable<T> findAllById(Iterable<ID> ids) {
        Map<ID, T> result = new HashMap<>();
        for (ID id : ids) {
            T entity = store.get(id);
            if (entity != null) {
                result.put(id, entity);
            }
        }
        return result.values();
    }

    @Override
    public long count() {
        return store.size();
    }

    @Override
    public void deleteById(ID id) {
        store.remove(id);
    }

    @Override
    public void delete(T entity) {
        store.values().remove(entity);
    }

    @Override
    public void deleteAllById(Iterable<? extends ID> ids) {
        for (ID id : ids) {
            store.remove(id);
        }
    }

    @Override
    public void deleteAll(Iterable<? extends T> entities) {
        for (T entity : entities) {
            store.values().remove(entity);
        }
    }

    @Override
    public void deleteAll() {
        store.clear();
    }
}
