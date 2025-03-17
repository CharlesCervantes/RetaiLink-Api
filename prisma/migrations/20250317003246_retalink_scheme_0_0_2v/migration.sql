-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('usuario', 'promotor', 'administrador', 'super_administrador');

-- CreateEnum
CREATE TYPE "estados_podido" AS ENUM ('pendiente', 'aceptado', 'validado', 'completado');

-- CreateTable
CREATE TABLE "promotores" (
    "id_promotor" BIGSERIAL NOT NULL,
    "vc_contrasena" TEXT NOT NULL,
    "vc_telefono" TEXT NOT NULL,
    "vc_correo" TEXT NOT NULL,
    "i_registro" INTEGER NOT NULL,
    "i_actualizacion" INTEGER NOT NULL,
    "e_rol" "Roles" NOT NULL DEFAULT 'promotor',

    CONSTRAINT "promotores_pkey" PRIMARY KEY ("id_promotor")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" BIGSERIAL NOT NULL,
    "vc_nombre" TEXT NOT NULL,
    "vc_apellido_paterno" TEXT NOT NULL,
    "vc_apellido_materno" TEXT NOT NULL,
    "vc_contrasena" TEXT NOT NULL,
    "vc_telefono" TEXT NOT NULL,
    "i_registro" INTEGER NOT NULL,
    "i_actualizacion" INTEGER NOT NULL,
    "e_rol" "Roles" NOT NULL DEFAULT 'administrador',
    "id_cliente" BIGINT,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "perfiles_promotor" (
    "id_perfil_promotor" BIGSERIAL NOT NULL,
    "id_promotor" BIGINT NOT NULL,
    "vc_nombre" TEXT NOT NULL,
    "vc_apellido_paterno" TEXT NOT NULL,
    "vc_apellido_materno" TEXT NOT NULL,
    "vc_telefono" TEXT NOT NULL,
    "vc_correo" TEXT NOT NULL,
    "i_registro" INTEGER NOT NULL,
    "i_actualizacion" INTEGER NOT NULL,

    CONSTRAINT "perfiles_promotor_pkey" PRIMARY KEY ("id_perfil_promotor")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id_cliente" BIGSERIAL NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "marcas" (
    "id_marca" BIGSERIAL NOT NULL,
    "vc_nombre" TEXT NOT NULL,
    "i_registro" INTEGER NOT NULL,
    "i_actualizacion" INTEGER NOT NULL,
    "id_cliente" BIGINT NOT NULL,

    CONSTRAINT "marcas_pkey" PRIMARY KEY ("id_marca")
);

-- CreateTable
CREATE TABLE "establecimientos" (
    "id_establecimiento" BIGSERIAL NOT NULL,
    "id_direccion" BIGINT NOT NULL,
    "id_localizacion" BIGINT NOT NULL,
    "vc_direccion" TEXT NOT NULL,
    "vc_telefono" TEXT NOT NULL,
    "i_registro" INTEGER NOT NULL,
    "i_actualizacion" BIGINT NOT NULL,

    CONSTRAINT "establecimientos_pkey" PRIMARY KEY ("id_establecimiento")
);

-- CreateTable
CREATE TABLE "paises" (
    "id_pais" BIGSERIAL NOT NULL,
    "vc_nombre" TEXT NOT NULL,
    "i_registro" INTEGER NOT NULL,
    "i_actualizacion" INTEGER NOT NULL,
    "i_codigo_postal" INTEGER NOT NULL,

    CONSTRAINT "paises_pkey" PRIMARY KEY ("id_pais")
);

-- CreateTable
CREATE TABLE "estados" (
    "id_estado" BIGSERIAL NOT NULL,
    "id_pais" BIGINT NOT NULL,
    "vc_nombre" TEXT NOT NULL,
    "i_registro" INTEGER NOT NULL,
    "i_actualizacion" INTEGER NOT NULL,
    "i_codigo_postal" INTEGER NOT NULL,

    CONSTRAINT "estados_pkey" PRIMARY KEY ("id_estado")
);

-- CreateTable
CREATE TABLE "municipios" (
    "id_municipio" BIGSERIAL NOT NULL,
    "id_estado" BIGINT NOT NULL,
    "vc_nombre" TEXT NOT NULL,
    "i_registro" INTEGER NOT NULL,
    "i_actualizacion" INTEGER NOT NULL,
    "i_codigo_postal" INTEGER NOT NULL,

    CONSTRAINT "municipios_pkey" PRIMARY KEY ("id_municipio")
);

-- CreateTable
CREATE TABLE "colonias" (
    "id_colonia" BIGSERIAL NOT NULL,
    "id_municipio" BIGINT NOT NULL,
    "vc_nombre" TEXT NOT NULL,
    "i_registro" INTEGER NOT NULL,
    "i_actualizacion" INTEGER NOT NULL,
    "i_codigo_postal" INTEGER NOT NULL,

    CONSTRAINT "colonias_pkey" PRIMARY KEY ("id_colonia")
);

-- CreateTable
CREATE TABLE "direcciones" (
    "id_direccion" BIGSERIAL NOT NULL,
    "id_pais" BIGINT NOT NULL,
    "id_estado" BIGINT NOT NULL,
    "id_municipio" BIGINT NOT NULL,
    "id_colonia" BIGINT NOT NULL,
    "vc_calle" TEXT NOT NULL,
    "vc_numero_exterior" TEXT NOT NULL,
    "vc_numero_interior" TEXT NOT NULL,
    "vc_codigo_postal" TEXT NOT NULL,
    "i_registro" INTEGER NOT NULL,
    "i_actualizacion" INTEGER NOT NULL,

    CONSTRAINT "direcciones_pkey" PRIMARY KEY ("id_direccion")
);

-- CreateTable
CREATE TABLE "localizaciones" (
    "id_localizacion" BIGSERIAL NOT NULL,
    "f_latitud" DECIMAL(65,30) NOT NULL,
    "f_longitud" DECIMAL(65,30) NOT NULL,
    "i_registro" INTEGER NOT NULL,
    "i_actualizacion" INTEGER NOT NULL,

    CONSTRAINT "localizaciones_pkey" PRIMARY KEY ("id_localizacion")
);

-- CreateTable
CREATE TABLE "pedido" (
    "id_pedido" BIGSERIAL NOT NULL,
    "id_establecimiento" BIGINT NOT NULL,
    "id_promotor" BIGINT NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "i_entrega" INTEGER NOT NULL,
    "i_total" INTEGER NOT NULL,
    "i_registro" INTEGER NOT NULL,
    "i_actualizacion" INTEGER NOT NULL,

    CONSTRAINT "pedido_pkey" PRIMARY KEY ("id_pedido")
);

-- CreateTable
CREATE TABLE "log" (
    "id_log" BIGSERIAL NOT NULL,
    "nombre_tabla" TEXT NOT NULL,
    "id_registro" BIGINT NOT NULL,
    "campos" TEXT NOT NULL,
    "valores" TEXT NOT NULL,
    "vc_accion" TEXT NOT NULL,
    "i_registro" INTEGER NOT NULL,

    CONSTRAINT "log_pkey" PRIMARY KEY ("id_log")
);

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_promotor_id_promotor_key" ON "perfiles_promotor"("id_promotor");

-- CreateIndex
CREATE UNIQUE INDEX "establecimientos_id_direccion_key" ON "establecimientos"("id_direccion");

-- CreateIndex
CREATE UNIQUE INDEX "establecimientos_id_localizacion_key" ON "establecimientos"("id_localizacion");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfiles_promotor" ADD CONSTRAINT "perfiles_promotor_id_promotor_fkey" FOREIGN KEY ("id_promotor") REFERENCES "promotores"("id_promotor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marcas" ADD CONSTRAINT "marcas_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establecimientos" ADD CONSTRAINT "establecimientos_id_direccion_fkey" FOREIGN KEY ("id_direccion") REFERENCES "direcciones"("id_direccion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establecimientos" ADD CONSTRAINT "establecimientos_id_localizacion_fkey" FOREIGN KEY ("id_localizacion") REFERENCES "localizaciones"("id_localizacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estados" ADD CONSTRAINT "estados_id_pais_fkey" FOREIGN KEY ("id_pais") REFERENCES "paises"("id_pais") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "municipios" ADD CONSTRAINT "municipios_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "estados"("id_estado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colonias" ADD CONSTRAINT "colonias_id_municipio_fkey" FOREIGN KEY ("id_municipio") REFERENCES "municipios"("id_municipio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "direcciones_id_pais_fkey" FOREIGN KEY ("id_pais") REFERENCES "paises"("id_pais") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "direcciones_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "estados"("id_estado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "direcciones_id_municipio_fkey" FOREIGN KEY ("id_municipio") REFERENCES "municipios"("id_municipio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "direcciones_id_colonia_fkey" FOREIGN KEY ("id_colonia") REFERENCES "colonias"("id_colonia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_id_establecimiento_fkey" FOREIGN KEY ("id_establecimiento") REFERENCES "establecimientos"("id_establecimiento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_id_promotor_fkey" FOREIGN KEY ("id_promotor") REFERENCES "promotores"("id_promotor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
