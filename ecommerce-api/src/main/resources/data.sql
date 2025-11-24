
-- Script para inserir empresa fictícia na tabela tb_integrador
-- Banco de Dados: PostgreSQL

INSERT INTO tb_integrador (
    cnpj,
    state_registration,
    is_mei,
    company_name,
    trade_name,
    postal_code,
    state,
    city,
    address,
    address_number,
    address_complement,
    neighborhood,
    email,
    phone,
    whatsapp,
    password,
    role
) VALUES (
    '12.347.678/0001-89',
    NULL,
    true,
    'Minha Empresa Ltda',
    'Minha Loja',
    '73751-150',
    'GO',
    'Planaltina',
    'Rua das Flores',
    '100',
    'Sala 10',
    'Setor Norte',
    'barrosmurilo839@gmail.com',
    '(11) 9 1234-5678',
    '(11) 9 1234-5678',
    'Murilin04',
    '0' 
    -- 1 = ADMIN ( 1=USER, 0=ADMIN)
);

-- Verificar se o registro foi inserido
SELECT * FROM tb_integrador WHERE cnpj = '12.347.678/0001-89';
-- =====================================================
-- =====================================================
-- =====================================================
-- SCRIPT DE MIGRAÇÃO DE PRODUTOS PARA POSTGRESQL
-- =====================================================

-- Limpar tabelas se necessário 
-- TRUNCATE TABLE product_images CASCADE;
-- TRUNCATE TABLE products CASCADE;

-- =====================================================
-- PRODUTOS EM DESTAQUE (featured-products)
-- =====================================================

INSERT INTO products (nome, descricao, categoria, subcategoria, marca, tipo, codigo_categoria, preco, imagem, estoque, disponibilidade, avaliacoes, em_destaque, ativo, created_at, updated_at)
VALUES 
-- 1. FRONT BOX AC DE 32A
('FRONT BOX AC DE 32A PARA INVERSORES DE ATÉ 6KW MONO', 
 'Front Box AC de 32A para Inversores de até 6kW Monofásico', 
 'Componentes CA', 
 'Quadro CA', 
 NULL, 
 NULL, 
 'Código: 30521', 
 15000, 
 'https://i.postimg.cc/rdczH3vJ/front-box-32a.png', 
 50, 
 'Disponível', 
 0, 
 true, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP),

-- 2. DISJUNTOR WEG
('DISJUNTOR WEG BIPOLAR 20A, CURVA C, 3kA (380V), DIN', 
 'Disjuntor Bipolar 20A Curva C 3kA DIN WEG', 
 'Componentes CA', 
 NULL, 
 'WEG', 
 NULL, 
 'Código: 31073', 
 2000, 
 'https://i.postimg.cc/McxXLNhb/disjuntor-weg-20a.png', 
 100, 
 'Disponível', 
 0, 
 true, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP),

-- 3. BATERIA DE LÍTIO MUST
('LP16-48100 5.12KWH 51.2V 100A 6.000 CICLOS', 
 'Bateria de Lítio MUST Solar 5.12kWh 51.2V 100A', 
 'Bateria de Lítio', 
 NULL, 
 'Must Solar', 
 NULL, 
 'Código: 41165', 
 20000, 
 'https://i.postimg.cc/v1MDKkpx/bateria-litio-must.png', 
 25, 
 'Disponível', 
 0, 
 true, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP),

-- 4. MICROINVERSOR GROWATT
('NEO2000M-X 2KW 4MPPT MONOFÁSICO 220V', 
 'Microinversor Solar Growatt 2kW 4MPPT 220V', 
 'Inversor Solar', 
 'Microinversor', 
 'Growatt', 
 NULL, 
 'Código: 112096', 
 10000, 
 'https://i.postimg.cc/McDXJtSr/microinversor-growatt.png', 
 40, 
 'Disponível', 
 0, 
 true, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP),

-- 5. GRID ZERO MULTIMARCAS
('GRID ZERO MULTIMARCAS SOLARVIEW MONO BIF. TRIF. COM 3 TCs', 
 'GRID ZERO MULTIMARCAS SOLARVIEW MONO BIF. TRIF. COM 3 TCs', 
 'Grid Zero', 
 'Multimarcas', 
 'SolarView', 
 NULL, 
 'Código: 20145', 
 5000, 
 'https://i.postimg.cc/cKZ6z2VT/grid-zero-multimarcas.png', 
 30, 
 'Disponível', 
 0, 
 true, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP);

