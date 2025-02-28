// src/request/dto/request.dto.ts
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateRequestDto {
  @IsString()
  storeId: string;
  
  @IsOptional()
  @IsString()
  userId?: string;
}

export class UpdateRequestDto {
  @IsOptional()
  @IsString()
  userId?: string;
  
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}

export class CreateStatusUpdateDto {
  @IsString()
  requestId: string;
  
  @IsEnum(Status)
  status: Status;
}