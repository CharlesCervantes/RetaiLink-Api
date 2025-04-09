/*
  Warnings:

  - The primary key for the `clientes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `colonias` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `direcciones` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `establecimientos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `estados` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `localizaciones` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `log` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `marcas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `municipios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `paises` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pedido` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `perfiles_promotor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `promotores` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `usuarios` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "colonias" DROP CONSTRAINT "colonias_id_municipio_fkey";

-- DropForeignKey
ALTER TABLE "direcciones" DROP CONSTRAINT "direcciones_id_colonia_fkey";

-- DropForeignKey
ALTER TABLE "direcciones" DROP CONSTRAINT "direcciones_id_estado_fkey";

-- DropForeignKey
ALTER TABLE "direcciones" DROP CONSTRAINT "direcciones_id_municipio_fkey";

-- DropForeignKey
ALTER TABLE "direcciones" DROP CONSTRAINT "direcciones_id_pais_fkey";

-- DropForeignKey
ALTER TABLE "establecimientos" DROP CONSTRAINT "establecimientos_id_direccion_fkey";

-- DropForeignKey
ALTER TABLE "establecimientos" DROP CONSTRAINT "establecimientos_id_localizacion_fkey";

-- DropForeignKey
ALTER TABLE "estados" DROP CONSTRAINT "estados_id_pais_fkey";

-- DropForeignKey
ALTER TABLE "marcas" DROP CONSTRAINT "marcas_id_cliente_fkey";

-- DropForeignKey
ALTER TABLE "municipios" DROP CONSTRAINT "municipios_id_estado_fkey";

-- DropForeignKey
ALTER TABLE "pedido" DROP CONSTRAINT "pedido_id_establecimiento_fkey";

-- DropForeignKey
ALTER TABLE "pedido" DROP CONSTRAINT "pedido_id_promotor_fkey";

-- DropForeignKey
ALTER TABLE "pedido" DROP CONSTRAINT "pedido_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "perfiles_promotor" DROP CONSTRAINT "perfiles_promotor_id_promotor_fkey";

-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_id_cliente_fkey";

-- AlterTable
ALTER TABLE "clientes" DROP CONSTRAINT "clientes_pkey",
ALTER COLUMN "id_cliente" DROP DEFAULT,
ALTER COLUMN "id_cliente" SET DATA TYPE TEXT,
ADD CONSTRAINT "clientes_pkey" PRIMARY KEY ("id_cliente");
DROP SEQUENCE "clientes_id_cliente_seq";

-- AlterTable
ALTER TABLE "colonias" DROP CONSTRAINT "colonias_pkey",
ALTER COLUMN "id_colonia" DROP DEFAULT,
ALTER COLUMN "id_colonia" SET DATA TYPE TEXT,
ALTER COLUMN "id_municipio" SET DATA TYPE TEXT,
ADD CONSTRAINT "colonias_pkey" PRIMARY KEY ("id_colonia");
DROP SEQUENCE "colonias_id_colonia_seq";

-- AlterTable
ALTER TABLE "direcciones" DROP CONSTRAINT "direcciones_pkey",
ALTER COLUMN "id_direccion" DROP DEFAULT,
ALTER COLUMN "id_direccion" SET DATA TYPE TEXT,
ALTER COLUMN "id_pais" SET DATA TYPE TEXT,
ALTER COLUMN "id_estado" SET DATA TYPE TEXT,
ALTER COLUMN "id_municipio" SET DATA TYPE TEXT,
ALTER COLUMN "id_colonia" SET DATA TYPE TEXT,
ADD CONSTRAINT "direcciones_pkey" PRIMARY KEY ("id_direccion");
DROP SEQUENCE "direcciones_id_direccion_seq";

-- AlterTable
ALTER TABLE "establecimientos" DROP CONSTRAINT "establecimientos_pkey",
ALTER COLUMN "id_establecimiento" DROP DEFAULT,
ALTER COLUMN "id_establecimiento" SET DATA TYPE TEXT,
ALTER COLUMN "id_direccion" SET DATA TYPE TEXT,
ALTER COLUMN "id_localizacion" SET DATA TYPE TEXT,
ALTER COLUMN "i_actualizacion" SET DATA TYPE TEXT,
ADD CONSTRAINT "establecimientos_pkey" PRIMARY KEY ("id_establecimiento");
DROP SEQUENCE "establecimientos_id_establecimiento_seq";

-- AlterTable
ALTER TABLE "estados" DROP CONSTRAINT "estados_pkey",
ALTER COLUMN "id_estado" DROP DEFAULT,
ALTER COLUMN "id_estado" SET DATA TYPE TEXT,
ALTER COLUMN "id_pais" SET DATA TYPE TEXT,
ADD CONSTRAINT "estados_pkey" PRIMARY KEY ("id_estado");
DROP SEQUENCE "estados_id_estado_seq";

-- AlterTable
ALTER TABLE "localizaciones" DROP CONSTRAINT "localizaciones_pkey",
ALTER COLUMN "id_localizacion" DROP DEFAULT,
ALTER COLUMN "id_localizacion" SET DATA TYPE TEXT,
ADD CONSTRAINT "localizaciones_pkey" PRIMARY KEY ("id_localizacion");
DROP SEQUENCE "localizaciones_id_localizacion_seq";

-- AlterTable
ALTER TABLE "log" DROP CONSTRAINT "log_pkey",
ALTER COLUMN "id_log" DROP DEFAULT,
ALTER COLUMN "id_log" SET DATA TYPE TEXT,
ALTER COLUMN "id_registro" SET DATA TYPE TEXT,
ADD CONSTRAINT "log_pkey" PRIMARY KEY ("id_log");
DROP SEQUENCE "log_id_log_seq";

-- AlterTable
ALTER TABLE "marcas" DROP CONSTRAINT "marcas_pkey",
ALTER COLUMN "id_marca" DROP DEFAULT,
ALTER COLUMN "id_marca" SET DATA TYPE TEXT,
ALTER COLUMN "id_cliente" SET DATA TYPE TEXT,
ADD CONSTRAINT "marcas_pkey" PRIMARY KEY ("id_marca");
DROP SEQUENCE "marcas_id_marca_seq";

-- AlterTable
ALTER TABLE "municipios" DROP CONSTRAINT "municipios_pkey",
ALTER COLUMN "id_municipio" DROP DEFAULT,
ALTER COLUMN "id_municipio" SET DATA TYPE TEXT,
ALTER COLUMN "id_estado" SET DATA TYPE TEXT,
ADD CONSTRAINT "municipios_pkey" PRIMARY KEY ("id_municipio");
DROP SEQUENCE "municipios_id_municipio_seq";

-- AlterTable
ALTER TABLE "paises" DROP CONSTRAINT "paises_pkey",
ALTER COLUMN "id_pais" DROP DEFAULT,
ALTER COLUMN "id_pais" SET DATA TYPE TEXT,
ADD CONSTRAINT "paises_pkey" PRIMARY KEY ("id_pais");
DROP SEQUENCE "paises_id_pais_seq";

-- AlterTable
ALTER TABLE "pedido" DROP CONSTRAINT "pedido_pkey",
ADD COLUMN     "estado" "estados_podido" NOT NULL DEFAULT 'pendiente',
ALTER COLUMN "id_pedido" DROP DEFAULT,
ALTER COLUMN "id_pedido" SET DATA TYPE TEXT,
ALTER COLUMN "id_establecimiento" SET DATA TYPE TEXT,
ALTER COLUMN "id_promotor" SET DATA TYPE TEXT,
ALTER COLUMN "id_usuario" SET DATA TYPE TEXT,
ADD CONSTRAINT "pedido_pkey" PRIMARY KEY ("id_pedido");
DROP SEQUENCE "pedido_id_pedido_seq";

-- AlterTable
ALTER TABLE "perfiles_promotor" DROP CONSTRAINT "perfiles_promotor_pkey",
ALTER COLUMN "id_perfil_promotor" DROP DEFAULT,
ALTER COLUMN "id_perfil_promotor" SET DATA TYPE TEXT,
ALTER COLUMN "id_promotor" SET DATA TYPE TEXT,
ADD CONSTRAINT "perfiles_promotor_pkey" PRIMARY KEY ("id_perfil_promotor");
DROP SEQUENCE "perfiles_promotor_id_perfil_promotor_seq";

-- AlterTable
ALTER TABLE "promotores" DROP CONSTRAINT "promotores_pkey",
ALTER COLUMN "id_promotor" DROP DEFAULT,
ALTER COLUMN "id_promotor" SET DATA TYPE TEXT,
ADD CONSTRAINT "promotores_pkey" PRIMARY KEY ("id_promotor");
DROP SEQUENCE "promotores_id_promotor_seq";

-- AlterTable
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_pkey",
ALTER COLUMN "id_usuario" DROP DEFAULT,
ALTER COLUMN "id_usuario" SET DATA TYPE TEXT,
ALTER COLUMN "id_cliente" SET DATA TYPE TEXT,
ADD CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario");
DROP SEQUENCE "usuarios_id_usuario_seq";

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
