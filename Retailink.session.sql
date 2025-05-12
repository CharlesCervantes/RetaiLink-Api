USE test_db;

DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT UNSIGNED,
    vc_nombre VARCHAR(100) NOT NULL,
    vc_username VARCHAR(100) NOT NULL UNIQUE,
    vc_contraseña VARCHAR(255) NOT NULL,
    dt_registro INT UNISUGNED NOT NULL,
    dt_actualizacion INT UNSIGNED DEFAULT 0,
);