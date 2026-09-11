// Tipos do sistema de Ruralize

interface ContaBase {
  id: string
  nome: string
  email: string
  telefone: string
  cpf: string
  avatar?: string
  createdAt: string
}

export interface Usuario extends ContaBase {
  tipo: "visitante"
}

export interface Empreendedor extends ContaBase {
  tipo: "empreendedor"
  nomeEmpresa: string
  cnpj: string
  endereco: string
  cidade: string
  estado: string
  descricao?: string
}

export interface Propriedade {
  id: string
  empreendedorId: string
  nome: string
  descricao: string
  endereco: string
  cidade: string
  estado: string
  preco: number
  capacidade: number
  imagens: string[]
  comodidades: string[]
  tipo: "fazenda" | "sitio" | "chacara" | "pousada" | "camping"
  avaliacao: number
  totalAvaliacoes: number
  ativo: boolean
  createdAt: string
}

export interface Atividade {
  id: string
  propriedadeId: string
  empreendedorId: string
  nome: string
  descricao: string
  tipo: "passeio" | "workshop" | "gastronomia" | "aventura" | "cultural" | "infantil"
  preco: number
  duracao: string
  vagas: number
  imagem: string
  dataEvento?: string
  horario?: string
  inclui: string[]
  requisitos: string[]
  ativo: boolean
  createdAt: string
}

export interface Reserva {
  id: string
  usuarioId: string
  propriedadeId?: string
  atividadeId?: string
  dataInicio: string
  dataFim?: string
  pessoas: number
  valorTotal: number
  status: "pendente" | "confirmada" | "cancelada" | "concluida"
  metodoPagamento?: "pix" | "cartao" | "boleto"
  observacoes?: string
  createdAt: string
}

export interface Mensagem {
  id: string
  remetenteId: string
  destinatarioId: string
  assunto: string
  conteudo: string
  lida: boolean
  createdAt: string
}

export interface Avaliacao {
  id: string
  usuarioId: string
  propriedadeId?: string
  atividadeId?: string
  nota: number
  comentario: string
  createdAt: string
}

export interface Favorito {
  id: string
  usuarioId: string
  propriedadeId: string
  createdAt: string
}
