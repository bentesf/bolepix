import { ChangeDetectorRef,Component, OnInit, ViewChild } from '@angular/core';
import { PoTableColumn, PoButtonModule, PoTableModule, PoModalComponent, PoModalModule, PoNotificationService, PoNotificationModule, PoDialogModule, PoDialogService, PoInfoModule, PoModalAction, PoFieldModule, PoSelectOption } from '@po-ui/ng-components';
import { Cargas, Pedidos, ProtheusService } from '../../../assets/data/protheus.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component(
  {
    selector: 'app-romaneios',
    templateUrl: './romaneios.html',
    styleUrls: ['./romaneios.css',],
    imports: [CommonModule, PoButtonModule, PoTableModule, PoModalModule, PoNotificationModule, PoDialogModule, PoInfoModule,FormsModule, PoFieldModule]
  }
)
export class Romaneios implements OnInit {

  @ViewChild('modalViewCarga', { static: true }) modalViewCarga!: PoModalComponent;
  @ViewChild('modalRastreio', { static: true }) modalRastreio!: PoModalComponent;

  cargas: Cargas[] = [];
  cargaSelecionada: Cargas[] = [];
  pedidosCarga: Pedidos[] = [];
  loading: boolean = false;
  dataInicio: string = '';
  dataFim: string = '';
  parcial: number = 0;
  registrar: number = 0;
  enviado: number = 0;
  pendente: number = 0;
  total: number = 0;
  urlRastreio: SafeResourceUrl = '';

  readonly columns: PoTableColumn[] = [
    {
      property: 'transm',
      label: 'Transmissão',
      type: 'label', // Garante que a coluna renderize como uma Tag
      labels: [
        { value: 'M', label: 'Parcial'    , color: 'color-09', tooltip: 'Com alteração ou Cancelamento' },
        { value: 'P', label: 'Pendente'   , color: 'color-03', tooltip: 'Pendente S/ Bordero'           },
        { value: 'N', label: 'Processando', color: 'color-02', tooltip: 'Pendente C/ Bordero'           },
        { value: 'S', label: 'Transmitido', color: 'color-10', tooltip: 'Transmissão Completa'          },
        { value: 'F', label: 'Falha'      , color: 'color-07', tooltip: 'Transmissão com Falha'         },
      ]
    },
    { property: 'filial'   , label: 'Filial'    },
    { property: 'carga'    , label: 'Carga'     },
    { property: 'destino'  , label: 'Destino'   },
    { property: 'motora'   , label: 'Motorista' },
    { property: 'emissao'  , label: 'Emissao'   },
    { property: 'entrega'  , label: 'Entrega'   },
    { property: 'qtdboleto', label: 'Qtd.Boleto'},
    
  ];
    readonly columnsModal: PoTableColumn[] = [
    { property: 'sequencial', label: 'Seq.', width: '5%' },
    {
      property: 'status',
      label: 'Status',
      type: 'label', // Garante que a coluna renderize como uma Tag
      labels: [
        { value: 'P', label: 'Pendente'   , color: 'color-03', tooltip: 'Pendente S/ Bordero'           },
        { value: 'N', label: 'Processando', color: 'color-02', tooltip: 'Aguardando envio para o Banco'           },
        { value: 'S', label: 'Transmitido', color: 'color-10', tooltip: 'Transmissão Completa'          },
        { value: 'C', label: 'Cancelado'  , color: 'color-07', tooltip: 'Cancelado pelo Financeiro'         },
        { value: 'F', label: 'Falha'      , color: 'color-07', tooltip: 'Transmissão com Falha'         },
      ]
    },
    { property: 'ea_numbor' , label: 'Bordero'},
    { property: 'pedido'    , label: 'Pedido' },
    { property: 'cliente'   , label: 'Cliente'},
    { property: 'nome'      , label: 'Nome Cliente', width: '30%' },
    { property: 'ea_parcela', label: 'Parcela'},
    { property: 'ea_num'    , label: 'Titulo' },
    { property: 'ea_prefixo', label: 'Serie'  },
    { property: 'ea_tipo'   , label: 'Tipo'   },
    
  ];

  constructor(
    private protheusService: ProtheusService,
    private poNotification: PoNotificationService,
    private poDialog: PoDialogService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
  }

  atualizarCarga(){
    this.cargas = [];
    this.loadCargas();
  }

  visualisarCarga(){
    const cargasSelecionadas = this.cargas.filter(carga => (carga as any).$selected);

    if (cargasSelecionadas.length !== 1) {
      this.poNotification.warning('Selecione exatamente uma carga para visualizar.');
      return;
    }

    this.cargaSelecionada = cargasSelecionadas;
    const cargaId = this.cargaSelecionada[0].carga;
    const filId = this.cargaSelecionada[0].codfil;

    this.protheusService.getPedCar(cargaId,filId).subscribe({
      next: (pedidos) => {
        this.pedidosCarga = pedidos.map((pedido, index) => ({ ...pedido, sequencial: index + 1 }));
        this.modalViewCarga.open();
      },
      error: (err) => {
        this.poNotification.error('Erro ao buscar os pedidos da carga.');
        console.error('Erro em getPedCar:', err);
      }
    });
  }

