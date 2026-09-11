"use client"

import {
  atividades as seedAtividades,
  avaliacoes as seedAvaliacoes,
  favoritos as seedFavoritos,
  mensagens as seedMensagens,
  propriedades as seedPropriedades,
  reservas as seedReservas,
  usuarios as seedUsuarios,
  empreendedores as seedEmpreendedores,
} from "./data"
import type {
  Atividade,
  Avaliacao,
  Favorito,
  Mensagem,
  Propriedade,
  Reserva,
  Usuario,
  Empreendedor,
} from "./types"

export type Store = {
  propriedades: Propriedade[]
  atividades: Atividade[]
  reservas: Reserva[]
  mensagens: Mensagem[]
  avaliacoes: Avaliacao[]
  favoritos: Favorito[]
  usuarios: Usuario[]
  empreendedores: Empreendedor[]
  bloqueios: Record<string, string[]>
}

const KEY = "turismo_rural_crud_v3"
const LEGACY_KEYS = ["turismo_rural_crud_v2", "turismo_rural_crud_v1"]

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function seeds(): Store {
  return clone({
    propriedades: seedPropriedades,
    atividades: seedAtividades,
    reservas: seedReservas,
    mensagens: seedMensagens,
    avaliacoes: seedAvaliacoes,
    favoritos: seedFavoritos,
    usuarios: seedUsuarios,
    empreendedores: seedEmpreendedores,
    bloqueios: {},
  })
}

function isValidStore(value: unknown): value is Omit<Store, "bloqueios"> & Partial<Pick<Store, "bloqueios">> {
  if (!value || typeof value !== "object") return false
  const store = value as Partial<Store>
  return [
    store.propriedades,
    store.atividades,
    store.reservas,
    store.mensagens,
    store.avaliacoes,
    store.favoritos,
    store.usuarios,
    store.empreendedores,
  ].every(Array.isArray)
}

function normalizeStore(value: Omit<Store, "bloqueios"> & Partial<Pick<Store, "bloqueios">>): Store {
  return { ...value, bloqueios: value.bloqueios && typeof value.bloqueios === "object" ? value.bloqueios : {} }
}

export function loadStore(): Store {
  if (typeof window === "undefined") return seeds()

  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (isValidStore(parsed)) {
        const normalized = normalizeStore(parsed)
        window.localStorage.setItem(KEY, JSON.stringify(normalized))
        return normalized
      }
    }

    for (const legacyKey of LEGACY_KEYS) {
      const legacyRaw = window.localStorage.getItem(legacyKey)
      if (!legacyRaw) continue
      const parsed: unknown = JSON.parse(legacyRaw)
      if (isValidStore(parsed)) {
        const normalized = normalizeStore(parsed)
        window.localStorage.setItem(KEY, JSON.stringify(normalized))
        return normalized
      }
    }
  } catch {
    // Recria o store abaixo quando o conteúdo salvo está corrompido.
  }

  const initial = seeds()
  window.localStorage.setItem(KEY, JSON.stringify(initial))
  return initial
}

export function saveStore(store: Store): void {
  window.localStorage.setItem(KEY, JSON.stringify(store))
  window.dispatchEvent(new Event("turismo-rural-store"))
}

export function resetStore(): Store {
  const initial = seeds()
  saveStore(initial)
  return initial
}

