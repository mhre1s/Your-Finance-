import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token criptográfico de recuperação enviado por e-mail',
    example: 'a1b2c3d4e5f6...',
  })
  token!: string;

  @ApiProperty({
    description: 'Nova senha escolhida pelo usuário (mínimo 6 caracteres)',
    example: 'novaSenha123!',
  })
  password!: string;
}
