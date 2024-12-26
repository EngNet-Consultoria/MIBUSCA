import { prisma } from "../src/prisma";
import { Prisma } from "@prisma/client";

import { getValidToken, fetchAccessToken, saveTokenToDatabase } from "./tokenvalidation";

// Função para buscar vendas da API externa
async function fetchVendasFromAPI(accessToken: string) {
  try {
    const response = await fetch("https://merchant-api.ifood.com.br/merchant/v1.0/merchants/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`, // Adiciona o token de autorização no cabeçalho
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar vendas: ${response.statusText}`);
    }

    const vendas = await response.json(); // Obtém os dados de vendas no formato JSON
    return vendas; // Retorna o array de vendas da API
  } catch (error) {
    throw new Error(`Erro ao buscar vendas da API: ${error.message}`);
  }
}

// Função para salvar vendas no banco de dados
async function saveVendasToDatabase(vendas: any[]) {
  try {
    for (const venda of vendas) {
      // Verifica se a venda já existe no banco de dados
      const existingVenda = await prisma.vendas.findUnique({
        where: { id_venda: venda.id_venda },
      });

      if (!existingVenda) {
        // Cria a venda se não existir, ajustando os tipos conforme o esquema Prisma
        await prisma.vendas.create({
          data: {
            id_venda: venda.id_venda,
            id_cliente: venda.id_cliente,
            id_loja: venda.id_loja,
            distancia_raio: venda.distancia_raio,
            data_hora: new Date(venda.data_hora),
            valor_total: venda.valor_total,
            ticket_medio: venda.ticket_medio || null,
            tipo_cliente: venda.tipo_cliente,
            cancelada: venda.cancelada || false,
            promocao_aplicada: venda.promocao_aplicada || false,
            cancelamentos: venda.cancelamentos || 0,
            erros_plataforma: venda.erros_plataforma || 0,
          } as Prisma.VendasUncheckedCreateInput, // Cast explícito para VendasUncheckedCreateInput
        });

        console.log(`Venda ${venda.id_venda} salva com sucesso.`);
      } else {
        console.log(`Venda ${venda.id_venda} já existe no banco de dados.`);
      }
    }
  } catch (error) {
    throw new Error(`Erro ao salvar vendas no banco de dados: ${error.message}`);
  }
}

// Função para criar uma única venda
export async function createVenda(data: Prisma.VendasUncheckedCreateInput) {
  try {
    const createdVenda = await prisma.vendas.create({ data });
    console.log(`Venda ${createdVenda.id_venda} criada com sucesso.`);
    return createdVenda;
  } catch (error) {
    throw new Error(`Erro ao criar venda: ${error.message}`);
  }
}

// Automação principal para vendas
export async function runVendasAutomation() {
  try {
    // Verifica se há um token válido
    let tokenData = await getValidToken();

    if (!tokenData) {
      console.log("Nenhum token válido encontrado. Obtendo novo token...");
      tokenData = await fetchAccessToken();

      if (tokenData) {
        await saveTokenToDatabase(tokenData); // Salva o token no banco de dados
        console.log("Novo token salvo no banco de dados.");
      } else {
        throw new Error("Falha ao obter um novo token da API.");
      }
    }

    // Usa o token para buscar as vendas
    console.log("Buscando vendas da API...");
    const vendas = await fetchVendasFromAPI(tokenData.accessToken);

    if (vendas.length > 0) {
      console.log(`${vendas.length} venda(s) encontrada(s). Salvando no banco de dados...`);
      await saveVendasToDatabase(vendas); // Salva as vendas no banco de dados
      console.log("Vendas salvas com sucesso.");
    } else {
      console.log("Nenhuma venda foi encontrada na API.");
    }
  } catch (error) {
    console.error(`Erro na automação de vendas: ${error.message}`);
  } finally {
    await prisma.$disconnect(); // Fecha a conexão com o banco de dados
  }
}