-- =====================================================
-- PRODUTOS ON GRID - SUNGROW
-- =====================================================

INSERT INTO products (nome, descricao, categoria, subcategoria, marca, tipo, codigo_categoria, preco, imagem, estoque, disponibilidade, avaliacoes, em_destaque, ativo, created_at, updated_at)
VALUES 
-- Sungrow 1
('GERADOR ON GRID SUNGROW - LAJE INCLINAÇÃO 5.5KW', 
 'Kit completo para geração de energia solar em laje com inclinação', 
 'Gerador de Energia Solar', 
 'On Grid', 
 'Sungrow', 
 'Laje Inclinação', 
 'Código: 10001', 
 8500, 
 'https://i.postimg.cc/R3RqxGmq/sungrow-laje-inclinacao.png', 
 20, 
 'Disponível', 
 0, 
 false, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP),

-- Sungrow 2
('GERADOR ON GRID SUNGROW - SEM ESTRUTURA 8KW', 
 'Kit gerador sem estrutura para instalação personalizada', 
 'Gerador de Energia Solar', 
 'On Grid', 
 'Sungrow', 
 'Sem Estrutura', 
 'Código: 10002', 
 12000, 
 'https://i.postimg.cc/QBbVZSD8/sungrow-sem-estrutura.png', 
 15, 
 'Disponível', 
 0, 
 false, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP),

-- Sungrow 3
('GERADOR ON GRID SUNGROW - SOLO MESA 8 PAINÉIS 10KW', 
 'Sistema completo para instalação no solo com mesa para 8 painéis', 
 'Gerador de Energia Solar', 
 'On Grid', 
 'Sungrow', 
 'Solo Mesa 8 Painéis', 
 'Código: 10003', 
 15000, 
 'https://i.postimg.cc/PL4NnKHq/sungrow-solo-mesa.png', 
 10, 
 'Disponível', 
 0, 
 false, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP),

-- Sungrow 4
('GERADOR ON GRID SUNGROW - TELHADO CERÂMICO 12KW', 
 'Kit completo para telhado cerâmico com ganchos', 
 'Gerador de Energia Solar', 
 'On Grid', 
 'Sungrow', 
 'Telhado Cerâmico', 
 'Código: 10004', 
 18000, 
 'https://i.postimg.cc/HJ2j13mn/sungrow-telhado-ceramico.png', 
 12, 
 'Disponível', 
 0, 
 false, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP);

-- =====================================================
-- PRODUTOS ON GRID - SAJ
-- =====================================================

INSERT INTO products (nome, descricao, categoria, subcategoria, marca, tipo, codigo_categoria, preco, imagem, estoque, disponibilidade, avaliacoes, em_destaque, ativo, created_at, updated_at)
VALUES 
('GERADOR ON GRID SAJ - LAJE INCLINAÇÃO 6KW', 
 'Kit SAJ para laje com inclinação', 
 'Gerador de Energia Solar', 
 'On Grid', 
 'SAJ', 
 'Laje Inclinação', 
 'Código: 10005', 
 9000, 
 'https://i.postimg.cc/cKm6GTW0/saj-laje-inclinacao.png', 
 18, 
 'Disponível', 
 0, 
 false, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP);

-- =====================================================
-- PRODUTOS ON GRID - SOLPLANET
-- =====================================================

INSERT INTO products (nome, descricao, categoria, subcategoria, marca, tipo, codigo_categoria, preco, imagem, estoque, disponibilidade, avaliacoes, em_destaque, ativo, created_at, updated_at)
VALUES 
('GERADOR ON GRID SOLPLANET - TELHADO METÁLICO 7KW', 
 'Sistema Solplanet para telhado metálico com mini trilho', 
 'Gerador de Energia Solar', 
 'On Grid', 
 'Solplanet', 
 'Telhado Metálico Mini Trilho', 
 'Código: 10006', 
 11000, 
 'https://i.postimg.cc/06fr1Zv9/solplanet-telhado-metalico.png', 
 14, 
 'Disponível', 
 0, 
 false, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP);

-- =====================================================
-- PRODUTOS ON GRID - GROWATT
-- =====================================================

