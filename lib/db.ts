// Funções utilitárias para simular operações de banco de dados

import { 
  usuarios, 
  empreendedores, 
  propriedades, 
  atividades, 
  reservas, 
  mensagens, 
  avaliacoes, 
  favoritos 
} from "./data"
import type { 
  Usuario, 
  Empreendedor, 
  Propriedade, 
  Atividade, 
  Reserva, 
  Mensagem, 
  Avaliacao, 
  Favorito 
} from "./types"

// ========== USUÁRIOS ==========

export function getUsuarios(): Usuario[] {
  return usuarios
}

export function getUsuarioById(id: string): Usuario | undefined {
  return usuarios.find(u => u.id === id)
}

export function getUsuarioByEmail(email: string): Usuario | undefined {
  return usuarios.find(u => u.email === email)
}

// ========== EMPREENDEDORES ==========

export function getEmpreendedores(): Empreendedor[] {
  return empreendedores
}

export function getEmpreendedorById(id: string): Empreendedor | undefined {
  return empreendedores.find(e => e.id === id)
}

// ========== PROPRIEDADES ==========

export function getPropriedades(filtros?: {
  cidade?: string
  tipo?: Propriedade["tipo"]
  precoMin?: number
  precoMax?: number
  busca?: string
}): Propriedade[] {
  let resultado = propriedades.filter(p => p.ativo)
  
  if (filtros) {
    if (filtros.cidade) {
      resultado = resultado.filter(p => 
        p.cidade.toLowerCase().includes(filtros.cidade!.toLowerCase())
      )
    }
    if (filtros.tipo) {
      resultado = resultado.filter(p => p.tipo === filtros.tipo)
    }
    if (filtros.precoMin !== undefined) {
      resultado = resultado.filter(p => p.preco >= filtros.precoMin!)
    }
    if (filtros.precoMax !== undefined) {
      resultado = resultado.filter(p => p.preco <= filtros.precoMax!)
    }
    if (filtros.busca) {
      const termo = filtros.busca.toLowerCase()
      resultado = resultado.filter(p => 
        p.nome.toLowerCase().includes(termo) ||
        p.descricao.toLowerCase().includes(termo) ||
        p.cidade.toLowerCase().includes(termo)
      )
    }
  }
  
  return resultado
}

export function getPropriedadeById(id: string): Propriedade | undefined {
  return propriedades.find(p => p.id === id)
}

export function getPropriedadesByEmpreendedor(empreendedorId: string): Propriedade[] {
  return propriedades.filter(p => p.empreendedorId === empreendedorId)
}

export function getPropriedadesDestaque(limite: number = 4): Propriedade[] {
  return propriedades
    .filter(p => p.ativo)
    .sort((a, b) => b.avaliacao - a.avaliacao)
    .slice(0, limite)
}

// ========== ATIVIDADES ==========

export function getAtividades(filtros?: {
  tipo?: Atividade["tipo"]
  propriedadeId?: string
  busca?: string
}): Atividade[] {
  let resultado = atividades.filter(a => a.ativo)
  
  if (filtros) {
    if (filtros.tipo) {
      resultado = resultado.filter(a => a.tipo === filtros.tipo)
    }
    if (filtros.propriedadeId) {
      resultado = resultado.filter(a => a.propriedadeId === filtros.propriedadeId)
    }
    if (filtros.busca) {
      const termo = filtros.busca.toLowerCase()
      resultado = resultado.filter(a => 
        a.nome.toLowerCase().includes(termo) ||
        a.descricao.toLowerCase().includes(termo)
      )
    }
  }
  
  return resultado
}

export function getAtividadeById(id: string): Atividade | undefined {
  return atividades.find(a => a.id === id)
}

export function getAtividadesByEmpreendedor(empreendedorId: string): Atividade[] {
  return atividades.filter(a => a.empreendedorId === empreendedorId)
}

export function getAtividadesProximas(limite: number = 4): Atividade[] {
  return atividades
    .filter(a => a.ativo)
    .slice(0, limite)
}

// ========== RESERVAS ==========

export function getReservas(): Reserva[] {
  return reservas
}

export function getReservaById(id: string): Reserva | undefined {
  return reservas.find(r => r.id === id)
}

