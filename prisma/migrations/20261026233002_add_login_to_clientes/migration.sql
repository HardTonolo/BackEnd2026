/*
  Warnings:

  - You are about to alter the column `cpf` on the `clientes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(14)`.
  - You are about to drop the column `id_departamento` on the `veiculos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `clientes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `clientes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `veiculos` DROP FOREIGN KEY `veiculos_id_departamento_fkey`;

-- AlterTable
ALTER TABLE `clientes` ADD COLUMN `ativo` BOOLEAN NULL,
    ADD COLUMN `email` VARCHAR(255) NULL,
    ADD COLUMN `permissao` VARCHAR(255) NULL,
    ADD COLUMN `senha` VARCHAR(255) NULL,
    MODIFY `cpf` VARCHAR(14) NULL;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `cpf` VARCHAR(14) NULL;

-- AlterTable
ALTER TABLE `veiculos` DROP COLUMN `id_departamento`,
    ADD COLUMN `foto` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `clientes_cpf_key` ON `clientes`(`cpf`);

-- CreateIndex
CREATE UNIQUE INDEX `clientes_email_key` ON `clientes`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `usuarios_cpf_key` ON `usuarios`(`cpf`);
