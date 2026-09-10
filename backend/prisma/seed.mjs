import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  // Despesas
  { name: 'Alimentação', type: TransactionType.DESPESA, color: '#f43f5e', icon: 'Utensils', isDefault: true },
  { name: 'Transporte', type: TransactionType.DESPESA, color: '#f97316', icon: 'Car', isDefault: true },
  { name: 'Moradia / Contas', type: TransactionType.DESPESA, color: '#0ea5e9', icon: 'Home', isDefault: true },
  { name: 'Saúde & Farmácia', type: TransactionType.DESPESA, color: '#ec4899', icon: 'HeartPulse', isDefault: true },
  { name: 'Educação', type: TransactionType.DESPESA, color: '#8b5cf6', icon: 'GraduationCap', isDefault: true },
  { name: 'Lazer & Assinaturas', type: TransactionType.DESPESA, color: '#06b6d4', icon: 'Tv', isDefault: true },
  { name: 'Viagem / Hospedagem', type: TransactionType.DESPESA, color: '#eab308', icon: 'Plane', isDefault: true },
  { name: 'Outros', type: TransactionType.DESPESA, color: '#71717a', icon: 'Tag', isDefault: true },

  // Receitas
  { name: 'Salário', type: TransactionType.RECEBIMENTO, color: '#10b981', icon: 'Briefcase', isDefault: true },
  { name: 'Freelance / Serviços', type: TransactionType.RECEBIMENTO, color: '#14b8a6', icon: 'Laptop', isDefault: true },
  { name: 'Investimentos', type: TransactionType.RECEBIMENTO, color: '#3b82f6', icon: 'TrendingUp', isDefault: true },
  { name: 'Outros Rendimentos', type: TransactionType.RECEBIMENTO, color: '#6b7280', icon: 'PlusCircle', isDefault: true },
];

async function seedAndBackfill() {
  console.log('--- 1. SEED: Criando Categorias Padrão ---');
  const categoryMap = new Map();

  for (const cat of DEFAULT_CATEGORIES) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name, type: cat.type, userId: null },
    });

    if (existing) {
      categoryMap.set(`${cat.type}:${cat.name}`, existing.id);
      console.log(`✓ Categoria já existente: ${cat.name} (${cat.type})`);
    } else {
      const created = await prisma.category.create({
        data: cat,
      });
      categoryMap.set(`${cat.type}:${cat.name}`, created.id);
      console.log(`+ Categoria criada: ${cat.name} (${cat.type})`);
    }
  }

  console.log('\n--- 2. BACKFILL: Normalizando Transações Legadas ---');
  const transactions = await prisma.transaction.findMany();
  console.log(`Total de transações para analisar: ${transactions.length}`);

  let updatedCount = 0;

  for (const trs of transactions) {
    let newTitle = trs.title;
    let targetCategoryName = 'Outros';

    if (trs.type === 'RECEBIMENTO') {
      const lowerTitle = (trs.title || '').toLowerCase();
      if (lowerTitle.includes('salário') || lowerTitle.includes('salario')) {
        targetCategoryName = 'Salário';
      } else if (lowerTitle.includes('freela') || lowerTitle.includes('serviço')) {
        targetCategoryName = 'Freelance / Serviços';
      } else if (lowerTitle.includes('rendimento') || lowerTitle.includes('invest')) {
        targetCategoryName = 'Investimentos';
      } else {
        targetCategoryName = 'Outros Rendimentos';
      }
    } else {
      // DESPESA
      const lowerTitle = (trs.title || '').toLowerCase();
      const expenseName = trs.expenseName;
      const lowerExpense = (expenseName || '').toLowerCase();

      // Se tinha expenseName, ele se torna o título real da transação
      if (expenseName && expenseName.trim().length > 0) {
        newTitle = expenseName.trim();

        if (lowerExpense.includes('latam') || lowerExpense.includes('hotel') || lowerExpense.includes('voo') || lowerExpense.includes('viagem')) {
          targetCategoryName = 'Viagem / Hospedagem';
        } else if (lowerExpense.includes('disney') || lowerExpense.includes('jogo') || lowerExpense.includes('netflix') || lowerExpense.includes('spotify') || lowerExpense.includes('cinema')) {
          targetCategoryName = 'Lazer & Assinaturas';
        } else if (lowerExpense.includes('marrom') || lowerExpense.includes('passaro') || lowerExpense.includes('uber') || lowerExpense.includes('gasolina') || lowerExpense.includes('onibus') || lowerExpense.includes('metro')) {
          targetCategoryName = 'Transporte';
        } else if (lowerExpense.includes('curso') || lowerExpense.includes('livro') || lowerExpense.includes('escola') || lowerExpense.includes('faculdade')) {
          targetCategoryName = 'Educação';
        } else if (lowerExpense.includes('farmacia') || lowerExpense.includes('remedio') || lowerExpense.includes('medico') || lowerExpense.includes('consulta')) {
          targetCategoryName = 'Saúde & Farmácia';
        } else if (lowerExpense.includes('mercado') || lowerExpense.includes('lanche') || lowerExpense.includes('restaurante') || lowerExpense.includes('almoço')) {
          targetCategoryName = 'Alimentação';
        } else {
          targetCategoryName = 'Outros';
        }
      } else {
        // Não tinha expenseName; o title antigo era a própria categoria escolhida no select
        if (lowerTitle.includes('alimenta')) {
          targetCategoryName = 'Alimentação';
        } else if (lowerTitle.includes('condução') || lowerTitle.includes('transporte')) {
          targetCategoryName = 'Transporte';
        } else if (lowerTitle.includes('residenc') || lowerTitle.includes('contas')) {
          targetCategoryName = 'Moradia / Contas';
        } else if (lowerTitle.includes('saúde') || lowerTitle.includes('saude')) {
          targetCategoryName = 'Saúde & Farmácia';
        } else if (lowerTitle.includes('educa')) {
          targetCategoryName = 'Educação';
        } else if (lowerTitle.includes('lazer')) {
          targetCategoryName = 'Lazer & Assinaturas';
        } else {
          targetCategoryName = 'Outros';
        }
      }
    }

    const categoryId = categoryMap.get(`${trs.type}:${targetCategoryName}`) || categoryMap.get(`${trs.type}:Outros`) || categoryMap.get(`${trs.type}:Outros Rendimentos`);

    await prisma.transaction.update({
      where: { id: trs.id },
      data: {
        title: newTitle,
        categoryId: categoryId || null,
      },
    });

    console.log(`[${trs.type}] ID ${trs.id.substring(0, 8)}... | De: "${trs.title}" (exp: "${trs.expenseName || '-'}") -> Para: "${newTitle}" | Categoria: ${targetCategoryName}`);
    updatedCount++;
  }

  console.log(`\n🎉 Seed e Backfill concluídos com sucesso! ${updatedCount} transações normalizadas sem nenhuma perda de dados.`);
}

seedAndBackfill()
  .catch((e) => {
    console.error('Erro no seed/backfill:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });