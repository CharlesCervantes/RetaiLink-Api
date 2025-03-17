import { Module } from '@nestjs/common';
import { PromotoresModule } from './promotores/promotores.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PerfilesPromotorModule } from './perfiles_promotor/perfiles_promotor.module';
import { ClientesModule } from './clientes/clientes.module';
import { MarcasModule } from './marcas/marcas.module';
import { EstablecimientosModule } from './establecimientos/establecimientos.module';
import { PaisesModule } from './paises/paises.module';
import { EstadosModule } from './estados/estados.module';
import { MunicipiosModule } from './municipios/municipios.module';
import { ColoniasModule } from './colonias/colonias.module';
import { DireccionesModule } from './direcciones/direcciones.module';
import { LocalizacionesModule } from './localizaciones/localizaciones.module';
import { PedidoModule } from './pedido/pedido.module';
import { LogModule } from './log/log.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [PromotoresModule, UsuariosModule, PerfilesPromotorModule, ClientesModule, MarcasModule, EstablecimientosModule, PaisesModule, EstadosModule, MunicipiosModule, ColoniasModule, DireccionesModule, LocalizacionesModule, PedidoModule, LogModule, RolesModule]
})
export class MasterModule {}
