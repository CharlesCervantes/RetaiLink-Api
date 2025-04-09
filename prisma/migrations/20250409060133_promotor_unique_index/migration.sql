/*
  Warnings:

  - A unique constraint covering the columns `[vc_telefono]` on the table `promotores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vc_correo]` on the table `promotores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "promotores_vc_telefono_key" ON "promotores"("vc_telefono");

-- CreateIndex
CREATE UNIQUE INDEX "promotores_vc_correo_key" ON "promotores"("vc_correo");
