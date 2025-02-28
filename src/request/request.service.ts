// src/request/request.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto, UpdateRequestDto, CreateStatusUpdateDto } from './dtos/request.dto';
import { Status } from '@prisma/client';

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}

  async create(createRequestDto: CreateRequestDto) {
    // Verificar si la tienda existe
    const store = await this.prisma.store.findUnique({
      where: { id: createRequestDto.storeId },
    });

    if (!store) {
      throw new NotFoundException(`Tienda con ID ${createRequestDto.storeId} no encontrada`);
    }

    return this.prisma.request.create({
      data: createRequestDto,
      include: {
        store: true,
        user: true,
      },
    });
  }

  async findAll() {
    return this.prisma.request.findMany({
      include: {
        store: true,
        user: true,
        StatusUpdate: true,
      },
    });
  }

  async findOne(id: string) {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: {
        store: true,
        user: true,
        StatusUpdate: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
    }

    return request;
  }

  async update(id: string, updateRequestDto: UpdateRequestDto) {
    // Verificar si la solicitud existe
    const request = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
    }

    // Si se cambia el estado, registrar también en StatusUpdate
    if (updateRequestDto.status && updateRequestDto.status !== request.status) {
      await this.prisma.statusUpdate.create({
        data: {
          requestId: id,
          status: updateRequestDto.status,
        },
      });
    }

    return this.prisma.request.update({
      where: { id },
      data: updateRequestDto,
      include: {
        store: true,
        user: true,
      },
    });
  }

  async delete(id: string) {
    // Verificar si la solicitud existe
    const request = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
    }

    // Eliminar primero los registros de StatusUpdate relacionados
    await this.prisma.statusUpdate.deleteMany({
      where: { requestId: id },
    });

    return this.prisma.request.delete({
      where: { id },
    });
  }

  async createStatusUpdate(createStatusUpdateDto: CreateStatusUpdateDto) {
    // Verificar si la solicitud existe
    const request = await this.prisma.request.findUnique({
      where: { id: createStatusUpdateDto.requestId },
    });

    if (!request) {
      throw new NotFoundException(`Solicitud con ID ${createStatusUpdateDto.requestId} no encontrada`);
    }

    // Crear la actualización de estado
    const statusUpdate = await this.prisma.statusUpdate.create({
      data: createStatusUpdateDto,
    });

    // Actualizar el estado en la solicitud
    await this.prisma.request.update({
      where: { id: createStatusUpdateDto.requestId },
      data: { status: createStatusUpdateDto.status },
    });

    return statusUpdate;
  }

  async getPendingRequests() {
    return this.prisma.request.findMany({
      where: { status: Status.PENDING },
      include: {
        store: true,
      },
    });
  }

  async getRequestsByUser(userId: string) {
    return this.prisma.request.findMany({
      where: { userId },
      include: {
        store: true,
        StatusUpdate: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async acceptRequest(id: string, userId: string) {
    // Verificar si la solicitud existe y está pendiente
    const request = await this.prisma.request.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
    }

    if (request.status !== Status.PENDING) {
      throw new NotFoundException('Esta solicitud ya ha sido procesada');
    }

    // Actualizar la solicitud
    const updatedRequest = await this.prisma.request.update({
      where: { id },
      data: {
        userId,
        status: Status.ACCEPTED,
      },
      include: {
        store: true,
        user: true,
      },
    });

    // Registrar el cambio de estado
    await this.prisma.statusUpdate.create({
      data: {
        requestId: id,
        status: Status.ACCEPTED,
      },
    });

    return updatedRequest;
  }
}