export function getReservasByUsuario(usuarioId: string): Reserva[] {
  return reservas.filter(r => r.usuarioId === usuarioId)
}

export function getReservasByPropriedade(propriedadeId: string): Reserva[] {
  return reservas.filter(r => r.propriedadeId === propriedadeId)
}

export function getReservasByEmpreendedor(empreendedorId: string): Reserva[] {
  const propsIds = propriedades
    .filter(p => p.empreendedorId === empreendedorId)
    .map(p => p.id)
  const ativsIds = atividades
    .filter(a => a.empreendedorId === empreendedorId)
    .map(a => a.id)
  
  return reservas.filter(r => 
    (r.propriedadeId && propsIds.includes(r.propriedadeId)) ||
    (r.atividadeId && ativsIds.includes(r.atividadeId))
  )
}

export function getEstatisticasReservas(empreendedorId: string): {
  total: number
  confirmadas: number
  pendentes: number
  canceladas: number
  concluidas: number
  faturamento: number
} {
  const reservasEmp = getReservasByEmpreendedor(empreendedorId)
  
  return {
    total: reservasEmp.length,
    confirmadas: reservasEmp.filter(r => r.status === "confirmada").length,
    pendentes: reservasEmp.filter(r => r.status === "pendente").length,
    canceladas: reservasEmp.filter(r => r.status === "cancelada").length,
    concluidas: reservasEmp.filter(r => r.status === "concluida").length,
    faturamento: reservasEmp
      .filter(r => r.status === "confirmada" || r.status === "concluida")
      .reduce((acc, r) => acc + r.valorTotal, 0)
  }
}

// ========== MENSAGENS ==========

export function getMensagens(): Mensagem[] {
  return mensagens
}

export function getMensagensByUsuario(usuarioId: string): Mensagem[] {
  return mensagens.filter(m => 
    m.remetenteId === usuarioId || m.destinatarioId === usuarioId
  )
}

export function getMensagensRecebidas(usuarioId: string): Mensagem[] {
  return mensagens.filter(m => m.destinatarioId === usuarioId)
}

export function getMensagensNaoLidas(usuarioId: string): number {
  return mensagens.filter(m => m.destinatarioId === usuarioId && !m.lida).length
}

// ========== AVALIAÇÕES ==========

export function getAvaliacoes(): Avaliacao[] {
  return avaliacoes
}

export function getAvaliacoesByPropriedade(propriedadeId: string): Avaliacao[] {
  return avaliacoes.filter(a => a.propriedadeId === propriedadeId)
}

export function getAvaliacoesByUsuario(usuarioId: string): Avaliacao[] {
  return avaliacoes.filter(a => a.usuarioId === usuarioId)
}

// ========== FAVORITOS ==========

export function getFavoritos(): Favorito[] {
  return favoritos
}

export function getFavoritosByUsuario(usuarioId: string): Favorito[] {
  return favoritos.filter(f => f.usuarioId === usuarioId)
}

export function getPropriedadesFavoritas(usuarioId: string): Propriedade[] {
  const favIds = favoritos
    .filter(f => f.usuarioId === usuarioId)
    .map(f => f.propriedadeId)
  
  return propriedades.filter(p => favIds.includes(p.id))
}

export function isFavorito(usuarioId: string, propriedadeId: string): boolean {
  return favoritos.some(f => 
    f.usuarioId === usuarioId && f.propriedadeId === propriedadeId
  )
}

// ========== HELPERS ==========

export function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
}

export function formatarData(data: string): string {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
}

export function formatarDataLonga(data: string): string {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  })
}

export function gerarId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Simula usuário logado (para protótipo)
export function getUsuarioLogado(): Usuario | null {
  // Retorna o primeiro usuário como logado para demonstração
  return usuarios[0]
}

export function getEmpreendedorLogado(): Empreendedor | null {
  // Retorna o primeiro empreendedor como logado para demonstração
  return empreendedores[0]
}

// ========== CRUD PROPRIEDADES ==========

export function addPropriedade(dados: Omit<Propriedade, "id" | "createdAt" | "avaliacao" | "totalAvaliacoes">): Propriedade {
  const novaPropriedade: Propriedade = {
    ...dados,
    id: `prop-${Date.now()}`,
    avaliacao: 0,
    totalAvaliacoes: 0,
    createdAt: new Date().toISOString().split("T")[0]
  }
  propriedades.push(novaPropriedade)
  return novaPropriedade
}

