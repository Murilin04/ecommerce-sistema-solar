package com.course.projetoweb.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.course.projetoweb.entities.Product;
import com.course.projetoweb.repositories.ProductRepository;
import com.course.projetoweb.services.exceptions.ProductNotFoundException;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Criar produto
    @Transactional
    public Product create(Product product) {
        // Validar se código da categoria já existe
        if (productRepository.existsByCodigoCategoria(product.getCodigoCategoria())) {
            throw new IllegalArgumentException("Código da categoria já existe: " + product.getCodigoCategoria());
        }

        // Atualizar disponibilidade baseado no estoque
        updateDisponibilidade(product);

        return productRepository.save(product);
    }

    // Buscar todos os produtos ativos
    @Transactional(readOnly = true)
    public List<Product> findAllActive() {
        return productRepository.findByAtivoTrue();
    }

    // Buscar produto por ID
    @Transactional(readOnly = true)
    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Produto não encontrado com ID: " + id));
    }

    // Atualizar produto
    @Transactional
    public Product update(Long id, Product productDetails) {
        Product product = findById(id);

        // Validar código da categoria se foi alterado
        if (!product.getCodigoCategoria().equals(productDetails.getCodigoCategoria())) {
            if (productRepository.existsByCodigoCategoria(productDetails.getCodigoCategoria())) {
                throw new IllegalArgumentException("Código da categoria já existe: " + productDetails.getCodigoCategoria());
            }
        }

        // Atualizar campos
        product.setNome(productDetails.getNome());
        product.setDescricao(productDetails.getDescricao());
        product.setCategoria(productDetails.getCategoria());
        product.setSubcategoria(productDetails.getSubcategoria());
        product.setMarca(productDetails.getMarca());
        product.setTipo(productDetails.getTipo());
        product.setCodigoCategoria(productDetails.getCodigoCategoria());
        product.setPreco(productDetails.getPreco());
        product.setImagem(productDetails.getImagem());
        product.setImagensAdicionais(productDetails.getImagensAdicionais());
        product.setEstoque(productDetails.getEstoque());
        product.setAvaliacoes(productDetails.getAvaliacoes());
        product.setEmDestaque(productDetails.getEmDestaque());

        // Atualizar disponibilidade
        updateDisponibilidade(product);

        return productRepository.save(product);
    }

    // Excluir produto (soft delete)
    @Transactional
    public void delete(Long id) {
        Product product = findById(id);
        product.setAtivo(false);
        product.setDisponibilidade("Indisponível");
        productRepository.save(product);
    }

    // Excluir permanentemente (hard delete)
    @Transactional
    public void deleteForever(Long id) {
        Product product = findById(id);
        productRepository.delete(product);
    }

    // Restaurar produto
    @Transactional
    public Product restore(Long id) {
        Product product = findById(id);
        product.setAtivo(true);
        updateDisponibilidade(product);
        return productRepository.save(product);
    }

    // Buscar produtos em destaque
    @Transactional(readOnly = true)
    public List<Product> findFeatured() {
        return productRepository.findByEmDestaqueTrue();
    }

    // Buscar por categoria
    @Transactional(readOnly = true)
    public List<Product> findByCategory(String categoria) {
        return productRepository.findByCategoriaAndAtivoTrue(categoria);
    }

    // Buscar por marca
    @Transactional(readOnly = true)
    public List<Product> findByBrand(String marca) {
        return productRepository.findByMarcaAndAtivoTrue(marca);
    }

    // Buscar com filtros
    @Transactional(readOnly = true)
    public List<Product> findByFilters(String categoria, String subcategoria, String marca, String tipo) {
        return productRepository.findByFilters(categoria, subcategoria, marca, tipo);
    }

    // Busca por termo
    @Transactional(readOnly = true)
    public List<Product> search(String termo) {
        return productRepository.searchByTerm(termo);
    }

    // Buscar com paginação
    @Transactional(readOnly = true)
    public Page<Product> findAllPaginated(Pageable pageable) {
        return productRepository.findByAtivoTrue(pageable);
    }

    // Atualizar estoque
    @Transactional
    public Product updateStock(Long id, Integer quantidade) {
        Product product = findById(id);
        product.setEstoque(quantidade);
        updateDisponibilidade(product);
        return productRepository.save(product);
    }

    // Decrementar estoque (para vendas)
    @Transactional
    public Product decrementStock(Long id, Integer quantidade) {
        Product product = findById(id);
        
        if (product.getEstoque() < quantidade) {
            throw new IllegalArgumentException("Estoque insuficiente para o produto: " + product.getNome());
        }
        
        product.setEstoque(product.getEstoque() - quantidade);
        updateDisponibilidade(product);
        return productRepository.save(product);
    }

    // Buscar produtos com estoque baixo
    @Transactional(readOnly = true)
    public List<Product> findLowStock(Integer estoqueMinimo) {
        return productRepository.findByEstoqueLessThanAndAtivoTrue(estoqueMinimo);
    }

    // Obter categorias únicas
    @Transactional(readOnly = true)
    public List<String> getCategories() {
        return productRepository.findDistinctCategorias();
    }

    // Obter marcas únicas
    @Transactional(readOnly = true)
    public List<String> getBrands() {
        return productRepository.findDistinctMarcas();
    }

    // Obter tipos únicos
    @Transactional(readOnly = true)
    public List<String> getTypes() {
        return productRepository.findDistinctTipos();
    }

    // Método auxiliar para atualizar disponibilidade
    private void updateDisponibilidade(Product product) {
        if (product.getEstoque() == null || product.getEstoque() == 0) {
            product.setDisponibilidade("Indisponível");
        } else if (product.getEstoque() <= 10) {
            product.setDisponibilidade("Últimas unidades");
        } else {
            product.setDisponibilidade("Disponível");
        }
    }
}