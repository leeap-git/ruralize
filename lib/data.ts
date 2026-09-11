// Dados mockados para o protótipo de Ruralize

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

// Usuários
export const usuarios: Usuario[] = [
  {
    id: "user-1",
    nome: "Maria Silva",
    email: "maria@email.com",
    telefone: "(14) 99999-1111",
    cpf: "123.456.789-00",
    tipo: "visitante",
    avatar: "/placeholder-user.jpg",
    createdAt: "2024-01-15"
  },
  {
    id: "user-2",
    nome: "João Santos",
    email: "joao@email.com",
    telefone: "(14) 99999-2222",
    cpf: "987.654.321-00",
    tipo: "visitante",
    createdAt: "2024-02-20"
  },
  {
    id: "user-3",
    nome: "Ana Costa",
    email: "ana@email.com",
    telefone: "(14) 99999-3333",
    cpf: "456.789.123-00",
    tipo: "visitante",
    createdAt: "2024-03-10"
  }
]

// Empreendedores
export const empreendedores: Empreendedor[] = [
  {
    id: "emp-1",
    nome: "Carlos Fazendeiro",
    email: "carlos@fazendaboavista.com",
    telefone: "(14) 99888-1111",
    cpf: "111.222.333-44",
    tipo: "empreendedor",
    nomeEmpresa: "Fazenda Boa Vista",
    cnpj: "12.345.678/0001-90",
    endereco: "Estrada Rural km 15",
    cidade: "Ourinhos",
    estado: "SP",
    descricao: "Propriedade rural familiar com mais de 50 anos de tradição",
    createdAt: "2024-01-01"
  },
  {
    id: "emp-2",
    nome: "Fernanda Rural",
    email: "fernanda@sitiosaojoao.com",
    telefone: "(14) 99888-2222",
    cpf: "222.333.444-55",
    tipo: "empreendedor",
    nomeEmpresa: "Sítio São João",
    cnpj: "98.765.432/0001-10",
    endereco: "Rodovia SP-270 km 42",
    cidade: "Assis",
    estado: "SP",
    descricao: "Experiências autênticas no campo paulista",
    createdAt: "2024-01-10"
  },
  {
    id: "emp-3",
    nome: "Roberto Campo",
    email: "roberto@recantoverde.com",
    telefone: "(14) 99888-3333",
    cpf: "333.444.555-66",
    tipo: "empreendedor",
    nomeEmpresa: "Recanto Verde",
    cnpj: "11.222.333/0001-44",
    endereco: "Estrada Municipal s/n",
    cidade: "Marília",
    estado: "SP",
    descricao: "Turismo ecológico e sustentável",
    createdAt: "2024-02-01"
  }
]

