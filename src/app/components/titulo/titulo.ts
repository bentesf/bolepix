import { ChangeDetectorRef,Component, OnInit, ViewChild } from '@angular/core';
import { PoTableColumn, PoButtonModule, PoTableModule, PoModalComponent, PoModalModule, PoNotificationService, PoNotificationModule, PoDialogModule, PoDialogService, PoInfoModule, PoModalAction, PoFieldModule, PoSelectOption } from '@po-ui/ng-components';
import { Titulo,ProtheusService } from '../../../assets/data/protheus.service';
import { CommonModule,DecimalPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.html',
  styleUrls: ['./titulo.css'],
  imports: [CommonModule, PoButtonModule, PoTableModule, PoModalModule, PoNotificationModule, PoDialogModule, PoInfoModule, FormsModule, PoFieldModule]
})
export class Titulos implements OnInit {

  @ViewChild('modalCarregamento', { static: true }) modalCarregamento!: PoModalComponent;
  @ViewChild('modalItens', { static: true }) modalItens!: PoModalComponent;

  titulos: Titulo[] = [];
  tituloSelecionados: Titulo[] = [];
  loading: boolean = false;
  totalTituloSelecionadosFooter: number = 0;
  totalBoletosSelecionadoFooter: number = 0;
  dataInicio: string = '';
  dataFim3: string = '';
  docSerie: string = '';

//titulo
  readonly columns: PoTableColumn[] = [
    { property: 'numtit'         , label: 'Numero'},
    { property: 'prefixo'        , label: 'Prefixo'},
    { property: 'parcela'        , label: 'Parcela'},
    { property: 'tipo'           , label: 'Tipo'},
    { property: 'codcli'         , label: 'Cliente'},
    { property: 'nome'           , label: 'Nome'},
    { property: 'vlreal'         , label: 'Valor'},
    { property: 'saldo'          , label: 'Saldo'},
    { property: 'emissao'        , label: 'Emissao'},
    { property: 'dtvenc'         , label: 'Vencimento'}
  ];

  constructor(
    private protheusService: ProtheusService,
    private poNotification: PoNotificationService,
    private poDialog: PoDialogService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // this.loadPedidos();
  }

  atualizarTitulo(): void {
    this.titulos = [];
    this.loadTitulo();
  }
  
  
  private loadTitulo(): void {
    if (!this.dataInicio || !this.dataFim3) {
      return;
    }

    if (!this.docSerie || this.docSerie.length < 4) {
      this.docSerie ="ZZZ";

    } else if (this.docSerie.length !== 12 || !/^\d+$/.test(this.docSerie)) {
        this.poNotification.warning('O campo de busca deve conter exatamente 12 números.');
        return;
    }

    this.loading = true;

    const inicio = this.formatoData(this.dataInicio);
    const fim = this.formatoData(this.dataFim3);
    const doc = this.docSerie

    this.protheusService.getTitulo(inicio,fim,doc).subscribe({
      next: (titulo) => {
        this.titulos = titulo;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.poNotification.error('Erro ao buscar titulo.')
        console.error('Erro ao salvar carga:', err);
      }
    });
  }

geraBorde(): void {
    const tituloSelecionado = this.titulos.filter(titulo => (titulo as any).$selected);

    if (tituloSelecionado.length === 0) {
      this.poNotification.warning('Nenhuma carga selecionada.');
      return;
    }

    const codigosCargas = tituloSelecionado.map(titulo => titulo.id).join(';');

    this.poDialog.confirm({
      title: 'Confirmar',
      message: `Deseja solicitar a criação de Borderô e Transmissão para o(s) Titulo(s) selecionados?`,
      confirm: () => {
        this.loading = true;
        this.protheusService.solBorder({ carga: codigosCargas }).subscribe({
          next: () => {
            this.poNotification.success('Transmissão solicitada com sucesso!');
            this.loading = false;
          },
          error: (err) => {
            this.poNotification.error('Erro ao solicitar Transmissão. Verifique o log para mais detalhes.');
            console.error('Erro ao solicitar entrega:', err);
            this.loading = false;

          }
        });
      }
    });
}

  private formatoData(data: string): string {
    return data ? data.replace(/-/g, '') : '';
  }


  onDataInicioChange(data: string) {
    this.dataFim3 = '';
  }
  
  onDataFimChange(data: string) {
    // this.docSerie = "";
    // this.loadTitulo();
  }
  onBuscarDoc() {
    this.titulos = [];
    this.loadTitulo();
  }
}