  imprimirCarga(){
    const cargasSelecionadas = this.cargas.filter(carga => (carga as any).$selected);

    if (cargasSelecionadas.length === 0) {
      this.poNotification.warning('Selecione ao menos uma carga para imprimir.');
      return;
    }

    if (cargasSelecionadas.some(carga => carga.transm !== 'S')) {
      this.poNotification.warning('A impressão só é permitida para cargas que já foram transmitidas');
      return;
    }

    const codigosCargas = cargasSelecionadas.map(carga => carga.carga).join(';');

    this.poDialog.confirm({
      title: 'Confirmar',
      message: `Deseja solicitar a impressão da(s) carga(s): ${codigosCargas} ?`,
      confirm: () => {
        this.loading = true;
        const requests = cargasSelecionadas.map(c => this.protheusService.getPedCar(c.carga, c.codfil));

        forkJoin(requests).subscribe({
          next: (resps: Pedidos[][]) => {
            const allPedidos = resps.flat();
            const bills = allPedidos.map(p => ({
              ea_filial: (p as any).ea_filial || "  ",
              ea_prefixo: p.ea_prefixo,
              ea_num: p.ea_num,
              ea_parcela: p.ea_parcela,
              ea_tipo: p.ea_tipo,
              ea_numbor: p.ea_numbor
            }));

            const payload = JSON.stringify({ bills, branches: [""] });

            this.protheusService.impressao(payload).subscribe({
              next: (res: any) => {
                const file = new Blob([res], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL); 
                this.poNotification.success('Impressão solicitada com sucesso!');
                this.loading = false;
              },
              error: (err) => {
                this.poNotification.error('Erro ao solicitar Impressão. Verifique o log para mais detalhes.');
                console.error('Erro ao solicitar impressão:', err);
                this.loading = false;
              }
            });
          },
          error: (err) => {
            this.poNotification.error('Erro ao buscar os pedidos da carga.');
            console.error('Erro ao buscar pedidos:', err);
            this.loading = false;
          }
        });
      }
    });
  }


  loadCargas(): void {
      if (!this.dataInicio || !this.dataFim) {
        return;
      }

      this.loading = true;

      const inicio = this.formatoData(this.dataInicio);
      const fim = this.formatoData(this.dataFim);

      this.protheusService.getCargas(inicio, fim).subscribe({
        next: (cargas) => {
          this.cargas = cargas;
          this.loading = false;
          this.calcularIndicadores();
          // this.calcularIndicadores();
        },
        error: () => {
          this.loading = false;
          this.poNotification.warning('Não foi possível encontrar os carregamentos.');
          // Aqui você pode adicionar uma notificação de erro para o usuário
        }
      });
  }
    
  private formatoData(data: string): string {
      return data ? data.replace(/-/g, '') : '';
  }

  transmitirCarga(): void {
    const cargasSelecionadas = this.cargas.filter(carga => (carga as any).$selected);

    if (cargasSelecionadas.length === 0) {
      this.poNotification.warning('Nenhuma carga selecionada.');
      return;
    }

    // if (cargasSelecionadas.some(carga => carga.transm && carga.transm.trim() !== 'F')) {
    //   this.poNotification.warning('A solicitação só é permitida para cargas com status Finalizado.');
    //   return;
    // }

    const codigosCargas = cargasSelecionadas.map(carga => carga.carga).join(';');

    this.poDialog.confirm({
      title: 'Confirmar',
      message: `Deseja solicitar a criação de Borderô e Transmissão para a(s) carga(s): ${codigosCargas}?`,
      confirm: () => {
        this.loading = true;
        this.protheusService.solTransmis({ carga: codigosCargas }).subscribe({
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
    
  onDataInicioChange(data: string) {
    this.dataFim = "";
  }

  onDataFimChange(data: string) {
    this.loadCargas();
  }

  atualizarIndicadoresFooter(): void {
    // const pedidosSelecionados = this.pedidos.filter(pedido => (pedido as any).$selected);
    // this.totalPedidosSelecionadosFooter = pedidosSelecionados.length;
    // this.volumeTotalSelecionadoFooter = pedidosSelecionados.reduce((sum, pedido) => sum + (pedido.cubagem || 0), 0);
    // this.pesoTotalSelecionadoFooter = pedidosSelecionados.reduce((sum, pedido) => sum + (pedido.peso || 0), 0);
    // this.valorTotalSelecionadoFooter = pedidosSelecionados.reduce((sum, pedido) => sum + (pedido.valor || 0), 0);
    // this.cdr.detectChanges();
  }
  calcularIndicadores() {
    this.total = this.cargas.length;
    // Exemplo de cálculo, ajuste para a sua estrutura de dados
    this.enviado = this.cargas.filter(p => p.transm === 'S').length;
    this.registrar = this.cargas.filter(p => p.transm === 'P').length;
    this.pendente = this.cargas.filter(p => p.transm == 'N').length;
    this.parcial = this.cargas.filter(p => p.transm == 'M').length;
  }

}
