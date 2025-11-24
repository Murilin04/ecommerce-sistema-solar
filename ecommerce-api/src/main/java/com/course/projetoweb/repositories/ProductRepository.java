package com.course.projetoweb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.course.projetoweb.entities.Product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Buscar produtos ativos
    List<Product> findByAtivoTrue();

    // Buscar produtos em destaque
    List<Product> findByEmDestaqueTrue();

    // Buscar produtos por categoria
    List<Product> findByCategoriaAndAtivoTrue(String categoria);

    // Buscar produtos por marca
    List<Product> findByMarcaAndAtivoTrue(String marca);

    // Buscar produtos por código da categoria
    Optional<Product> findByCodigoCategoria(String codigoCategoria);

    // Verificar se código da categoria já existe
    boolean existsByCodigoCategoria(String codigoCategoria);

    // Busca com filtros combinados
    @Query("SELECT p FROM Product p WHERE " +
           "(:categoria IS NULL OR p.categoria = :categoria) AND " +
           "(:subcategoria IS NULL OR p.subcategoria = :subcategoria) AND " +
           "(:marca IS NULL OR p.marca = :marca) AND " +
           "(:tipo IS NULL OR p.tipo = :tipo) AND " +
           "p.ativo = true")
    List<Product> findByFilters(
        @Param("categoria") String categoria,
        @Param("subcategoria") String subcategoria,
        @Param("marca") String marca,
        @Param("tipo") String tipo
    );

    // Busca global por termo (nome, descrição, categoria, marca, código)
    @Query("SELECT p FROM Product p WHERE " +
           "p.ativo = true AND (" +
           "LOWER(p.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(p.descricao) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(p.categoria) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(p.marca) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(p.tipo) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(p.codigoCategoria) LIKE LOWER(CONCAT('%', :termo, '%')))")
    List<Product> searchByTerm(@Param("termo") String termo);

    // Busca com paginação
    Page<Product> findByAtivoTrue(Pageable pageable);

    // Buscar produtos com estoque baixo
    List<Product> findByEstoqueLessThanAndAtivoTrue(Integer estoqueMinimo);

    // Categorias únicas
    @Query("SELECT DISTINCT p.categoria FROM Product p WHERE p.ativo = true ORDER BY p.categoria")
    List<String> findDistinctCategorias();

    // Marcas únicas
    @Query("SELECT DISTINCT p.marca FROM Product p WHERE p.ativo = true AND p.marca IS NOT NULL ORDER BY p.marca")
    List<String> findDistinctMarcas();

    // Tipos únicos
    @Query("SELECT DISTINCT p.tipo FROM Product p WHERE p.ativo = true AND p.tipo IS NOT NULL ORDER BY p.tipo")
    List<String> findDistinctTipos();
}