// Propriedades
export const propriedades: Propriedade[] = [
  {
    id: "prop-1",
    empreendedorId: "emp-1",
    nome: "Fazenda Boa Vista",
    descricao: "Uma autêntica fazenda paulista com mais de 50 anos de história. Aqui você encontra o verdadeiro sossego do campo, com paisagens deslumbrantes, animais da fazenda e a hospitalidade típica do interior. Perfeito para famílias que buscam reconexão com a natureza.",
    endereco: "Estrada Rural km 15",
    cidade: "Ourinhos",
    estado: "SP",
    preco: 350,
    capacidade: 20,
    imagens: [
      "/images/fazenda-boa-vista.jpg",
      "/images/fazenda-boa-vista.jpg",
      "/images/fazenda-boa-vista.jpg"
    ],
    comodidades: ["Wi-Fi", "Piscina", "Churrasqueira", "Estacionamento", "Café da manhã", "Trilhas"],
    tipo: "fazenda",
    avaliacao: 4.8,
    totalAvaliacoes: 127,
    ativo: true,
    createdAt: "2024-01-01"
  },
  {
    id: "prop-2",
    empreendedorId: "emp-2",
    nome: "Sítio São João",
    descricao: "Sítio aconchegante em meio à natureza exuberante. Oferecemos experiências únicas como ordenha, colheita de frutas orgânicas e passeios a cavalo. Ideal para quem busca tranquilidade e contato direto com a vida rural.",
    endereco: "Rodovia SP-270 km 42",
    cidade: "Assis",
    estado: "SP",
    preco: 280,
    capacidade: 12,
    imagens: [
      "/images/sitio-sao-joao.jpg",
      "/images/sitio-sao-joao.jpg",
      "/images/sitio-sao-joao.jpg"
    ],
    comodidades: ["Wi-Fi", "Churrasqueira", "Estacionamento", "Animais", "Horta orgânica"],
    tipo: "sitio",
    avaliacao: 4.6,
    totalAvaliacoes: 89,
    ativo: true,
    createdAt: "2024-01-10"
  },
  {
    id: "prop-3",
    empreendedorId: "emp-3",
    nome: "Recanto Verde Eco Resort",
    descricao: "Resort ecológico com foco em sustentabilidade e bem-estar. Nossas instalações utilizam energia solar e água de nascente. Oferecemos trilhas ecológicas, observação de pássaros e oficinas de educação ambiental.",
    endereco: "Estrada Municipal s/n",
    cidade: "Marília",
    estado: "SP",
    preco: 420,
    capacidade: 30,
    imagens: [
      "/images/recanto-verde.jpg",
      "/images/recanto-verde.jpg",
      "/images/recanto-verde.jpg"
    ],
    comodidades: ["Wi-Fi", "Piscina natural", "Spa", "Restaurante", "Trilhas ecológicas", "Observatório"],
    tipo: "pousada",
    avaliacao: 4.9,
    totalAvaliacoes: 203,
    ativo: true,
    createdAt: "2024-02-01"
  },
  {
    id: "prop-4",
    empreendedorId: "emp-1",
    nome: "Camping Estrela do Campo",
    descricao: "Área de camping com toda infraestrutura necessária para uma experiência inesquecível sob as estrelas. Banheiros limpos, cozinha comunitária e fogueira para momentos especiais.",
    endereco: "Estrada Rural km 18",
    cidade: "Ourinhos",
    estado: "SP",
    preco: 80,
    capacidade: 50,
    imagens: [
      "/images/camping-estrela.jpg",
      "/images/camping-estrela.jpg"
    ],
    comodidades: ["Banheiros", "Cozinha comunitária", "Churrasqueira", "Estacionamento"],
    tipo: "camping",
    avaliacao: 4.4,
    totalAvaliacoes: 56,
    ativo: true,
    createdAt: "2024-03-01"
  },
  {
    id: "prop-5",
    empreendedorId: "emp-2",
    nome: "Chácara Recanto Feliz",
    descricao: "Chácara familiar perfeita para fins de semana relaxantes. Com lago para pesca, pomar variado e muito espaço para as crianças brincarem. Aluguel para grupos e famílias.",
    endereco: "Estrada Vicinal km 8",
    cidade: "Assis",
    estado: "SP",
    preco: 450,
    capacidade: 15,
    imagens: [
      "/images/chacara-recanto.jpg",
      "/images/chacara-recanto.jpg",
      "/images/chacara-recanto.jpg"
    ],
    comodidades: ["Piscina", "Churrasqueira", "Lago para pesca", "Pomar", "Playground"],
    tipo: "chacara",
    avaliacao: 4.7,
    totalAvaliacoes: 78,
    ativo: true,
    createdAt: "2024-03-15"
  }
]

