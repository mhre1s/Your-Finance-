import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'E-mail do usuário para recuperação de senha',
    example: 'usuario@email.com',
  })
  email!: string;
}