INSERT INTO products (nome, descricao, categoria, subcategoria, marca, tipo, codigo_categoria, preco, imagem, estoque, disponibilidade, avaliacoes, em_destaque, ativo, created_at, updated_at)
VALUES 
('GERADOR ON GRID GROWATT - TELHADO FIBRO 9KW', 
 'Kit Growatt para telhado de fibrocimento', 
 'Gerador de Energia Solar', 
 'On Grid', 
 'Growatt', 
 'Telhado Fibro Parafuso Madeira', 
 'Código: 10007', 
 13500, 
 'https://i.postimg.cc/06xr4FLH/growatt-telhado-fibro.png', 
 16, 
 'Disponível', 
 0, 
 false, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP);

-- =====================================================
-- PRODUTOS OFF GRID INTERATIVO - MUST
-- =====================================================

INSERT INTO products (nome, descricao, categoria, subcategoria, marca, tipo, codigo_categoria, preco, imagem, estoque, disponibilidade, avaliacoes, em_destaque, ativo, created_at, updated_at)
VALUES 
('GERADOR OFF GRID MUST - LAJE INCLINAÇÃO 5KW', 
 'Sistema off grid interativo Must para laje', 
 'Gerador de Energia Solar', 
 'Off Grid Interativo', 
 'Must', 
 'Laje Inclinação', 
 'Código: 20001', 
 16000, 
 'https://i.postimg.cc/xkRqVgQV/must-off-grid-laje.png', 
 8, 
 'Disponível', 
 0, 
 false, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP),

('GERADOR OFF GRID MUST - TELHADO CERÂMICO 6KW', 
 'Sistema off grid Must para telhado cerâmico', 
 'Gerador de Energia Solar', 
 'Off Grid Interativo', 
 'Must', 
 'Telhado Cerâmico', 
 'Código: 20002', 
 17500, 
 'https://i.postimg.cc/wtV3YFpP/must-off-grid-ceramico.png', 
 10, 
 'Disponível', 
 0, 
 false, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP);

-- =====================================================
-- PRODUTOS OFF GRID - LUXPOWER
-- =====================================================

INSERT INTO products (nome, descricao, categoria, subcategoria, marca, tipo, codigo_categoria, preco, imagem, estoque, disponibilidade, avaliacoes, em_destaque, ativo, created_at, updated_at)
VALUES 
('GERADOR OFF GRID LUXPOWER - SOLO MESA 8KW', 
 'Sistema Luxpower off grid para instalação no solo', 
 'Gerador de Energia Solar', 
 'Off Grid Interativo', 
 'Luxpower', 
 'Solo Mesa 8 Painéis', 
 'Código: 20003', 
 19000, 
 'https://i.postimg.cc/sBc1CKrk/luxpower-off-grid-solo.png', 
 7, 
 'Disponível', 
 0, 
 false, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP);

-- =====================================================
-- PRODUTOS HÍBRIDO - LUXPOWER
-- =====================================================

INSERT INTO products (nome, descricao, categoria, subcategoria, marca, tipo, codigo_categoria, preco, imagem, estoque, disponibilidade, avaliacoes, em_destaque, ativo, created_at, updated_at)
VALUES 
('GERADOR HÍBRIDO LUXPOWER - LAJE INCLINAÇÃO 10KW', 
 'Sistema híbrido Luxpower para máxima eficiência', 
 'Gerador de Energia Solar', 
 'Hibrido', 
 'Luxpower', 
 'Laje Inclinação', 
 'Código: 30001', 
 22000, 
 'https://i.postimg.cc/SXqjP3ww/luxpower-hibrido-laje.png', 
 5, 
 'Disponível', 
 0, 
 false, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP),

('GERADOR HÍBRIDO LUXPOWER - TELHADO ONDULADO 12KW', 
 'Sistema híbrido para telhado ondulado', 
 'Gerador de Energia Solar', 
 'Hibrido', 
 'Luxpower', 
 'Telhado Ondulado', 
 'Código: 30002', 
 24000, 
 'https://i.postimg.cc/mcwhWVsK/luxpower-hibrido-ondulado.png', 
 6, 
 'Disponível', 
 0, 
 false, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP);

-- =====================================================
-- PRODUTOS RETROFIT - MUST
-- =====================================================

