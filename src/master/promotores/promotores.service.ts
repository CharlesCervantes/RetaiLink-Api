import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PromotorDTO } from 'src/dto/promotor.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class PromotoresService {
    constructor(private prisma: PrismaService){}

    async registrarPromotor(promotor: PromotorDTO){
        try {
            
        } catch (error) {
            
        }
    }

    async obtenerPromotorPorEmail(email: string) {
        const promotor = await this.prisma.promotores.findUnique({
            where: {
                vc_correo: email,
            },
        });

        return promotor;
    }

    async obtenerPromotorPorTelefono(telefono: string) {
        const promotor = await this.prisma.promotores.findUnique({
            where: {
                vc_telefono: telefono,
            },
        });

        return promotor;
    }
}
