import { ChangeDetectorRef,Component, OnInit, ViewChild } from '@angular/core';
import { PoTableColumn, PoButtonModule, PoTableModule, PoModalComponent, PoModalModule, PoNotificationService, PoNotificationModule, PoDialogModule, PoDialogService, PoInfoModule, PoModalAction, PoFieldModule, PoSelectOption, PoResponseApi } from '@po-ui/ng-components';
import { Bordero,ProtheusService } from '../../../assets/data/protheus.service';
import { CommonModule,DecimalPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DateFilterService } from '../../services/date-filter.service';

@Component({
  selector: 'app-boletos',
  templateUrl: './boletos.html',
  styleUrls: ['./boletos.css'],
  imports: [CommonModule, PoButtonModule, PoTableModule, PoModalModule, PoNotificationModule, PoDialogModule, PoInfoModule, FormsModule, PoFieldModule, DecimalPipe]
})
export class Boletos implements OnInit {

  @ViewChild('modalCarregamento', { static: true }) modalCarregamento!: PoModalComponent;
  @ViewChild('modalItens', { static: true }) modalItens!: PoModalComponent;

  bordero: Bordero[] = [];
  borderoSelecionados: Bordero[] = [];
  loading: boolean = false;
  totalBorderoSelecionadosFooter: number = 0;
  totalBoletosSelecionadoFooter: number = 0;
  get dataInicio(): string {
    return this.dateFilterService.dataInicio;
  }
  set dataInicio(value: string) {
    this.dateFilterService.dataInicio = value;
  }

  get dataFim1(): string {
    return this.dateFilterService.dataFim;
  }
  set dataFim1(value: string) {
    this.dateFilterService.dataFim = value;
  }
  docSerie: string = '';
//paginacao
  page: number = 1;
  pageSize: number = 200; // Define o limite de 100 por busca
  hasNext: boolean = false

//bordero
  readonly columns: PoTableColumn[] = [
    { property: 'sequencial', label: '#.', width: '5%' },
    { property: 'ea_filial'   , label: 'Filial'   },
    { property: 'ea_prefixo'  , label: 'Prefixo'  },
    { property: 'ea_num'      , label: 'Titulo'   },
    { property: 'ea_parcela'  , label: 'Parcela'  },
    { property: 'ea_tipo'     , label: 'Tipo'     },
    { property: 'ea_numbor'   , label: 'Bordero'  }
  ];

  constructor(
    private protheusService: ProtheusService,
    private poNotification: PoNotificationService,
    private poDialog: PoDialogService,
    private cdr: ChangeDetectorRef,
    private dateFilterService: DateFilterService
  ) { }

  ngOnInit(): void {
    this.loadBordero();
  }

  atualizarBordero(): void {
    this.bordero = [];
    this.page = 1;
    this.loadBordero();
  }

  imprimirBor(){
  const borderosSelecionadas = this.bordero.filter(bordero => (bordero as any).$selected);

  if (borderosSelecionadas.length === 0) {
    this.poNotification.warning('Selecione ao menos um título para impressão.');
    return;
  }

  const codigosborderos = borderosSelecionadas.map(bordero => bordero.ea_numbor).join(';');

    this.poDialog.confirm({
      title: 'Confirmar',
      message: `Deseja solicitar a impressão do(s) título(s) do(s) borderô(s): ${codigosborderos} ?`,
      confirm: () => {
        const bills = borderosSelecionadas.map(item => ({
          ea_filial: item.ea_filial,
          ea_prefixo: item.ea_prefixo,
          ea_num: item.ea_num,
          ea_parcela: item.ea_parcela,
          ea_tipo: item.ea_tipo,
          ea_numbor: item.ea_numbor
        }));

        const payload = JSON.stringify({ bills, branches: [''] });

        this.protheusService.impressao(payload).subscribe({
          next: (res: any) => {
            const file = new Blob([res], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL); 
            this.poNotification.success('Impressão solicitada com sucesso!');
          },
          error: (err) => {
            this.poNotification.error('Erro ao solicitar Impressão. Verifique o log para mais detalhes.');
            console.error('Erro ao solicitar entrega:', err);
          }
        });
      }
    });
}
  
  
private loadBordero(): void {
    if (!this.dataInicio || !this.dataFim1) {
      return;
    }

    if (!this.docSerie || this.docSerie.length < 4){
      this.docSerie ="ZZZ";

    } else if (this.docSerie.length !== 12 || !/^\d+$/.test(this.docSerie)) {
        this.poNotification.warning('O campo de busca deve conter exatamente 12 números.');
        return;
    }

    this.loading = true;

    const inicio = this.formatoData(this.dataInicio);
    const fim = this.formatoData(this.dataFim1);
    const doc = this.docSerie

    // Passando page e pageSize para o serviço
    this.protheusService.getBordero(inicio, fim, doc, this.page, this.pageSize).subscribe({
      next: (res: any) => {
        // Se for a primeira página, substitui. Se for a próxima, concatena.
        let novosItens = res.items || res; // Ajuste conforme o retorno da sua API

        // Adiciona o número sequencial levando em conta a paginação
        novosItens = novosItens.map((item: any, index: number) => ({
          ...item,
          sequencial: (this.page - 1) * this.pageSize + (index + 1)
        }));
        
        if (this.page === 1) {
          this.bordero = novosItens;
        } else {
          this.bordero = [...this.bordero, ...novosItens];
        }

        this.hasNext = res.hasNext || novosItens.length >= this.pageSize;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.poNotification.error('Erro ao buscar bordero.')
        console.error('Erro ao salvar carga:', err);
      }
    });
  }

private formatoData(data: string): string {
    return data ? data.replace(/-/g, '') : '';
  }


atualizarIndicadoresFooter(): void {
  //   const borderosSelecionados = this.bordero.filter(bordero => (bordero as any).$selected);
  //   this.totalBorderoSelecionadosFooter = borderosSelecionados.length;
  //   this.totalBoletosSelecionadoFooter = borderosSelecionados.length;
  //   this.cdr.detectChanges();
  }

onDataInicioChange(data: string) {
    this.dataFim1 = '';
  }
  
  onDataFimChange(data: string) {
    // this.docSerie = "";
    // this.loadBordero();
  }
  onBuscarDoc() {
    // this.dataFim = data;
    this.bordero = [];
    this.loadBordero();
  }

  onShowMore() {
  this.page++;
  this.loadBordero();
  }
}
