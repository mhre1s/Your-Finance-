import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Jogos de video game',
    description: 'Nome exclusivo da categoria personalizada',
  })
  name!: string;

  @ApiProperty({
    enum: TransactionType,
    example: 'DESPESA',
    description: 'Tipo de movimentação vinculada à categoria',
  })
  type!: TransactionType;

  @ApiProperty({
    example: '#8b5cf6',
    description: 'Cor hexadecimal para identificação visual e gráficos',
  })
  color!: string;

  @ApiProperty({
    example: 'Gamepad2',
    description: 'Nome do ícone da biblioteca Lucide',
    required: false,
  })
  icon?: string;
}