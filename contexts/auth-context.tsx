"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Usuario, Empreendedor } from "@/lib/types"
import { loadStore, saveStore, upsertEmpreendedor, upsertUsuario } from "@/lib/client-store"

type UserType = Usuario | Empreendedor | null

interface AuthContextType {
  user: UserType
  userType: "visitante" | "empreendedor" | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, senha: string, remember?: boolean) => Promise<{ success: boolean; message: string; userType?: string }>
  logout: () => void
  register: (dados: RegisterData) => Promise<{ success: boolean; message: string }>
  updateProfile: (dados: Partial<Usuario> | Partial<Empreendedor>) => { success: boolean; message: string }
  changePassword: (current: string, next: string) => { success: boolean; message: string }
  deleteAccount: () => { success: boolean; message: string }
}

interface RegisterData {
  nome: string
  email: string
  senha: string
  telefone: string
  cpf: string
  tipo: "visitante" | "empreendedor"
  nomeEmpresa?: string
  cnpj?: string
  endereco?: string
  cidade?: string
  estado?: string
  descricao?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const PASSWORDS_KEY = "turismo_rural_passwords_v1"
const SESSION_KEY = "turismo_rural_user"
const SESSION_TYPE_KEY = "turismo_rural_user_type"

function readPasswords(): Record<string, string> {
  if (typeof window === "undefined") return {}
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PASSWORDS_KEY) || "{}")
    return parsed && typeof parsed === "object" ? parsed as Record<string, string> : {}
  } catch {
    return {}
  }
}

function writePassword(email: string, senha: string) {
  const passwords = readPasswords()
  passwords[email.trim().toLowerCase()] = senha
  window.localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords))
}