export function updatePropriedade(id: string, dados: Partial<Propriedade>): Propriedade | null {
  const index = propriedades.findIndex(p => p.id === id)
  if (index === -1) return null
  
  propriedades[index] = { ...propriedades[index], ...dados }
  return propriedades[index]
}

export function deletePropriedade(id: string): boolean {
  const index = propriedades.findIndex(p => p.id === id)
  if (index === -1) return false
  
  // Soft delete - marca como inativo
  propriedades[index].ativo = false
  return true
}

// ========== CRUD ATIVIDADES ==========

export function addAtividade(dados: Omit<Atividade, "id" | "createdAt">): Atividade {
  const novaAtividade: Atividade = {
    ...dados,
    id: `ativ-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0]
  }
  atividades.push(novaAtividade)
  return novaAtividade
}

export function updateAtividade(id: string, dados: Partial<Atividade>): Atividade | null {
  const index = atividades.findIndex(a => a.id === id)
  if (index === -1) return null
  
  atividades[index] = { ...atividades[index], ...dados }
  return atividades[index]
}

export function deleteAtividade(id: string): boolean {
  const index = atividades.findIndex(a => a.id === id)
  if (index === -1) return false
  
  // Soft delete - marca como inativo
  atividades[index].ativo = false
  return true
}

// ========== CRUD RESERVAS ==========

export function addReserva(dados: Omit<Reserva, "id" | "createdAt">): Reserva {
  const novaReserva: Reserva = {
    ...dados,
    id: `res-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0]
  }
  reservas.push(novaReserva)
  return novaReserva
}

export function updateReserva(id: string, dados: Partial<Reserva>): Reserva | null {
  const index = reservas.findIndex(r => r.id === id)
  if (index === -1) return null
  
  reservas[index] = { ...reservas[index], ...dados }
  return reservas[index]
}

// ========== CRUD FAVORITOS ==========

export function addFavorito(usuarioId: string, propriedadeId: string): Favorito {
  const novoFavorito: Favorito = {
    id: `fav-${Date.now()}`,
    usuarioId,
    propriedadeId,
    createdAt: new Date().toISOString().split("T")[0]
  }
  favoritos.push(novoFavorito)
  return novoFavorito
}

export function removeFavorito(usuarioId: string, propriedadeId: string): boolean {
  const index = favoritos.findIndex(f => f.usuarioId === usuarioId && f.propriedadeId === propriedadeId)
  if (index === -1) return false
  
  favoritos.splice(index, 1)
  return true
}

// ========== CRUD MENSAGENS ==========

export function addMensagem(dados: Omit<Mensagem, "id" | "createdAt" | "lida">): Mensagem {
  const novaMensagem: Mensagem = {
    ...dados,
    id: `msg-${Date.now()}`,
    lida: false,
    createdAt: new Date().toISOString().split("T")[0]
  }
  mensagens.push(novaMensagem)
  return novaMensagem
}

export function marcarMensagemLida(id: string): boolean {
  const index = mensagens.findIndex(m => m.id === id)
  if (index === -1) return false
  
  mensagens[index].lida = true
  return true
}

// ========== CRUD AVALIAÇÕES ==========

export function addAvaliacao(dados: Omit<Avaliacao, "id" | "createdAt">): Avaliacao {
  const novaAvaliacao: Avaliacao = {
    ...dados,
    id: `aval-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0]
  }
  avaliacoes.push(novaAvaliacao)
  
  // Atualiza média da propriedade/atividade
  if (dados.propriedadeId) {
    const propAvals = avaliacoes.filter(a => a.propriedadeId === dados.propriedadeId)
    const media = propAvals.reduce((acc, a) => acc + a.nota, 0) / propAvals.length
    const propIndex = propriedades.findIndex(p => p.id === dados.propriedadeId)
    if (propIndex !== -1) {
      propriedades[propIndex].avaliacao = parseFloat(media.toFixed(1))
      propriedades[propIndex].totalAvaliacoes = propAvals.length
    }
  }
  
  return novaAvaliacao
}
