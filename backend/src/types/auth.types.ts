// Contratos de entrada e saída (DTOs) com tipagem estrita para Autenticação

// Dados obrigatórios para cadastrar um novo usuário
export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

// Dados obrigatórios para autenticar um usuário
export interface LoginDTO {
  email: string;
  password: string;
}

// Resposta segura retornada ao cliente (a senha nunca é incluída!)
export interface AuthResponseDTO {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}
