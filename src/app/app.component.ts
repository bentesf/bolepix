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
    if (! this.proAppConfigService.insideProtheus()) {
      this.proAppConfigService.loadAppConfig();
      sessionStorage.setItem("insideProtheus", "0");
      sessionStorage.setItem("ERPTOKEN", '{"access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBKd3RQdWJsaWNLZXlGb3IyNTYifQ.eyJpc3MiOiJUT1RWUy1BRFZQTC1GV0pXVCIsInN1YiI6IkZlbGlwZSIsImlhdCI6MTc4MTExOTMzMywidXNlcmlkIjoiMDAwMzk3IiwiZXhwIjoxNzgxMTIyOTMzLCJlbnZJZCI6IlRPUFAxMiJ9.dtI6mGolsH5XKpN1oh_-xN168YuSmul3twAV9SeKIsFzAz3yjtzae47BLdHc0Pj_pAVa9ucZYPzs6JLotTYgoR8n5_hHoL7rc1e4S5tU64n132PuCOfSs_YwX8TCss1RJg53d11UF6e4Uf2kR4M5wFNftzS7Ib-_iPYAcb0tXsXJIylkSCTHS8XJP9_zuwIpykwwVX-vUFMq2QqZGcleKJEYDZwpGeM8mDKA7Nh5GdUHjM20KBwKZa1mSrz2SpWCw04xwhNvCLq6HVeV2gDyB2Cyf57oE1uDOVWwpXIogGSBTdSia6DFsSeTAYwdUPc8CkoTFXMZ6OEkexYMl5u-1g","refresh_token": "DFMoDHcXaDdwmgR1pRCdiIjX.E2odS1sbYyxijTtq21ed6ZXFodgtXmh-h3YZi4QNtos1mxZEdJcXUTIBItRiBrSCvl0NQ69rLam425WNDBvWllJtELAWnCnBI1-b8eZd7VgBoedlsuYhUmvNMQHOIURQgQGEG-mciblyp7NC-qlier_dUe4Nwge1JoqoD43tPkQ57fbQPCPCg8xX.bL3jLi6ouQkVqDH3497ZM-t_cqLX8lxZnJ9u9Ci6-PV65NlF78R7DXdo5KTyAO_cQ7xU3mKHNfu-YVyU2emU45SAMOZ0901Ch2ctx7i5dn22JnqonGvGo-wu-0cNAQG1EWqFvyqAvmoMDznP1ori4NrNdBUBx_pekLnjXDtTKqgAaZqLnAgvZEGrxY4gLni0EkA8tk_Rw1CVifw2XuUCPUhRrJ3a5aMl60ENTJU08B-9eqPTgUwyDfiZ_okSK_RWwE1VgJdJ9rIIghTmj6Nfw6l0yN2YKEQ4LIvmbKGIYe8ehtopTR_G5k8OnkSJ7tRH4LIXJIjpXd4yLO0M3bpBRw","scope": "default","token_type": "Bearer","expires_in": 3600, "hasMFA": false}');
    }
    else {
      sessionStorage.setItem("insideProtheus", "1");
    }
    
  }  
  
  // As opções
  readonly menus: Array<PoMenuItem> = [
    { label: 'Romaneio' , action: this.cargasCk.bind(this) , icon: 'an-fill an-files', shortLabel: 'Romaneios'},
    { label: 'Imprimir Boleto'  , action: this.boletoCk.bind(this) , icon: 'an-fill an an-printer', shortLabel: 'Imprimir Boletos' },
    { label: 'Monitor/Operacões'  , action: this.monitorCk.bind(this), icon: 'an-fill an-monitor-arrow-up', shortLabel: 'Monitor' },
    { label: 'Titulos'  , action: this.tituloCk.bind(this), icon: 'an-fill an-fill an-currency-dollar', shortLabel: 'Titulos' },
    { label: 'Sair'     , action: this.closeApp.bind(this) , icon: 'an-fill an-door-open', shortLabel: 'Sair' }
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
