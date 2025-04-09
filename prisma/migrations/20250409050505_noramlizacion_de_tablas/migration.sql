/*
  Warnings:

  - You are about to drop the column `i_actualizacion` on the `colonias` table. All the data in the column will be lost.
  - You are about to drop the column `i_registro` on the `colonias` table. All the data in the column will be lost.
  - You are about to drop the column `i_actualizacion` on the `direcciones` table. All the data in the column will be lost.
  - You are about to drop the column `i_registro` on the `direcciones` table. All the data in the column will be lost.
  - You are about to drop the column `i_actualizacion` on the `establecimientos` table. All the data in the column will be lost.
  - You are about to drop the column `i_registro` on the `establecimientos` table. All the data in the column will be lost.
  - You are about to drop the column `i_status` on the `estados` table. All the data in the column will be lost.
  - You are about to drop the column `i_actualizacion` on the `localizaciones` table. All the data in the column will be lost.
  - You are about to drop the column `i_registro` on the `localizaciones` table. All the data in the column will be lost.
  - You are about to drop the column `i_actualizacion` on the `municipios` table. All the data in the column will be lost.
  - You are about to drop the column `i_registro` on the `municipios` table. All the data in the column will be lost.
  - You are about to drop the column `i_status` on the `perfiles_promotor` table. All the data in the column will be lost.
  - You are about to drop the column `i_actualizacion` on the `promotores` table. All the data in the column will be lost.
  - You are about to drop the column `i_registro` on the `promotores` table. All the data in the column will be lost.
  - You are about to drop the column `i_status` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the `log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pedido` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dt_actualizacion` to the `colonias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dt_actualizacion` to the `direcciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dt_actualizacion` to the `establecimientos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dt_actualizacion` to the `localizaciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dt_actualizacion` to the `municipios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dt_actualizacion` to the `promotores` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pedido" DROP CONSTRAINT "pedido_id_establecimiento_fkey";

-- DropForeignKey
ALTER TABLE "pedido" DROP CONSTRAINT "pedido_id_promotor_fkey";

-- DropForeignKey
ALTER TABLE "pedido" DROP CONSTRAINT "pedido_id_usuario_fkey";

-- AlterTable
ALTER TABLE "colonias" DROP COLUMN "i_actualizacion",
DROP COLUMN "i_registro",
ADD COLUMN     "b_activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "dt_actualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dt_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "direcciones" DROP COLUMN "i_actualizacion",
DROP COLUMN "i_registro",
ADD COLUMN     "b_activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "dt_actualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dt_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "establecimientos" DROP COLUMN "i_actualizacion",
DROP COLUMN "i_registro",
ADD COLUMN     "b_activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "dt_actualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dt_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "estados" DROP COLUMN "i_status",
ADD COLUMN     "b_activo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "localizaciones" DROP COLUMN "i_actualizacion",
DROP COLUMN "i_registro",
ADD COLUMN     "b_activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "dt_actualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dt_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "municipios" DROP COLUMN "i_actualizacion",
DROP COLUMN "i_registro",
ADD COLUMN     "b_activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "dt_actualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dt_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "paises" ADD COLUMN     "b_activo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "perfiles_promotor" DROP COLUMN "i_status",
ADD COLUMN     "b_activo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "promotores" DROP COLUMN "i_actualizacion",
DROP COLUMN "i_registro",
ADD COLUMN     "b_activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "dt_actualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dt_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "i_status",
ADD COLUMN     "b_activo" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "log";

-- DropTable
DROP TABLE "pedido";

-- CreateTable
CREATE TABLE "pedidos" (
    "id_pedido" TEXT NOT NULL,
    "id_establecimiento" TEXT NOT NULL,
    "id_promotor" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "i_entrega" INTEGER NOT NULL,
    "i_total" INTEGER NOT NULL,
    "estado" "estados_podido" NOT NULL DEFAULT 'pendiente',
    "dt_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dt_actualizacion" TIMESTAMP(3) NOT NULL,
    "b_activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id_pedido")
);

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_id_establecimiento_fkey" FOREIGN KEY ("id_establecimiento") REFERENCES "establecimientos"("id_establecimiento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_id_promotor_fkey" FOREIGN KEY ("id_promotor") REFERENCES "promotores"("id_promotor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