function saveSession(account: Usuario | Empreendedor, remember = true) {
  const storage = remember ? localStorage : sessionStorage
  const otherStorage = remember ? sessionStorage : localStorage
  otherStorage.removeItem(SESSION_KEY)
  otherStorage.removeItem(SESSION_TYPE_KEY)
  storage.setItem(SESSION_KEY, JSON.stringify(account))
  storage.setItem(SESSION_TYPE_KEY, account.tipo)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType>(null)
  const [userType, setUserType] = useState<"visitante" | "empreendedor" | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storage = localStorage.getItem(SESSION_KEY) ? localStorage : sessionStorage
      const savedUserRaw = storage.getItem(SESSION_KEY)
      if (savedUserRaw) {
        const savedUser = JSON.parse(savedUserRaw) as Usuario | Empreendedor
        const account = loadStore()
        const current = [...account.usuarios, ...account.empreendedores].find((item) => item.id === savedUser.id)
        if (current) {
          setUser(current)
          setUserType(current.tipo)
        } else {
          localStorage.removeItem(SESSION_KEY)
          localStorage.removeItem(SESSION_TYPE_KEY)
          sessionStorage.removeItem(SESSION_KEY)
          sessionStorage.removeItem(SESSION_TYPE_KEY)
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY)
      localStorage.removeItem(SESSION_TYPE_KEY)
      sessionStorage.removeItem(SESSION_KEY)
      sessionStorage.removeItem(SESSION_TYPE_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, senha: string, remember = true) => {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const normalized = email.trim().toLowerCase()
    if (!normalized || !senha) return { success: false, message: "Informe e-mail e senha" }

    const store = loadStore()
    const account = [...store.usuarios, ...store.empreendedores].find((item) => item.email.trim().toLowerCase() === normalized)
    if (!account) return { success: false, message: "E-mail não cadastrado" }

    const passwords = readPasswords()
    const senhaCorreta = passwords[normalized] || "123456"
    if (senhaCorreta !== senha) return { success: false, message: "Senha incorreta" }

    setUser(account)
    setUserType(account.tipo)
    saveSession(account, remember)
    return { success: true, message: "Login realizado com sucesso!", userType: account.tipo }
  }

  const logout = () => {
    setUser(null)
    setUserType(null)
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(SESSION_TYPE_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_TYPE_KEY)
  }

  const updateProfile = (dados: Partial<Usuario> | Partial<Empreendedor>) => {
    if (!user) return { success: false, message: "Usuário não autenticado" }
    try {
      const store = loadStore()
      if (user.tipo === "empreendedor") {
        const current = store.empreendedores.find((e) => e.id === user.id)
        if (!current) throw new Error("Conta não encontrada")
        const updated = { ...current, ...dados, id: current.id, tipo: "empreendedor" as const, email: current.email, cpf: current.cpf }
        upsertEmpreendedor(updated)
        setUser(updated)
        saveSession(updated, localStorage.getItem(SESSION_KEY) !== null)
      } else {
        const current = store.usuarios.find((u) => u.id === user.id)
        if (!current) throw new Error("Conta não encontrada")
        const updated = { ...current, ...dados, id: current.id, tipo: "visitante" as const, email: current.email, cpf: current.cpf }
        upsertUsuario(updated)
        setUser(updated)
        saveSession(updated, localStorage.getItem(SESSION_KEY) !== null)
      }
      return { success: true, message: "Dados atualizados com sucesso." }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : "Não foi possível atualizar os dados." }
    }
  }

  const changePassword = (currentPassword: string, nextPassword: string) => {
    if (!user) return { success: false, message: "Usuário não autenticado" }
    if (nextPassword.length < 8 || !/[A-Z]/.test(nextPassword) || !/[0-9]/.test(nextPassword) || !/[^A-Za-z0-9]/.test(nextPassword)) {
      return { success: false, message: "A nova senha deve ter 8+ caracteres, maiúscula, número e símbolo." }
    }
    const passwords = readPasswords()
    const key = user.email.trim().toLowerCase()
    const actual = passwords[key] || "123456"
    if (actual !== currentPassword) return { success: false, message: "Senha atual incorreta." }
    writePassword(key, nextPassword)
    return { success: true, message: "Senha alterada com sucesso." }
  }

  const deleteAccount = () => {
    if (!user) return { success: false, message: "Usuário não autenticado" }
    const store = loadStore()
    const propertyIds = new Set(store.propriedades.filter((p) => p.empreendedorId === user.id).map((p) => p.id))
    store.usuarios = store.usuarios.filter((u) => u.id !== user.id)
    store.empreendedores = store.empreendedores.filter((e) => e.id !== user.id)
    store.propriedades = store.propriedades.filter((p) => p.empreendedorId !== user.id)
    store.atividades = store.atividades.filter((a) => a.empreendedorId !== user.id && !propertyIds.has(a.propriedadeId))
    store.reservas = store.reservas.filter((r) => r.usuarioId !== user.id)
    store.favoritos = store.favoritos.filter((f) => f.usuarioId !== user.id)
    store.avaliacoes = store.avaliacoes.filter((a) => a.usuarioId !== user.id)
    store.mensagens = store.mensagens.filter((m) => m.remetenteId !== user.id && m.destinatarioId !== user.id)
    saveStore(store)
    const passwords = readPasswords()
    delete passwords[user.email.trim().toLowerCase()]
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords))
    logout()
    return { success: true, message: "Conta excluída." }
  }

  const register = async (dados: RegisterData) => {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const nome = dados.nome.trim()
    const email = dados.email.trim().toLowerCase()
    const senha = dados.senha
    if (!nome || !email) return { success: false, message: "Preencha os dados obrigatórios." }
    if (senha.length < 8 || !/[A-Z]/.test(senha) || !/[0-9]/.test(senha) || !/[^A-Za-z0-9]/.test(senha)) {
      return { success: false, message: "A senha deve ter 8+ caracteres, maiúscula, número e símbolo." }
    }

    const store = loadStore()
    const emailExiste = [...store.usuarios, ...store.empreendedores].some((item) => item.email.trim().toLowerCase() === email)
    if (emailExiste) return { success: false, message: "E-mail já cadastrado" }

    const idPrefix = dados.tipo === "visitante" ? "user" : "emp"
    const novoId = `${idPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const createdAt = new Date().toISOString().slice(0, 10)

    if (dados.tipo === "visitante") {
      const novoUsuario: Usuario = {
        id: novoId,
        nome,
        email,
        telefone: dados.telefone.trim(),
        cpf: dados.cpf.trim(),
        tipo: "visitante",
        createdAt,
      }
      upsertUsuario(novoUsuario)
      writePassword(email, senha)
      setUser(novoUsuario)
      setUserType("visitante")
      saveSession(novoUsuario, true)
    } else {
      if (!dados.nomeEmpresa?.trim()) return { success: false, message: "Informe o nome da empresa." }
      const novoEmpreendedor: Empreendedor = {
        id: novoId,
        nome,
        email,
        telefone: dados.telefone.trim(),
        cpf: dados.cpf.trim(),
        tipo: "empreendedor",
        nomeEmpresa: dados.nomeEmpresa.trim(),
        cnpj: dados.cnpj?.trim() || "",
        endereco: dados.endereco?.trim() || "",
        cidade: dados.cidade?.trim() || "",
        estado: dados.estado?.trim() || "",
        descricao: dados.descricao?.trim() || "",
        createdAt,
      }
      upsertEmpreendedor(novoEmpreendedor)
      writePassword(email, senha)
      setUser(novoEmpreendedor)
      setUserType("empreendedor")
      saveSession(novoEmpreendedor, true)
    }

    return { success: true, message: "Cadastro realizado com sucesso!" }
  }

  return <AuthContext.Provider value={{ user, userType, isAuthenticated: !!user, isLoading, login, logout, register, updateProfile, changePassword, deleteAccount }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  return context
}