INSERT INTO products (nome, descricao, categoria, subcategoria, marca, tipo, codigo_categoria, preco, imagem, estoque, disponibilidade, avaliacoes, em_destaque, ativo, created_at, updated_at)
VALUES 
('RETROFIT MUST - SEM ESTRUTURA 5KW', 
 'Kit retrofit Must para upgrade de sistema existente', 
 'Gerador de Energia Solar', 
 'Retrofit', 
 'Must', 
 'Sem Estrutura', 
 'Código: 40001', 
 14000, 
 'https://i.postimg.cc/mcwhWVsK/luxpower-hibrido-ondulado.png', 
 12, 
 'Disponível', 
 0, 
 false, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP);

-- =====================================================
-- PRODUTOS RETROFIT - LUXPOWER
-- =====================================================

INSERT INTO products (nome, descricao, categoria, subcategoria, marca, tipo, codigo_categoria, preco, imagem, estoque, disponibilidade, avaliacoes, em_destaque, ativo, created_at, updated_at)
VALUES 
('RETROFIT LUXPOWER - SEM ESTRUTURA 8KW', 
 'Kit retrofit Luxpower para expansão de sistema', 
 'Gerador de Energia Solar', 
 'Retrofit', 
 'Luxpower', 
 'Sem Estrutura', 
 'Código: 40002', 
 16500, 
 'https://i.postimg.cc/WDntcSv5/luxpower-retrofit.png', 
 9, 
 'Disponível', 
 0, 
 false, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP);

-- =====================================================
-- PRODUTOS MICROINVERSOR - GROWATT
-- =====================================================

INSERT INTO products (nome, descricao, categoria, subcategoria, marca, tipo, codigo_categoria, preco, imagem, estoque, disponibilidade, avaliacoes, em_destaque, ativo, created_at, updated_at)
VALUES 
('MICROINVERSOR GROWATT - LAJE INCLINAÇÃO 3KW', 
 'Sistema com microinversor Growatt para laje', 
 'Gerador de Energia Solar', 
 'Microinversor', 
 'Growatt', 
 'Laje Inclinação', 
 'Código: 50001', 
 10500, 
 'https://i.postimg.cc/zL53Q69d/growatt-micro-laje.png', 
 20, 
 'Disponível', 
 0, 
 false, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP),

('MICROINVERSOR GROWATT - TELHADO CERÂMICO 4KW', 
 'Sistema microinversor para telhado cerâmico', 
 'Gerador de Energia Solar', 
 'Microinversor', 
 'Growatt', 
 'Telhado Cerâmico Gancho', 
 'Código: 50002', 
 12000, 
 'https://i.postimg.cc/wtH3rZSf/growatt-micro-ceramico.png', 
 15, 
 'Disponível', 
 0, 
 false, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP);

-- =====================================================
-- PRODUTOS MICROINVERSOR - DEYE
-- =====================================================

INSERT INTO products (nome, descricao, categoria, subcategoria, marca, tipo, codigo_categoria, preco, imagem, estoque, disponibilidade, avaliacoes, em_destaque, ativo, created_at, updated_at)
VALUES 
('MICROINVERSOR DEYE - SEM ESTRUTURA 3.5KW', 
 'Kit microinversor DEYE sem estrutura', 
 'Gerador de Energia Solar', 
 'Microinversor', 
 'DEYE', 
 'Sem Estrutura', 
 'Código: 50003', 
 11000, 
 'https://i.postimg.cc/06xr4FLY/deye-micro-sem-estrutura.png', 
 18, 
 'Disponível', 
 0, 
 false, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP),

('MICROINVERSOR DEYE - TELHADO METÁLICO 5KW', 
 'Sistema DEYE para telhado metálico com mini trilho', 
 'Gerador de Energia Solar', 
 'Microinversor', 
 'DEYE', 
 'Telhado Metálico MiniTrilho', 
 'Código: 50004', 
 13500, 
 'https://i.postimg.cc/nsZMWg6v/deye-micro-metalico.png', 
 13, 
 'Disponível', 
 0, 
 false, 
 true, 
 CURRENT_TIMESTAMP, 
 CURRENT_TIMESTAMP);

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Ver todos os produtos inseridos
SELECT id, nome, categoria, subcategoria, marca, preco, estoque, em_destaque 
FROM products 
ORDER BY id;

-- Contar produtos por categoria
SELECT categoria, COUNT(*) as total 
FROM products 
GROUP BY categoria 
ORDER BY total DESC;

-- Ver produtos em destaque
SELECT nome, preco, estoque 
FROM products 
WHERE em_destaque = true;

-- Total de produtos
SELECT COUNT(*) as total_produtos FROM products;