// Atividades
export const atividades: Atividade[] = [
  {
    id: "ativ-1",
    propriedadeId: "prop-1",
    empreendedorId: "emp-1",
    nome: "Passeio a Cavalo",
    descricao: "Explore as trilhas da fazenda em um relaxante passeio a cavalo. Guia experiente acompanha todo o percurso. Ideal para iniciantes e praticantes.",
    tipo: "passeio",
    preco: 120,
    duracao: "2 horas",
    vagas: 8,
    imagem: "/images/ativ-cavalo.jpg",
    horario: "09:00 e 15:00",
    inclui: ["Cavalo", "Equipamentos de segurança", "Guia especializado", "Água"],
    requisitos: ["Idade mínima: 8 anos", "Peso máximo: 100kg"],
    ativo: true,
    createdAt: "2024-01-05"
  },
  {
    id: "ativ-2",
    propriedadeId: "prop-1",
    empreendedorId: "emp-1",
    nome: "Ordenha e Café Colonial",
    descricao: "Participe da ordenha das vacas pela manhã e depois desfrute de um delicioso café colonial com produtos frescos da fazenda.",
    tipo: "gastronomia",
    preco: 85,
    duracao: "3 horas",
    vagas: 15,
    imagem: "/images/ativ-ordenha.jpg",
    horario: "06:30",
    inclui: ["Experiência de ordenha", "Café colonial completo", "Produtos para levar"],
    requisitos: ["Acordar cedo!", "Usar roupas confortáveis"],
    ativo: true,
    createdAt: "2024-01-05"
  },
  {
    id: "ativ-3",
    propriedadeId: "prop-2",
    empreendedorId: "emp-2",
    nome: "Colheita de Frutas Orgânicas",
    descricao: "Colha suas próprias frutas orgânicas diretamente do pomar. Aprenda sobre cultivo sustentável e leve para casa frutas frescas.",
    tipo: "workshop",
    preco: 65,
    duracao: "2 horas",
    vagas: 20,
    imagem: "/images/ativ-colheita.jpg",
    horario: "08:00 e 14:00",
    inclui: ["Cesta para colheita", "1kg de frutas para levar", "Suco natural"],
    requisitos: ["Usar protetor solar", "Calçado fechado"],
    ativo: true,
    createdAt: "2024-01-12"
  },
  {
    id: "ativ-4",
    propriedadeId: "prop-3",
    empreendedorId: "emp-3",
    nome: "Trilha Ecológica com Observação de Aves",
    descricao: "Caminhe por trilhas preservadas e observe mais de 50 espécies de aves da região. Guia biólogo acompanha o grupo.",
    tipo: "aventura",
    preco: 95,
    duracao: "4 horas",
    vagas: 12,
    imagem: "/images/ativ-trilha.jpg",
    horario: "06:00",
    inclui: ["Guia biólogo", "Binóculos", "Lanche", "Material informativo"],
    requisitos: ["Condicionamento físico básico", "Roupas adequadas para trilha"],
    ativo: true,
    createdAt: "2024-02-05"
  },
  {
    id: "ativ-5",
    propriedadeId: "prop-2",
    empreendedorId: "emp-2",
    nome: "Oficina de Queijo Artesanal",
    descricao: "Aprenda a fazer queijo artesanal do zero com nosso mestre queijeiro. Leve seu próprio queijo para casa!",
    tipo: "workshop",
    preco: 150,
    duracao: "4 horas",
    vagas: 10,
    imagem: "/images/ativ-queijo.jpg",
    dataEvento: "2026-10-20",
    horario: "09:00",
    inclui: ["Todos os ingredientes", "Apostila", "Queijo para levar", "Almoço"],
    requisitos: ["Idade mínima: 16 anos"],
    ativo: true,
    createdAt: "2024-02-10"
  },
  {
    id: "ativ-6",
    propriedadeId: "prop-1",
    empreendedorId: "emp-1",
    nome: "Dia na Fazenda para Crianças",
    descricao: "Atividade especial para crianças com alimentação de animais, passeio de trator, brincadeiras ao ar livre e muito mais!",
    tipo: "infantil",
    preco: 110,
    duracao: "6 horas",
    vagas: 25,
    imagem: "/images/ativ-criancas.jpg",
    horario: "09:00",
    inclui: ["Todas as atividades", "Almoço", "Lanche da tarde", "Monitores"],
    requisitos: ["Idade: 4 a 12 anos", "Acompanhante responsável"],
    ativo: true,
    createdAt: "2024-02-15"
  },
  {
    id: "ativ-7",
    propriedadeId: "prop-3",
    empreendedorId: "emp-3",
    nome: "Festival da Colheita",
    descricao: "Grande evento anual celebrando a colheita! Música ao vivo, feira de produtos orgânicos, oficinas e muita diversão.",
    tipo: "cultural",
    preco: 45,
    duracao: "Dia inteiro",
    vagas: 200,
    imagem: "/images/ativ-festival.jpg",
    dataEvento: "2026-11-15",
    horario: "10:00",
    inclui: ["Acesso a todas as atividades", "Kit boas-vindas"],
    requisitos: [],
    ativo: true,
    createdAt: "2024-03-01"
  },
  {
    id: "ativ-8",
    propriedadeId: "prop-4",
    empreendedorId: "emp-1",
    nome: "Noite de Astronomia",
    descricao: "Observe o céu estrelado longe da poluição luminosa. Telescópio profissional e astrônomo para guiar a experiência.",
    tipo: "cultural",
    preco: 75,
    duracao: "3 horas",
    vagas: 20,
    imagem: "/images/ativ-astronomia.jpg",
    horario: "20:00",
    inclui: ["Uso do telescópio", "Mapa celeste", "Chocolate quente", "Cobertor"],
    requisitos: ["Agasalho", "Disponibilidade para horário noturno"],
    ativo: true,
    createdAt: "2024-03-10"
  }
]

