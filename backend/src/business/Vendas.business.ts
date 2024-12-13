import { prisma } from "../prisma";
import { VendasSchema } from "../schemas/mibusca.schema"; 

export const getAllVendas = async () => {
    return await prisma.vendas.findMany();
};

export const getVendaById = async (id: number) => {
    return await prisma.vendas.findUnique({
        where: { id_venda: id }, 
    });
};

export const createVenda = async (data: any) => {
    const validData = VendasSchema.parse(data); // Valida e transforma os dados
    return await prisma.vendas.create({
        data: validData,
    });
};

export const updateVenda = async (id: number, data: any) => {
    const validData = VendasSchema.parse(data); // Valida e transforma os dados
    return await prisma.vendas.update({
        where: { id_venda: id }, 
        data: validData,
    });
};

export const deleteVenda = async (id: number) => {
    return await prisma.vendas.delete({
        where: { id_venda: id }, 
    });
};
