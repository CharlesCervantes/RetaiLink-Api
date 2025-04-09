-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('usuario', 'promotor', 'administrador', 'super_administrador');

-- CreateEnum
CREATE TYPE "estados_podido" AS ENUM ('pendiente', 'aceptado', 'validado', 'completado');

-- CreateTable
CREATE TABLE "promotores" (
    "id_promotor" TEXT NOT NULL,
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
    "id_usuario" TEXT NOT NULL,
    "vc_nombre" TEXT NOT NULL,
    "vc_apellido_paterno" TEXT NOT NULL,
    "vc_apellido_materno" TEXT NOT NULL,
    "vc_correo" TEXT,
    "vc_contrasena" TEXT NOT NULL,
    "vc_telefono" TEXT,
    "dt_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_actualizacion" TIMESTAMP(3) NOT NULL,
    "i_status" BOOLEAN NOT NULL DEFAULT true,
    "e_rol" "Roles" NOT NULL DEFAULT 'administrador',
    "id_cliente" TEXT,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "perfiles_promotor" (
    "id_perfil_promotor" TEXT NOT NULL,
    "id_promotor" TEXT NOT NULL,
    "vc_nombre" TEXT NOT NULL,
    "vc_apellido_paterno" TEXT NOT NULL,
    "vc_apellido_materno" TEXT NOT NULL,
    "vc_telefono" TEXT NOT NULL,
    "vc_correo" TEXT NOT NULL,
    "dt_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_actualizacion" TIMESTAMP(3) NOT NULL,
    "i_status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "perfiles_promotor_pkey" PRIMARY KEY ("id_perfil_promotor")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id_cliente" TEXT NOT NULL,
    "vc_nombre" TEXT NOT NULL,
    "dt_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_actualizacion" TIMESTAMP(3) NOT NULL,
    "b_activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "marcas" (
    "id_marca" TEXT NOT NULL,
    "vc_nombre" TEXT NOT NULL,
    "id_cliente" TEXT NOT NULL,
    "dt_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_actualizacion" TIMESTAMP(3) NOT NULL,
    "b_activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "marcas_pkey" PRIMARY KEY ("id_marca")
);

-- CreateTable
CREATE TABLE "establecimientos" (
    "id_establecimiento" TEXT NOT NULL,
    "vc_nombre" TEXT NOT NULL,
    "vc_numero_serie" TEXT,
    "id_direccion" TEXT NOT NULL,
    "id_localizacion" TEXT NOT NULL,
    "vc_telefono" TEXT NOT NULL,
    "i_registro" INTEGER NOT NULL,
    "i_actualizacion" TEXT NOT NULL,

    CONSTRAINT "establecimientos_pkey" PRIMARY KEY ("id_establecimiento")
);

-- CreateTable
CREATE TABLE "paises" (
    "id_pais" TEXT NOT NULL,
    "vc_nombre" TEXT NOT NULL,
    "vc_nombre_oficial" TEXT,
    "vc_codigo_iso" TEXT NOT NULL,
    "vc_indicativo" TEXT,
    "dt_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_actualizacion" TIMESTAMP(3) NOT NULL,
    "i_codigo_postal" INTEGER,

    CONSTRAINT "paises_pkey" PRIMARY KEY ("id_pais")
);

-- CreateTable
CREATE TABLE "estados" (
    "id_estado" TEXT NOT NULL,
    "id_pais" TEXT NOT NULL,
    "vc_nombre" TEXT NOT NULL,
    "vc_clave" TEXT,
    "dt_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_actualizacion" TIMESTAMP(3) NOT NULL,
    "i_codigo_postal" INTEGER,
    "i_status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "estados_pkey" PRIMARY KEY ("id_estado")
);

-- CreateTable
CREATE TABLE "municipios" (
    "id_municipio" TEXT NOT NULL,
    "id_estado" TEXT NOT NULL,
    "vc_nombre" TEXT NOT NULL,
    "vc_clave" TEXT,
    "i_registro" INTEGER NOT NULL,
    "i_actualizacion" INTEGER NOT NULL,
    "i_codigo_postal" INTEGER,

    CONSTRAINT "municipios_pkey" PRIMARY KEY ("id_municipio")
);

-- CreateTable
CREATE TABLE "colonias" (
    "id_colonia" TEXT NOT NULL,
    "id_municipio" TEXT NOT NULL,
    "vc_nombre" TEXT NOT NULL,
    "i_codigo_postal" INTEGER,
    "i_registro" INTEGER NOT NULL,
    "i_actualizacion" INTEGER NOT NULL,

    CONSTRAINT "colonias_pkey" PRIMARY KEY ("id_colonia")
);

-- CreateTable
CREATE TABLE "direcciones" (
    "id_direccion" TEXT NOT NULL,
    "id_pais" TEXT NOT NULL,
    "id_estado" TEXT NOT NULL,
    "id_municipio" TEXT NOT NULL,
    "id_colonia" TEXT NOT NULL,
    "vc_calle" TEXT NOT NULL,
    "vc_numero_exterior" TEXT,
    "vc_numero_interior" TEXT,
    "vc_codigo_postal" TEXT NOT NULL,
    "i_registro" INTEGER NOT NULL,
    "i_actualizacion" INTEGER NOT NULL,

    CONSTRAINT "direcciones_pkey" PRIMARY KEY ("id_direccion")
);

-- CreateTable
CREATE TABLE "localizaciones" (
    "id_localizacion" TEXT NOT NULL,
    "f_latitud" DECIMAL(65,30) NOT NULL,
    "f_longitud" DECIMAL(65,30) NOT NULL,
    "i_registro" INTEGER NOT NULL,
    "i_actualizacion" INTEGER NOT NULL,

    CONSTRAINT "localizaciones_pkey" PRIMARY KEY ("id_localizacion")
);

-- CreateTable
CREATE TABLE "pedido" (
    "id_pedido" TEXT NOT NULL,
    "id_establecimiento" TEXT NOT NULL,
    "id_promotor" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "i_entrega" INTEGER NOT NULL,
    "i_total" INTEGER NOT NULL,
    "i_registro" INTEGER NOT NULL,
    "i_actualizacion" INTEGER NOT NULL,
    "estado" "estados_podido" NOT NULL DEFAULT 'pendiente',

    CONSTRAINT "pedido_pkey" PRIMARY KEY ("id_pedido")
);

-- CreateTable
CREATE TABLE "log" (
    "id_log" TEXT NOT NULL,
    "nombre_tabla" TEXT NOT NULL,
    "id_registro" TEXT NOT NULL,
    "campos" TEXT NOT NULL,
    "valores" TEXT NOT NULL,
    "vc_accion" TEXT NOT NULL,
    "i_registro" INTEGER NOT NULL,

    CONSTRAINT "log_pkey" PRIMARY KEY ("id_log")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_vc_correo_key" ON "usuarios"("vc_correo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_vc_telefono_key" ON "usuarios"("vc_telefono");

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
