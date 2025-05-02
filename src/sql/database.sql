USE test_db;

DROP TABLE tickets;

CREATE TABLE usuarios(
id_usuario INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
vc_username VARCHAR(60),
vc_password VARCHAR(60)
);

CREATE TABLE promotores(
id_promotor INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
vc_username VARCHAR(60),
vc_password VARCHAR(60)
);

CREATE TABLE establecimientos(
 id_establecimineto INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
 vc_nombre varchar(60) NOT NULL,
 vc_direccion VARCHAR(250) NOT NULL,
 vc_num_economico VARCHAR(50),
 vc_telefono varchar(15),
 vc_marca varchar(60)
);

CREATE TABLE tickets(
 id_ticket INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
 id_establecimineto INT(11) UNSIGNED NOT NULL,
 id_usuario INT(11) UNSIGNED NOT NULL,
 id_promotor INT(11) UNSIGNED
);

CREATE TABLE ticket_productos(
 id_ticket_producto INT(11) UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
 id_ticket INT(11) UNSIGNED NOT NULL,
 id_producto INT(11) UNSIGNED NOT NULL,
 vc_respuesta varchar(60),
 vc_evicencia varchar(250)
);