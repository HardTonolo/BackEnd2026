const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Limpa todos os departamentos existentes
  await prisma.departamentos.deleteMany();

  // Cria os 5 departamentos corretos
  await prisma.departamentos.createMany({
    data: [
      { nome: 'Funilaria' },
      { nome: 'Pintura' },
      { nome: 'Mecânica' },
      { nome: 'Elétrica' },
      { nome: 'Lava Jato' }
    ]
  });
  
  console.log('✅ Departamentos limpos e recriados com sucesso!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });