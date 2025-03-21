/*
  Warnings:

  - You are about to drop the column `i_actualizacion` on the `marcas` table. All the data in the column will be lost.
  - You are about to drop the column `i_registro` on the `marcas` table. All the data in the column will be lost.
  - Added the required column `dt_actualizacion` to the `clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vc_nombre` to the `clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dt_actualizacion` to the `marcas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "dt_actualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dt_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "vc_nombre" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "marcas" DROP COLUMN "i_actualizacion",
DROP COLUMN "i_registro",
ADD COLUMN     "dt_actualizacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dt_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
