package com.course.projetoweb.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.course.projetoweb.entities.Product;
import com.course.projetoweb.services.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // ========== ENDPOINTS PÚBLICOS ==========

    // Listar todos os produtos ativos
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.findAllActive();
        return ResponseEntity.ok(products);
    }

    // Buscar produto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.findById(id);
        return ResponseEntity.ok(product);
    }

    // Buscar produtos em destaque
    @GetMapping("/featured")
    public ResponseEntity<List<Product>> getFeaturedProducts() {
        List<Product> products = productService.findFeatured();
        return ResponseEntity.ok(products);
    }

    // Buscar por categoria
    @GetMapping("/category/{categoria}")
    public ResponseEntity<List<Product>> getByCategory(@PathVariable String categoria) {
        List<Product> products = productService.findByCategory(categoria);
        return ResponseEntity.ok(products);
    }

    // Buscar por marca
    @GetMapping("/brand/{marca}")
    public ResponseEntity<List<Product>> getByBrand(@PathVariable String marca) {
        List<Product> products = productService.findByBrand(marca);
        return ResponseEntity.ok(products);
    }

    // Buscar com filtros
    @GetMapping("/filter")
    public ResponseEntity<List<Product>> filterProducts(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String subcategoria,
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) String tipo
    ) {
        List<Product> products = productService.findByFilters(categoria, subcategoria, marca, tipo);
        return ResponseEntity.ok(products);
    }

    // Buscar por termo
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String q) {
        List<Product> products = productService.search(q);
        return ResponseEntity.ok(products);
    }

    // Buscar com paginação
    @GetMapping("/paginated")
    public ResponseEntity<Map<String, Object>> getProductsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        Page<Product> productPage = productService.findAllPaginated(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("products", productPage.getContent());
        response.put("currentPage", productPage.getNumber());
        response.put("totalItems", productPage.getTotalElements());
        response.put("totalPages", productPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }

    // Obter categorias únicas
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = productService.getCategories();
        return ResponseEntity.ok(categories);
    }

    // Obter marcas únicas
    @GetMapping("/brands")
    public ResponseEntity<List<String>> getBrands() {
        List<String> brands = productService.getBrands();
        return ResponseEntity.ok(brands);
    }

    // Obter tipos únicos
    @GetMapping("/types")
    public ResponseEntity<List<String>> getTypes() {
        List<String> types = productService.getTypes();
        return ResponseEntity.ok(types);
    }

    // ========== ENDPOINTS ADMINISTRATIVOS ==========

    // Criar produto (apenas ADMIN)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        Product createdProduct = productService.create(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    // Atualizar produto (apenas ADMIN)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody Product product
    ) {
        Product updatedProduct = productService.update(id, product);
        return ResponseEntity.ok(updatedProduct);
    }

    // Excluir produto - soft delete (apenas ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Produto desativado com sucesso");
        return ResponseEntity.ok(response);
    }

    // Excluir permanentemente (apenas ADMIN)
    @DeleteMapping("/{id}/permanent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteProductPermanently(@PathVariable Long id) {
        productService.deleteForever(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Produto excluído permanentemente");
        return ResponseEntity.ok(response);
    }

    // Restaurar produto (apenas ADMIN)
    @PatchMapping("/{id}/restore")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> restoreProduct(@PathVariable Long id) {
        Product restoredProduct = productService.restore(id);
        return ResponseEntity.ok(restoredProduct);
    }

    // Atualizar estoque (apenas ADMIN)
    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateStock(
            @PathVariable Long id,
            @RequestParam Integer quantidade
    ) {
        Product updatedProduct = productService.updateStock(id, quantidade);
        return ResponseEntity.ok(updatedProduct);
    }

    // Buscar produtos com estoque baixo (apenas ADMIN)
    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Product>> getLowStockProducts(
            @RequestParam(defaultValue = "10") Integer minStock
    ) {
        List<Product> products = productService.findLowStock(minStock);
        return ResponseEntity.ok(products);
    }
}