export function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function today(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function accountExists(store: Store, id: string): boolean {
  return store.usuarios.some((u) => u.id === id) || store.empreendedores.some((e) => e.id === id)
}

function visitorExists(store: Store, id: string): boolean {
  return store.usuarios.some((u) => u.id === id && u.tipo === "visitante")
}

function entrepreneurExists(store: Store, id: string): boolean {
  return store.empreendedores.some((e) => e.id === id && e.tipo === "empreendedor")
}

function assertOwner(actualId: string, expectedId: string, message: string): void {
  if (actualId !== expectedId) throw new Error(message)
}

function assertFinitePositive(value: unknown, field: string, minimum = 0): number {
  const number = Number(value)
  if (!Number.isFinite(number) || number < minimum) throw new Error(`${field} inválido`)
  return number
}

function assertInteger(value: unknown, field: string, minimum = 0): number {
  const number = assertFinitePositive(value, field, minimum)
  if (!Number.isInteger(number)) throw new Error(`${field} deve ser um número inteiro`)
  return number
}

function isActiveReservation(reservation: Reserva): boolean {
  if (reservation.status !== "pendente" && reservation.status !== "confirmada") return false
  const todayIso = today()
  if (reservation.dataFim) return reservation.dataFim >= todayIso
  return reservation.dataInicio >= todayIso
}

function parseDate(date: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Data inválida")
  const [year, month, day] = date.split("-").map(Number)
  const result = new Date(year, month - 1, day)
  if (
    Number.isNaN(result.getTime()) ||
    result.getFullYear() !== year ||
    result.getMonth() !== month - 1 ||
    result.getDate() !== day
  ) throw new Error("Data inválida")
  return result
}

function nightsBetween(start: string, end?: string): number {
  if (!end || !start) return 1
  const diff = Math.round((parseDate(end).getTime() - parseDate(start).getTime()) / 86400000)
  if (diff < 1) throw new Error("A data de saída deve ser posterior à entrada")
  return diff
}

function rangesOverlap(
  startA: string,
  endA: string | undefined,
  startB: string,
  endB: string | undefined,
): boolean {
  const day = 86400000
  const aStart = parseDate(startA).getTime()
  const aEnd = endA ? parseDate(endA).getTime() : aStart + day
  const bStart = parseDate(startB).getTime()
  const bEnd = endB ? parseDate(endB).getTime() : bStart + day
  return aStart < bEnd && bStart < aEnd
}

function calculateReservationTotal(
  store: Store,
  data: Pick<Reserva, "propriedadeId" | "atividadeId" | "dataInicio" | "dataFim" | "pessoas">,
): number {
  const people = assertFinitePositive(data.pessoas, "Número de pessoas", 1)
  let total = 0

  if (data.propriedadeId) {
    const property = store.propriedades.find((p) => p.id === data.propriedadeId)
    if (!property || !property.ativo) throw new Error("Propriedade não encontrada ou indisponível")
    if (people > property.capacidade) throw new Error("Número de pessoas excede a capacidade da propriedade")
    total += property.preco * people * nightsBetween(data.dataInicio, data.dataFim)
  }

  if (data.atividadeId) {
    const activity = store.atividades.find((a) => a.id === data.atividadeId)
    if (!activity || !activity.ativo) throw new Error("Atividade não encontrada ou indisponível")
    if (people > activity.vagas) throw new Error("Número de pessoas excede as vagas da atividade")

    if (activity.propriedadeId) {
      const property = store.propriedades.find((p) => p.id === activity.propriedadeId)
      if (!property || !property.ativo) throw new Error("A propriedade da atividade está indisponível")
    }
    if (activity.dataEvento && activity.dataEvento !== data.dataInicio) throw new Error("A data da reserva deve coincidir com a data do evento")

    total += activity.preco * people
  }

  if (data.propriedadeId && data.atividadeId) {
    const activity = store.atividades.find((a) => a.id === data.atividadeId)
    if (activity && activity.propriedadeId !== data.propriedadeId) {
      throw new Error("A atividade não pertence à propriedade selecionada")
    }
  }

  return Number(total.toFixed(2))
}

function validateReservationConflicts(store: Store, reservation: Reserva, ignoreId?: string): void {
  if (reservation.status === "cancelada") return

  if (reservation.propriedadeId) {
    const property = store.propriedades.find((p) => p.id === reservation.propriedadeId)
    if (!property) throw new Error("Propriedade da reserva não encontrada")

    const blockedDates = new Set(store.bloqueios[property.id] || [])
    const start = parseDate(reservation.dataInicio).getTime()
    const end = reservation.dataFim ? parseDate(reservation.dataFim).getTime() : start + 86400000
    for (const blockedDate of blockedDates) {
      const blockedStart = parseDate(blockedDate).getTime()
      if (blockedStart >= start && blockedStart < end) {
        throw new Error("A propriedade está bloqueada em uma das datas selecionadas")
      }
    }

    const occupied = store.reservas
      .filter((r) => r.id !== ignoreId && isActiveReservation(r) && r.propriedadeId === reservation.propriedadeId)
      .filter((r) => rangesOverlap(r.dataInicio, r.dataFim, reservation.dataInicio, reservation.dataFim))
      .reduce((sum, r) => sum + r.pessoas, 0)

    if (occupied + reservation.pessoas > property.capacidade) {
      throw new Error("Não há capacidade disponível para essas datas")
    }
  }

  if (reservation.atividadeId) {
    const activity = store.atividades.find((a) => a.id === reservation.atividadeId)
    if (!activity) throw new Error("Atividade da reserva não encontrada")

    const used = store.reservas
      .filter((r) => r.id !== ignoreId && isActiveReservation(r) && r.atividadeId === reservation.atividadeId)
      .filter((r) => r.dataInicio === reservation.dataInicio)
      .reduce((sum, r) => sum + r.pessoas, 0)

    if (used + reservation.pessoas > activity.vagas) {
      throw new Error("Não há vagas suficientes para esta atividade")
    }
  }
}

export function crudPropriedade(id: string | null, dados: Partial<Propriedade>, empreendedorId: string): Propriedade {
  const store = loadStore()
  if (!entrepreneurExists(store, empreendedorId)) throw new Error("Empreendedor não encontrado")

  if (id) {
    const index = store.propriedades.findIndex((p) => p.id === id)
    if (index < 0) throw new Error("Propriedade não encontrada")
    const current = store.propriedades[index]
    assertOwner(current.empreendedorId, empreendedorId, "Você não pode editar esta propriedade")

    const updated: Propriedade = {
      ...current,
      ...dados,
      id: current.id,
      empreendedorId: current.empreendedorId,
      avaliacao: current.avaliacao,
      totalAvaliacoes: current.totalAvaliacoes,
      createdAt: current.createdAt,
      nome: dados.nome?.trim() || current.nome,
      descricao: dados.descricao?.trim() ?? current.descricao,
      endereco: dados.endereco?.trim() ?? current.endereco,
      cidade: dados.cidade?.trim() ?? current.cidade,
      estado: dados.estado?.trim() || current.estado,
      preco: dados.preco === undefined ? current.preco : assertFinitePositive(dados.preco, "Preço"),
      capacidade: dados.capacidade === undefined ? current.capacidade : assertInteger(dados.capacidade, "Capacidade", 1),
      tipo: dados.tipo || current.tipo,
      imagens: dados.imagens ?? current.imagens,
      comodidades: dados.comodidades ?? current.comodidades,
      ativo: dados.ativo ?? current.ativo,
    }

    const activePropertyReservations = store.reservas.filter(
      (r) => r.propriedadeId === current.id && isActiveReservation(r),
    )
    for (const reservation of activePropertyReservations) {
      if (reservation.pessoas > updated.capacidade) {
        throw new Error("A nova capacidade não comporta uma reserva existente")
      }
    }
    for (const reservation of activePropertyReservations) {
      const concurrent = activePropertyReservations
        .filter((other) => other.id !== reservation.id)
        .filter((other) => rangesOverlap(other.dataInicio, other.dataFim, reservation.dataInicio, reservation.dataFim))
        .reduce((sum, other) => sum + other.pessoas, reservation.pessoas)
      if (concurrent > updated.capacidade) {
        throw new Error("A nova capacidade não comporta as reservas existentes para as datas selecionadas")
      }
    }

    store.propriedades[index] = updated
    saveStore(store)
    return updated
  }

  const item: Propriedade = {
    id: newId("prop"),
    empreendedorId,
    nome: dados.nome?.trim() || (() => { throw new Error("Nome da propriedade é obrigatório") })(),
    descricao: dados.descricao?.trim() || "",
    endereco: dados.endereco?.trim() || "",
    cidade: dados.cidade?.trim() || "",
    estado: dados.estado?.trim() || "",
    preco: assertFinitePositive(dados.preco, "Preço"),
    capacidade: assertInteger(dados.capacidade, "Capacidade", 1),
    imagens: dados.imagens?.length ? dados.imagens : ["/placeholder.jpg"],
    comodidades: dados.comodidades ?? [],
    tipo: dados.tipo || "sitio",
    avaliacao: 0,
    totalAvaliacoes: 0,
    ativo: dados.ativo ?? true,
    createdAt: today(),
  }
  store.propriedades.push(item)
  saveStore(store)
  return item
}

export function deletePropriedade(id: string, empreendedorId?: string): boolean {
  const store = loadStore()
  const index = store.propriedades.findIndex((p) => p.id === id)
  if (index < 0) return false
  if (!empreendedorId) throw new Error("Usuário não autenticado")
  assertOwner(store.propriedades[index].empreendedorId, empreendedorId, "Você não pode alterar esta propriedade")

  store.propriedades[index] = { ...store.propriedades[index], ativo: !store.propriedades[index].ativo }
  saveStore(store)
  return true
}

export function crudAtividade(id: string | null, dados: Partial<Atividade>, empreendedorId: string): Atividade {
  const store = loadStore()
  if (!entrepreneurExists(store, empreendedorId)) throw new Error("Empreendedor não encontrado")

  const propriedadeId = dados.propriedadeId
  if (id) {
    const index = store.atividades.findIndex((a) => a.id === id)
    if (index < 0) throw new Error("Atividade não encontrada")
    const current = store.atividades[index]
    assertOwner(current.empreendedorId, empreendedorId, "Você não pode editar esta atividade")

    const updated: Atividade = {
      ...current,
      ...dados,
      id: current.id,
      empreendedorId: current.empreendedorId,
      propriedadeId: propriedadeId ?? current.propriedadeId,
      createdAt: current.createdAt,
      nome: dados.nome?.trim() || current.nome,
      descricao: dados.descricao?.trim() ?? current.descricao,
      preco: dados.preco === undefined ? current.preco : assertFinitePositive(dados.preco, "Preço"),
      vagas: dados.vagas === undefined ? current.vagas : assertInteger(dados.vagas, "Vagas", 1),
      ativo: dados.ativo ?? current.ativo,
    }

    const activeActivityReservations = store.reservas.filter(
      (r) => r.atividadeId === current.id && isActiveReservation(r),
    )
    if (updated.dataEvento !== current.dataEvento && activeActivityReservations.length > 0) {
      throw new Error("Não é possível alterar a data de uma atividade que já possui reservas ativas")
    }
    if (activeActivityReservations.some((r) => r.pessoas > updated.vagas)) {
      throw new Error("As novas vagas não comportam uma reserva existente")
    }
    const reservedPeople = activeActivityReservations.reduce((sum, r) => sum + r.pessoas, 0)
    if (reservedPeople > updated.vagas) {
      throw new Error("As novas vagas não comportam as reservas existentes")
    }
    if (updated.dataEvento) {
      const eventDate = parseDate(updated.dataEvento)
      if (eventDate.getTime() < parseDate(today()).getTime()) throw new Error("A data da atividade não pode estar no passado")
    }

    const property = store.propriedades.find((p) => p.id === updated.propriedadeId)
    if (!property || property.empreendedorId !== empreendedorId) throw new Error("A atividade deve pertencer a uma propriedade sua")
    if (!property.ativo && updated.ativo) throw new Error("Não é possível publicar atividade em propriedade inativa")

    store.atividades[index] = updated
    saveStore(store)
    return updated
  }

  const propertyId = propriedadeId || store.propriedades.find((p) => p.empreendedorId === empreendedorId)?.id
  if (!propertyId) throw new Error("Cadastre uma propriedade antes de criar uma atividade")
  const property = store.propriedades.find((p) => p.id === propertyId)
  if (!property || property.empreendedorId !== empreendedorId) throw new Error("A atividade deve pertencer a uma propriedade sua")
  if (!property.ativo) throw new Error("A atividade só pode ser criada em uma propriedade ativa")
  if (dados.dataEvento) {
    const eventDate = parseDate(dados.dataEvento)
    if (eventDate.getTime() < parseDate(today()).getTime()) throw new Error("A data da atividade não pode estar no passado")
  }

  const item: Atividade = {
    id: newId("ativ"),
    empreendedorId,
    propriedadeId: propertyId,
    nome: dados.nome?.trim() || (() => { throw new Error("Nome da atividade é obrigatório") })(),
    descricao: dados.descricao?.trim() || "",
    tipo: dados.tipo || "passeio",
    preco: assertFinitePositive(dados.preco, "Preço"),
    duracao: dados.duracao?.trim() || "1 hora",
    vagas: assertInteger(dados.vagas, "Vagas", 1),
    imagem: dados.imagem || "/placeholder.jpg",
    dataEvento: dados.dataEvento || undefined,
    horario: dados.horario || undefined,
    inclui: dados.inclui ?? [],
    requisitos: dados.requisitos ?? [],
    ativo: dados.ativo ?? true,
    createdAt: today(),
  }
  store.atividades.push(item)
  saveStore(store)
  return item
}

export function deleteAtividade(id: string, empreendedorId?: string): boolean {
  const store = loadStore()
  const index = store.atividades.findIndex((a) => a.id === id)
  if (index < 0) return false
  if (!empreendedorId) throw new Error("Usuário não autenticado")
  assertOwner(store.atividades[index].empreendedorId, empreendedorId, "Você não pode alterar esta atividade")
  store.atividades[index] = { ...store.atividades[index], ativo: !store.atividades[index].ativo }
  saveStore(store)
  return true
}

export function crudReserva(id: string | null, dados: Partial<Reserva>, usuarioId: string): Reserva {
  const store = loadStore()

  if (id) {
    const index = store.reservas.findIndex((r) => r.id === id)
    if (index < 0) throw new Error("Reserva não encontrada")
    const current = store.reservas[index]

    const property = current.propriedadeId ? store.propriedades.find((p) => p.id === current.propriedadeId) : undefined
    const activity = current.atividadeId ? store.atividades.find((a) => a.id === current.atividadeId) : undefined
    const isVisitor = current.usuarioId === usuarioId
    const isOwner = property?.empreendedorId === usuarioId || activity?.empreendedorId === usuarioId
    if (!isVisitor && !isOwner) throw new Error("Você não pode alterar esta reserva")

    const allowed: Partial<Reserva> = isVisitor
      ? { status: dados.status === "cancelada" ? "cancelada" : current.status }
      : { status: dados.status ?? current.status }

    if (isVisitor && dados.status && dados.status !== "cancelada" && dados.status !== current.status) {
      throw new Error("O visitante só pode cancelar a própria reserva")
    }
    if (isOwner) {
      const nextStatus = dados.status ?? current.status
      if (current.status === "cancelada" && nextStatus !== "cancelada") throw new Error("Uma reserva cancelada não pode ser reaberta")
      if (current.status === "concluida" && nextStatus !== "concluida") throw new Error("Uma reserva concluída não pode ser alterada")
      if (nextStatus === "concluida" && current.status !== "confirmada" && current.status !== "concluida") throw new Error("Apenas reservas confirmadas podem ser concluídas")
    }

    const updated: Reserva = {
      ...current,
      ...allowed,
      id: current.id,
      usuarioId: current.usuarioId,
      propriedadeId: current.propriedadeId,
      atividadeId: current.atividadeId,
      dataInicio: current.dataInicio,
      dataFim: current.dataFim,
      pessoas: current.pessoas,
      valorTotal: current.valorTotal,
      createdAt: current.createdAt,
    }

    validateReservationConflicts(store, updated, current.id)
    store.reservas[index] = updated
    saveStore(store)
    return updated
  }

  if (!visitorExists(store, usuarioId)) throw new Error("Somente visitantes podem criar reservas")
  if (!dados.propriedadeId && !dados.atividadeId) throw new Error("Informe uma propriedade ou atividade")
  if (!dados.dataInicio) throw new Error("Informe a data da reserva")
  const start = parseDate(dados.dataInicio)
  if (start.getTime() < parseDate(today()).getTime()) throw new Error("A data da reserva não pode estar no passado")
  if (dados.dataFim && dados.dataFim <= dados.dataInicio) throw new Error("A data de saída deve ser posterior à entrada")

  const pessoas = assertInteger(dados.pessoas, "Número de pessoas", 1)
  const total = calculateReservationTotal(store, {
    propriedadeId: dados.propriedadeId,
    atividadeId: dados.atividadeId,
    dataInicio: dados.dataInicio,
    dataFim: dados.dataFim,
    pessoas,
  })

  const item: Reserva = {
    id: newId("res"),
    usuarioId,
    propriedadeId: dados.propriedadeId,
    atividadeId: dados.atividadeId,
    dataInicio: dados.dataInicio,
    dataFim: dados.dataFim || undefined,
    pessoas,
    valorTotal: total,
    status: "pendente",
    metodoPagamento: undefined,
    observacoes: dados.observacoes?.trim() || undefined,
    createdAt: today(),
  }

  validateReservationConflicts(store, item)
  store.reservas.push(item)
  saveStore(store)
  return item
}

export function pagarReserva(id: string, usuarioId: string, metodoPagamento: Reserva["metodoPagamento"]): Reserva {
  const store = loadStore()
  const index = store.reservas.findIndex((r) => r.id === id)
  if (index < 0) throw new Error("Reserva não encontrada")
  const current = store.reservas[index]
  if (current.usuarioId !== usuarioId) throw new Error("Você não pode pagar esta reserva")
  if (current.status !== "pendente") throw new Error("Esta reserva não está aguardando pagamento")
  if (parseDate(current.dataInicio).getTime() < parseDate(today()).getTime()) throw new Error("Não é possível pagar uma reserva com data já iniciada")
  if (!metodoPagamento) throw new Error("Informe a forma de pagamento")
  validateReservationConflicts(store, { ...current, status: "confirmada" })
  const updated = { ...current, metodoPagamento, status: "confirmada" as const }
  store.reservas[index] = updated
  saveStore(store)
  return updated
}

export function deleteReserva(id: string, usuarioId?: string): boolean {
  const store = loadStore()
  const index = store.reservas.findIndex((r) => r.id === id)
  if (index < 0) return false
  if (!usuarioId) throw new Error("Usuário não autenticado")

  const current = store.reservas[index]
  const property = current.propriedadeId ? store.propriedades.find((p) => p.id === current.propriedadeId) : undefined
  const activity = current.atividadeId ? store.atividades.find((a) => a.id === current.atividadeId) : undefined
  const canDelete = current.usuarioId === usuarioId || property?.empreendedorId === usuarioId || activity?.empreendedorId === usuarioId
  if (!canDelete) throw new Error("Você não pode excluir esta reserva")

  store.reservas.splice(index, 1)
  saveStore(store)
  return true
}

export function crudMensagem(id: string | null, dados: Partial<Mensagem>, remetenteId: string): Mensagem {
  const store = loadStore()
  if (!accountExists(store, remetenteId)) throw new Error("Usuário não encontrado")

  if (id) {
    const index = store.mensagens.findIndex((m) => m.id === id)
    if (index < 0) throw new Error("Mensagem não encontrada")
    const current = store.mensagens[index]
    if (current.remetenteId !== remetenteId) throw new Error("Somente o remetente pode editar a mensagem")

    const recipientExists = store.usuarios.some((u) => u.id === current.destinatarioId) || store.empreendedores.some((e) => e.id === current.destinatarioId)
    if (!recipientExists) throw new Error("Destinatário não encontrado")

    const updated: Mensagem = {
      ...current,
      assunto: dados.assunto?.trim() || current.assunto,
      conteudo: dados.conteudo?.trim() || current.conteudo,
      lida: current.lida,
      destinatarioId: current.destinatarioId,
    }
    store.mensagens[index] = updated
    saveStore(store)
    return updated
  }

  if (!dados.destinatarioId || dados.destinatarioId === remetenteId) throw new Error("Informe um destinatário válido")
  const recipientExists = store.usuarios.some((u) => u.id === dados.destinatarioId) || store.empreendedores.some((e) => e.id === dados.destinatarioId)
  if (!recipientExists) throw new Error("Destinatário não encontrado")
  if (!dados.conteudo?.trim()) throw new Error("A mensagem não pode estar vazia")

  const item: Mensagem = {
    id: newId("msg"),
    remetenteId,
    destinatarioId: dados.destinatarioId,
    assunto: dados.assunto?.trim() || "Sem assunto",
    conteudo: dados.conteudo.trim(),
    lida: false,
    createdAt: today(),
  }
  store.mensagens.push(item)
  saveStore(store)
  return item
}

export function deleteMensagem(id: string, usuarioId?: string): boolean {
  const store = loadStore()
  const index = store.mensagens.findIndex((m) => m.id === id)
  if (index < 0) return false
  if (!usuarioId) throw new Error("Usuário não autenticado")
  const current = store.mensagens[index]
  if (current.remetenteId !== usuarioId && current.destinatarioId !== usuarioId) throw new Error("Você não pode excluir esta mensagem")
  store.mensagens.splice(index, 1)
  saveStore(store)
  return true
}

export function marcarLida(id: string, usuarioId?: string): boolean {
  const store = loadStore()
  const index = store.mensagens.findIndex((m) => m.id === id)
  if (index < 0) return false
  if (!usuarioId) throw new Error("Usuário não autenticado")
  if (store.mensagens[index].destinatarioId !== usuarioId) throw new Error("Você não pode marcar esta mensagem")
  store.mensagens[index] = { ...store.mensagens[index], lida: true }
  saveStore(store)
  return true
}

export function crudAvaliacao(id: string | null, dados: Partial<Avaliacao>, usuarioId: string): Avaliacao {
  const store = loadStore()
  if (!visitorExists(store, usuarioId)) throw new Error("Somente visitantes podem avaliar destinos")

  const resolvePropertyId = (propertyId?: string, activityId?: string): string | undefined => {
    if (propertyId) {
      const property = store.propriedades.find((p) => p.id === propertyId && p.ativo)
      if (!property) throw new Error("Propriedade não encontrada ou indisponível")
      return property.id
    }
    if (activityId) {
      const activity = store.atividades.find((a) => a.id === activityId && a.ativo)
      if (!activity) throw new Error("Atividade não encontrada ou indisponível")
      return activity.propriedadeId
    }
    throw new Error("Informe uma propriedade ou atividade")
  }

  if (id) {
    const index = store.avaliacoes.findIndex((a) => a.id === id)
    if (index < 0) throw new Error("Avaliação não encontrada")
    const current = store.avaliacoes[index]
    if (current.usuarioId !== usuarioId) throw new Error("Você não pode editar esta avaliação")

    const newPropertyId = resolvePropertyId(dados.propriedadeId ?? current.propriedadeId, dados.atividadeId ?? current.atividadeId)
    const duplicate = store.avaliacoes.some((a) => a.id !== id && a.usuarioId === usuarioId && (a.propriedadeId || a.atividadeId) === newPropertyId)
    if (duplicate) throw new Error("Você já avaliou este destino")

    const updated: Avaliacao = {
      ...current,
      ...dados,
      id: current.id,
      usuarioId: current.usuarioId,
      createdAt: current.createdAt,
      nota: Math.round(Math.min(5, Math.max(1, Number(dados.nota ?? current.nota) || 1))),
      comentario: dados.comentario?.trim() ?? current.comentario,
    }
    store.avaliacoes[index] = updated
    recalcRatings(store, current.propriedadeId)
    recalcRatings(store, resolvePropertyId(updated.propriedadeId, updated.atividadeId))
    saveStore(store)
    return updated
  }

  const propertyId = resolvePropertyId(dados.propriedadeId, dados.atividadeId)
  const completedReservation = store.reservas.some((r) =>
    r.usuarioId === usuarioId &&
    r.status === "concluida" &&
    ((propertyId && r.propriedadeId === propertyId) || (dados.atividadeId && r.atividadeId === dados.atividadeId))
  )
  if (!completedReservation) throw new Error("Você só pode avaliar um destino após concluir uma reserva")
  const alreadyReviewed = store.avaliacoes.some((a) => a.usuarioId === usuarioId && (a.propriedadeId || a.atividadeId) === propertyId)
  if (alreadyReviewed) throw new Error("Você já avaliou este destino")

  const item: Avaliacao = {
    id: newId("aval"),
    usuarioId,
    propriedadeId: dados.propriedadeId || propertyId,
    atividadeId: dados.atividadeId,
    nota: Math.round(Math.min(5, Math.max(1, Number(dados.nota) || 1))),
    comentario: dados.comentario?.trim() || "",
    createdAt: today(),
  }
  store.avaliacoes.push(item)
  recalcRatings(store, propertyId)
  saveStore(store)
  return item
}

export function deleteAvaliacao(id: string, usuarioId?: string): boolean {
  const store = loadStore()
  const index = store.avaliacoes.findIndex((a) => a.id === id)
  if (index < 0) return false
  if (!usuarioId) throw new Error("Usuário não autenticado")
  if (store.avaliacoes[index].usuarioId !== usuarioId) throw new Error("Você não pode excluir esta avaliação")
  const current = store.avaliacoes[index]
  store.avaliacoes.splice(index, 1)
  recalcRatings(store, current.propriedadeId)
  if (current.atividadeId) {
    const activity = store.atividades.find((a) => a.id === current.atividadeId)
    recalcRatings(store, activity?.propriedadeId)
  }
  saveStore(store)
  return true
}

function recalcRatings(store: Store, propertyId?: string): void {
  if (!propertyId) return
  const property = store.propriedades.find((p) => p.id === propertyId)
  if (!property) return
  const ratings = store.avaliacoes.filter((a) => a.propriedadeId === propertyId || (a.atividadeId && store.atividades.find((x) => x.id === a.atividadeId)?.propriedadeId === propertyId))
  property.totalAvaliacoes = ratings.length
  property.avaliacao = ratings.length ? Number((ratings.reduce((sum, rating) => sum + rating.nota, 0) / ratings.length).toFixed(1)) : 0
}

export function toggleFavorito(usuarioId: string, propriedadeId: string): void {
  const store = loadStore()
  if (!visitorExists(store, usuarioId)) throw new Error("Somente visitantes podem favoritar propriedades")
  const property = store.propriedades.find((p) => p.id === propriedadeId && p.ativo)
  if (!property) throw new Error("Propriedade não encontrada ou indisponível")

  const index = store.favoritos.findIndex((favorite) => favorite.usuarioId === usuarioId && favorite.propriedadeId === propriedadeId)
  if (index >= 0) store.favoritos.splice(index, 1)
  else store.favoritos.push({ id: newId("fav"), usuarioId, propriedadeId, createdAt: today() })
  saveStore(store)
}

export function upsertUsuario(usuario: Usuario): void {
  const store = loadStore()
  const email = normalizeEmail(usuario.email)
  const duplicate = store.empreendedores.some((e) => normalizeEmail(e.email) === email && e.id !== usuario.id)
    || store.usuarios.some((u) => normalizeEmail(u.email) === email && u.id !== usuario.id)
  if (duplicate) throw new Error("E-mail já cadastrado")
  const index = store.usuarios.findIndex((u) => u.id === usuario.id)
  if (index >= 0) store.usuarios[index] = usuario
  else store.usuarios.push(usuario)
  saveStore(store)
}

export function upsertEmpreendedor(empreendedor: Empreendedor): void {
  const store = loadStore()
  const email = normalizeEmail(empreendedor.email)
  const duplicate = store.empreendedores.some((e) => normalizeEmail(e.email) === email && e.id !== empreendedor.id)
    || store.usuarios.some((u) => normalizeEmail(u.email) === email && u.id !== empreendedor.id)
  if (duplicate) throw new Error("E-mail já cadastrado")
  const index = store.empreendedores.findIndex((e) => e.id === empreendedor.id)
  if (index >= 0) store.empreendedores[index] = empreendedor
  else store.empreendedores.push(empreendedor)
  saveStore(store)
}

export function getAllAccounts(): Array<Usuario | Empreendedor> {
  const store = loadStore()
  return [...store.usuarios, ...store.empreendedores]
}


export function toggleBloqueio(empreendedorId: string, propriedadeId: string, date: string): boolean {
  const store = loadStore()
  if (!entrepreneurExists(store, empreendedorId)) throw new Error("Empreendedor não encontrado")
  const property = store.propriedades.find((p) => p.id === propriedadeId)
  if (!property) throw new Error("Propriedade não encontrada")
  assertOwner(property.empreendedorId, empreendedorId, "Você não pode alterar esta propriedade")
  parseDate(date)
  const dates = new Set(store.bloqueios[propriedadeId] || [])
  if (dates.has(date)) dates.delete(date)
  else dates.add(date)
  store.bloqueios[propriedadeId] = [...dates].sort()
  saveStore(store)
  return dates.has(date)
}
