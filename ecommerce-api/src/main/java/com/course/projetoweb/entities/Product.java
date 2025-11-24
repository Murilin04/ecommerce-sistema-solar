package com.course.projetoweb.entities;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "products")
public class Product implements Serializable{
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 255, message = "Nome deve ter no máximo 255 caracteres")
    @Column(nullable = false)
    private String nome;

    @NotBlank(message = "Descrição é obrigatória")
    @Column(columnDefinition = "TEXT")
    private String descricao;

    @NotBlank(message = "Categoria é obrigatória")
    @Size(max = 100)
    @Column(nullable = false)
    private String categoria;

    @Size(max = 100)
    private String subcategoria;

    @Size(max = 100)
    private String marca;

    @Size(max = 100)
    private String tipo;

    @NotBlank(message = "Código da categoria é obrigatório")
    @Size(max = 50)
    @Column(name = "codigo_categoria", unique = true, nullable = false)
    private String codigoCategoria;

    @NotNull(message = "Preço é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false, message = "Preço deve ser maior que zero")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @NotBlank(message = "Imagem principal é obrigatória")
    @Column(nullable = false)
    private String imagem;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> imagensAdicionais = new ArrayList<>();

    @NotNull(message = "Estoque é obrigatório")
    @Min(value = 0, message = "Estoque não pode ser negativo")
    @Column(nullable = false)
    private Integer estoque = 0;

    @Size(max = 50)
    @Column(nullable = false)
    private String disponibilidade = "Disponível";

    @Min(value = 0)
    @Max(value = 5)
    private Integer avaliacoes = 0;

    @Column(name = "em_destaque", nullable = false)
    private Boolean emDestaque = false;

    @Column(nullable = false)
    private Boolean ativo = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "product")
    @JsonIgnore
    private Set<OrderItem> items = new HashSet<>();

    public Product() {
    
    }

    public Product(Long id,
            @NotBlank(message = "Nome é obrigatório") @Size(max = 255, message = "Nome deve ter no máximo 255 caracteres") String nome,
            @NotBlank(message = "Descrição é obrigatória") String descricao, @Size(max = 100) String subcategoria,
            @Size(max = 100) String marca, @Size(max = 100) String tipo,
            @NotBlank(message = "Código da categoria é obrigatório") @Size(max = 50) String codigoCategoria,
            @NotNull(message = "Preço é obrigatório") @DecimalMin(value = "0.0", inclusive = false, message = "Preço deve ser maior que zero") BigDecimal preco,
            @NotBlank(message = "Imagem principal é obrigatória") String imagem, List<String> imagensAdicionais,
            @NotNull(message = "Estoque é obrigatório") @Min(value = 0, message = "Estoque não pode ser negativo") Integer estoque,
            @Size(max = 50) String disponibilidade, @Min(0) @Max(5) Integer avaliacoes, Boolean emDestaque,
            Boolean ativo, LocalDateTime createdAt, LocalDateTime updatedAt,
            @NotBlank(message = "Categoria é obrigatória") @Size(max = 100) String categoria,
            Set<OrderItem> items) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.subcategoria = subcategoria;
        this.marca = marca;
        this.tipo = tipo;
        this.codigoCategoria = codigoCategoria;
        this.preco = preco;
        this.imagem = imagem;
        this.imagensAdicionais = imagensAdicionais;
        this.estoque = estoque;
        this.disponibilidade = disponibilidade;
        this.avaliacoes = avaliacoes; 
        this.emDestaque = emDestaque;
        this.ativo = ativo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.categoria = categoria;
        this.items = items;
    }

    public Product(Product body) {
        //TODO Auto-generated constructor stub
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getSubcategoria() {
        return subcategoria;
    }

    public void setSubcategoria(String subcategoria) {
        this.subcategoria = subcategoria;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getCodigoCategoria() {
        return codigoCategoria;
    }

    public void setCodigoCategoria(String codigoCategoria) {
        this.codigoCategoria = codigoCategoria;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public String getImagem() {
        return imagem;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

    public List<String> getImagensAdicionais() {
        return imagensAdicionais;
    }

    public void setImagensAdicionais(List<String> imagensAdicionais) {
        this.imagensAdicionais = imagensAdicionais;
    }

    public Integer getEstoque() {
        return estoque;
    }

    public void setEstoque(Integer estoque) {
        this.estoque = estoque;
    }

    public String getDisponibilidade() {
        return disponibilidade;
    }

    public void setDisponibilidade(String disponibilidade) {
        this.disponibilidade = disponibilidade;
    }

    public Integer getAvaliacoes() {
        return avaliacoes;
    }

    public void setAvaliacoes(Integer avaliacoes) {
        this.avaliacoes = avaliacoes;
    }

    public Boolean getEmDestaque() {
        return emDestaque;
    }

    public void setEmDestaque(Boolean emDestaque) {
        this.emDestaque = emDestaque;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @JsonIgnore
    public Set<Order> getOrders() {
        Set<Order> set = new HashSet<>();
        for (OrderItem x : items) {
            set.add(x.getOrder());
        }
        return set;
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", categoria='" + categoria + '\'' +
                ", preco=" + preco +
                ", estoque=" + estoque +
                '}';
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Product other = (Product) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        return true;
    }

}
