import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { PoMenuItem, PoMenuModule, PoPageModule, PoToolbarModule, PoButtonModule } from '@po-ui/ng-components';

import { ProtheusLibCoreModule } from "@totvs/protheus-lib-core";
import { ProAppConfigService } from "@totvs/protheus-lib-core";
@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    PoToolbarModule,
    PoMenuModule,
    PoPageModule,
    ProtheusLibCoreModule,
    RouterOutlet,
    PoButtonModule,

  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  //Ao carregar a página
  constructor(private proAppConfigService: ProAppConfigService, private router: Router) {
    if (!this.proAppConfigService.insideProtheus()) {
      this.proAppConfigService.loadAppConfig();
      sessionStorage.setItem("insideProtheus", "0");
      sessionStorage.setItem("ERPTOKEN", '{"access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBKd3RQdWJsaWNLZXlGb3IyNTYifQ.eyJpc3MiOiJUT1RWUy1BRFZQTC1GV0pXVCIsInN1YiI6IkZlbGlwZSIsImlhdCI6MTc4Mzk2NDIyMCwidXNlcmlkIjoiMDAwMzk3IiwiZXhwIjoxNzgzOTY3ODIwLCJlbnZJZCI6IlRPUFAxMiJ9.IGWvgdGJXEqqIBgefsXmHd0uP_5jqiopU0Vf2Nv5khBjlj_7DfpUBeUyo7IOsNe5Um5YB3lgKy9UV5W0hmSqrFMvmw_9xGELw8l_9O1_SU9Dk-yb8m8wKP_BnOiZDk9XK69r0mq3IOJgJ2HQ93xfVPS9eBldlGCpFq-o9rEh8IihGYckqUe2y2wT4ayzFHvdepKWlcxYMZGQh7NFwce0ZvoB8QQftkCZVGNTcp-JCEilAwe-C3pMD3JxIx4CHs9Pvfvamm8Jd36GMOwhFCQzhSuZoGGY7gEvHt2csWJWtAB-a0aTQ-KLGNUPDWM7GuYBTcQH56MYWfmLrteCQ7NKRA","refresh_token": "DFMoDHQHYHFzij52pSadiIjX.E2odS1sbYyxijTtq21ed6ZXFodgtXmh-h3cZi4gNtos1mwZqeZcHXTICHNwoBrSCvl0NQ69rLai425mNDBvWllJLE7AGkCnCHVfR8eZd7VgBoedlsuYhUmvNMQHOIURQgQGEG-mciblyp7NC-qlier_dUe4Nwge1JoqoD43tPkQ57fbQPCPCg8xX.Dv3oDZ_Cca73lmaEwVAhY8VeGqf9UOQrkLy0ufdayOHh0Re9HPt6tiGrhjStQ0O5zekmaD4eaKVNKDtacbloTj0YbnYEtDv0GdfsMN0MQ_c7nQ9Vms8_RfMI_sSZ-dMdxZWTLhS9q14w8wnSmdiN7kJKDMPhTfxiscnKpbDqVLv8QIk0Kk2u6yckoem2Ml7pWWTHrZazpFRf0P7oxb4D58XdhHSOKZ7-C-Gd7-wwQ22h5rKdJDiAbIt8U-_Av777pcZpd4HjhBv6saqYU-6MIFYdemdF0ocUcCNCbaoPJXZoaD3mgfzLmhBAsEFeZRXA6Fz0Ajf3mVqGe_RXsJsHjg","scope": "default","token_type": "Bearer","expires_in": 3600, "hasMFA": false}');
    }
    else {
      sessionStorage.setItem("insideProtheus", "1");
    }

  }

  // As opções
  readonly menus: Array<PoMenuItem> = [
    { label: 'Romaneio', action: this.cargasCk.bind(this), icon: 'an-fill an-files', shortLabel: 'Romaneios' },
    { label: 'Imprimir Boleto', action: this.boletoCk.bind(this), icon: 'an-fill an an-printer', shortLabel: 'Imprimir Boletos' },
    { label: 'Monitor/Operacões', action: this.monitorCk.bind(this), icon: 'an-fill an-monitor-arrow-up', shortLabel: 'Monitor' },
    { label: 'Titulos', action: this.tituloCk.bind(this), icon: 'an-fill an-fill an-currency-dollar', shortLabel: 'Titulos' },
    { label: 'Sair', action: this.closeApp.bind(this), icon: 'an-fill an-door-open', shortLabel: 'Sair' }
  ];

  //Pedidos
  private boletoCk() {
    this.router.navigate(['/', 'boleto']);
  }
  //Cargas
  private cargasCk() {
    this.router.navigate(['/', 'romaneio']);
  }
  //Monitor
  private monitorCk() {
    this.router.navigate(['/', 'monitor']);
  }
  //Monitor
  private tituloCk() {
    this.router.navigate(['/', 'titulo']);
  }
  //Sair
  private closeApp() {
    if (this.proAppConfigService.insideProtheus()) {
      this.proAppConfigService.callAppClose();
    } else {
      alert("Clique não veio do Protheus");
    }
  }
}
