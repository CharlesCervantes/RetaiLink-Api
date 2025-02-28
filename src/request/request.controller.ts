// src/request/request.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto, UpdateRequestDto, CreateStatusUpdateDto } from './dtos/request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestService.create(createRequestDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.requestService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('pending')
  getPendingRequests() {
    return this.requestService.getPendingRequests();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  getMyRequests(@Request() req) {
    return this.requestService.getRequestsByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestService.update(id, updateRequestDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('status')
  createStatusUpdate(@Body() createStatusUpdateDto: CreateStatusUpdateDto) {
    return this.requestService.createStatusUpdate(createStatusUpdateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/accept')
  acceptRequest(@Param('id') id: string, @Request() req) {
    return this.requestService.acceptRequest(id, req.user.userId);
  }
}