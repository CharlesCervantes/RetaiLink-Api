USE railway;

CREATE TABLE negocios(
    id_negocio INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    vc_nombre VARCHAR(60) NOT NULL,
    dt_registro INT(11) UNSIGNED DEFAULT 0,
    dt_actualizacion INT(11) UNSIGNED DEFAULT 0,
    b_estatus BOOLEAN DEFAULT 1
);

CREATE TABLE usuarios(
    id_usuario INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    vc_username VARCHAR(60),
    vc_password VARCHAR(60),
    dt_registro INT(11) UNSIGNED DEFAULT 0,
    dt_actualizacion INT(11) UNSIGNED DEFAULT 0,
    b_estatus BOOLEAN DEFAULT 1
);

CREATE TABLE usuarios_negocios(
    id_usuario_negocio INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    id_usuario INT(11) UNSIGNED NOT NULL,
    id_negocio INT(11) UNSIGNED NOT NULL,
    dt_registro INT(11) UNSIGNED DEFAULT 0,
    dt_actualizacion INT(11) UNSIGNED DEFAULT 0,
    b_estatus BOOLEAN DEFAULT 1
);

CREATE TABLE establecimientos(
    id_establecimiento INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    vc_nombre VARCHAR(60) NOT NULL,
    vc_direccion VARCHAR(250) NOT NULL,
    vc_num_economico VARCHAR(50),
    vc_telefono VARCHAR(15),
    vc_marca VARCHAR(60),
    b_estatus BOOLEAN DEFAULT 1,
    dt_registro INT(11) UNSIGNED DEFAULT 0,
    dt_actualizacion INT(11) UNSIGNED DEFAULT 0
);

CREATE TABLE establecimientos_negocios(
    id_establecimiento_negocio INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    id_establecimiento INT(11) UNSIGNED NOT NULL,
    id_negocio INT(11) UNSIGNED NOT NULL,
    dt_registro INT(11) UNSIGNED DEFAULT 0,
    dt_actualizacion INT(11) UNSIGNED DEFAULT 0,
    b_estatus BOOLEAN DEFAULT 1
);

CREATE TABLE productos(
    id_producto INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    id_negocio INT(11) UNSIGNED NOT NULL,
    vc_nombre VARCHAR(250) NOT NULL,
    vc_descripcion VARCHAR(250),
    vc_image_url VARCHAR(250),
    dt_registro INT(11) DEFAULT 0,
    dt_actualizacion INT(11) DEFAULT 0,
    b_estatus BOOL DEFAULT 1
);

CREATE TABLE preguntas(
    id_pregunta INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    vc_pregunta VARCHAR(250) NOT NULL,
    vc_tipo VARCHAR(60) NOT NULL,
    b_photo BOOLEAN DEFAULT 0,
    b_required BOOLEAN DEFAULT 0,
    b_estatus BOOLEAN DEFAULT 1,
    dt_registro INT(11) UNSIGNED DEFAULT 0,
    dt_actualizacion INT(11) UNSIGNED DEFAULT 0
);

CREATE TABLE tickets(
    id_ticket INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    id_negocio INT(11) UNSIGNED NOT NULL,
    id_usuario INT(11) UNSIGNED NOT NULL,
    id_establecimiento INT(11) UNSIGNED NOT NULL,
    id_promotor INT(11) UNSIGNED NOT NULL,
    vc_estatus_ticket VARCHAR(60) NOT NULL,
    i_precio INT(11)  NOT NULL,
    dt_tiempo_estimado INT(11) UNSIGNED DEFAULT 0,
    b_estatus BOOLEAN DEFAULT 1,
    dt_registro INT(11) UNSIGNED DEFAULT 0,
    dt_actualizacion INT(11) UNSIGNED DEFAULT 0,
    dt_cierre_ticket INT(11) UNSIGNED DEFAULT 0,
    dt_comprobacion_ticket INT(11) UNSIGNED DEFAULT 0
);

CREATE TABLE ticket_productos(
    id_ticket_producto INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    id_ticket INT(11) UNSIGNED NOT NULL,
    id_producto INT(11) UNSIGNED NOT NULL,
    dt_registro INT(11) UNSIGNED DEFAULT 0,
    dt_actualizacion INT(11) UNSIGNED DEFAULT 0,
    b_estatus BOOLEAN DEFAULT 1
);

CREATE TABLE ticket_producto_preguntas(
    id_ticket_producto_pregunta INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    id_ticket INT(11) UNSIGNED NOT NULL,
    id_producto INT(11) UNSIGNED NOT NULL,
    id_pregunta INT(11) UNSIGNED NOT NULL,
    vc_respuesta VARCHAR(250),
    vc_evidencia VARCHAR(250),
    dt_registro INT(11) UNSIGNED DEFAULT 0,
    dt_actualizacion INT(11) UNSIGNED DEFAULT 0,
    b_estatus BOOLEAN DEFAULT 1
);

CREATE TABLE promotores(
    id_promotor INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    vc_username VARCHAR(60),
    vc_password VARCHAR(60),
    b_estatus BOOLEAN DEFAULT 1,
    b_verificado BOOLEAN DEFAULT 0,
    dt_registro INT(11) UNSIGNED DEFAULT 0,
    dt_actualizacion INT(11) UNSIGNED DEFAULT 0,
    dt_ultimo_login INT(11) UNSIGNED DEFAULT 0,
    dt_ultimo_ticket INT(11) UNSIGNED DEFAULT 0
);

CREATE TABLE promotor_detalles(
    id_promotor_detalle INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    id_promotor INT(11) UNSIGNED NOT NULL,
    vc_nombre VARCHAR(60),
    vc_apellido_paterno VARCHAR(60),
    vc_apellido_materno VARCHAR(60),
    vc_telefono VARCHAR(15),
    vc_email VARCHAR(100),
    dt_registro INT(11) UNSIGNED DEFAULT 0,
    dt_actualizacion INT(11) UNSIGNED DEFAULT 0,
    b_estatus BOOLEAN DEFAULT 1
);