// Reservas
export const reservas: Reserva[] = [
  {
    id: "res-1",
    usuarioId: "user-1",
    propriedadeId: "prop-1",
    dataInicio: "2024-04-10",
    dataFim: "2024-04-12",
    pessoas: 4,
    valorTotal: 700,
    status: "confirmada",
    metodoPagamento: "pix",
    createdAt: "2024-03-25"
  },
  {
    id: "res-2",
    usuarioId: "user-1",
    atividadeId: "ativ-1",
    dataInicio: "2024-04-11",
    pessoas: 2,
    valorTotal: 240,
    status: "confirmada",
    metodoPagamento: "cartao",
    createdAt: "2024-03-25"
  },
  {
    id: "res-3",
    usuarioId: "user-2",
    propriedadeId: "prop-2",
    dataInicio: "2024-04-15",
    dataFim: "2024-04-17",
    pessoas: 2,
    valorTotal: 560,
    status: "pendente",
    createdAt: "2024-04-01"
  },
  {
    id: "res-4",
    usuarioId: "user-1",
    propriedadeId: "prop-3",
    dataInicio: "2024-03-01",
    dataFim: "2024-03-03",
    pessoas: 2,
    valorTotal: 840,
    status: "concluida",
    metodoPagamento: "cartao",
    createdAt: "2024-02-15"
  },
  {
    id: "res-5",
    usuarioId: "user-3",
    atividadeId: "ativ-5",
    dataInicio: "2024-04-20",
    pessoas: 1,
    valorTotal: 150,
    status: "confirmada",
    metodoPagamento: "pix",
    createdAt: "2024-04-05"
  }
]

// Mensagens
export const mensagens: Mensagem[] = [
  {
    id: "msg-1",
    remetenteId: "user-1",
    destinatarioId: "emp-1",
    assunto: "Dúvida sobre reserva",
    conteudo: "Olá! Gostaria de saber se é possível levar meu cachorro para a fazenda. Ele é bem comportado.",
    lida: true,
    createdAt: "2024-03-20"
  },
  {
    id: "msg-2",
    remetenteId: "emp-1",
    destinatarioId: "user-1",
    assunto: "Re: Dúvida sobre reserva",
    conteudo: "Olá Maria! Sim, aceitamos pets na fazenda. Temos uma área especial para eles. Será um prazer recebê-los!",
    lida: true,
    createdAt: "2024-03-20"
  },
  {
    id: "msg-3",
    remetenteId: "user-2",
    destinatarioId: "emp-2",
    assunto: "Disponibilidade para grupo",
    conteudo: "Boa tarde! Temos um grupo de 10 pessoas interessadas em passar o feriado no sítio. Há disponibilidade?",
    lida: false,
    createdAt: "2024-04-02"
  },
  {
    id: "msg-4",
    remetenteId: "user-3",
    destinatarioId: "emp-2",
    assunto: "Oficina de queijo",
    conteudo: "Olá! A oficina de queijo tem previsão para acontecer novamente em maio? Não consegui vaga para abril.",
    lida: false,
    createdAt: "2024-04-06"
  }
]

// Avaliações
export const avaliacoes: Avaliacao[] = [
  {
    id: "aval-1",
    usuarioId: "user-1",
    propriedadeId: "prop-3",
    nota: 5,
    comentario: "Experiência incrível! O lugar é maravilhoso e o atendimento impecável. Voltarei com certeza!",
    createdAt: "2024-03-05"
  },
  {
    id: "aval-2",
    usuarioId: "user-2",
    propriedadeId: "prop-1",
    nota: 4,
    comentario: "Ótima fazenda, muito acolhedora. O café colonial é delicioso. Só achei o preço um pouco alto.",
    createdAt: "2024-02-20"
  },
  {
    id: "aval-3",
    usuarioId: "user-3",
    atividadeId: "ativ-4",
    nota: 5,
    comentario: "A trilha ecológica foi fantástica! O guia conhece muito sobre as aves da região. Recomendo!",
    createdAt: "2024-03-15"
  }
]

// Favoritos
export const favoritos: Favorito[] = [
  {
    id: "fav-1",
    usuarioId: "user-1",
    propriedadeId: "prop-1",
    createdAt: "2024-03-01"
  },
  {
    id: "fav-2",
    usuarioId: "user-1",
    propriedadeId: "prop-3",
    createdAt: "2024-03-10"
  },
  {
    id: "fav-3",
    usuarioId: "user-2",
    propriedadeId: "prop-2",
    createdAt: "2024-03-15"
  }
]
