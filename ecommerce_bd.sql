DROP DATABASE IF EXISTS ecommerce_bd;
CREATE DATABASE IF NOT EXISTS ecommerce_bd;
USE ecommerce_bd;

CREATE TABLE usuarios (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role TINYINT DEFAULT 2,
    estado TINYINT DEFAULT 1,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE categorias(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    estado TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE productos (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
    categoria_id INT NOT NULL,
    precio DOUBLE NOT NULL,
    stock INT NOT NULL,
    estado TINYINT DEFAULT 1,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE imagenes_producto(
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    imagen VARCHAR(255) DEFAULT 'uploads/images/productos/default.png',
    estado TINYINT DEFAULT 1,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE carrito_compras(
	id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT DEFAULT 1,
    estado TINYINT DEFAULT 1,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE ventas(
	id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    lugar_entrega VARCHAR(255) NOT NULL,
    estado TINYINT DEFAULT 1,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (cliente_id) REFERENCES usuarios(id)
);

CREATE TABLE detalle_ventas(
	id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    venta_id INT NOT NULL,
    cantidad INT DEFAULT 1,
    sub_total DOUBLE,
    estado TINYINT DEFAULT 1,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (venta_id) REFERENCES ventas(id)
);

CREATE TABLE cuentas_bancarias(
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_tarjeta VARCHAR(100) NOT NULL,
    fecha_expiracion VARCHAR(10) NOT NULL,
    csv VARCHAR(3) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO usuarios(nombre, email, password, role) VALUES ('admin', 'admin@gmail.com', '$2b$10$UDlaey80wspx9mFmKi66ded7oyktvOE9sRVJD4D7FS.zXzki1NnFS', 1);

INSERT INTO categorias (nombre) VALUES 
('Electrónica'),
('Ropa'),
('Hogar'),
('Deportes'),
('Juguetes');

INSERT INTO productos (nombre, descripcion, categoria_id, precio, stock) VALUES 
('Smartphone X', 'Teléfono inteligente de última generación', 1, 699.99, 50),
('Laptop Pro', 'Portátil de alto rendimiento para profesionales', 1, 1299.99, 30),
('Camiseta Deportiva', 'Camiseta transpirable para actividades físicas', 2, 29.99, 100),
('Sofá 3 plazas', 'Sofá cómodo de tres plazas, ideal para salas de estar', 3, 499.99, 20),
('Bicicleta Montaña', 'Bicicleta para terrenos difíciles', 4, 299.99, 15),
('Muñeco Articulado', 'Juguete ideal para niños mayores de 3 años', 5, 19.99, 200);

INSERT INTO cuentas_bancarias (numero_tarjeta, fecha_expiracion, csv) VALUES 
('4111111111111111', '12/26', '123'),
('5500000000000004', '11/25', '456'),
('340000000000009', '10/27', '789'),
('30000000000004', '09/28', '321'),
('6011000000000004', '08/30', '654');


SELECT * FROM usuarios;