import { Routes } from '@angular/router';
import { Boletos } from './components/boletos/boletos';
import { Romaneios } from './components/romaneios/romaneios';
import { Monitor } from './components/monitor/monitor';
import { Titulos } from './components/titulo/titulo';

export const routes: Routes = [
    {path: "boleto"  , title: "Impressao Boletos"  , component: Boletos},
    {path: "romaneio", title: "Romaneios", component: Romaneios},
    {path: "monitor" , title: "Monitor"  , component: Monitor},
    {path: "titulo"  , title: "Titulo"   , component: Titulos},
];
