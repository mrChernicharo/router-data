const TERMS = {
  first_name: "Nome",
  last_name: "Sobrenome",
  date_of_birth: "Data de nascimento",
  phone: "Telefone",
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
  customers: "Clientes",
  professionals: "Profissionais",
  staff: "Membros",
  "total users": "Usuários",
  "unattended customers": "Novos Clientes",
};

export const t = term => {
  if (!(term in TERMS)) return term;
  return TERMS[term];
};

export const translateError = message => {
  console.log(message);

  const translations = {
    "Rate limit exceeded": "Limite de tentativas excedido. Espere alguns minutos e tente novamente.",
    "Invalid login credentials": "Conta não encontrada. Verifique se Email e Senha estão corretos",
    'duplicate key value violates unique constraint "customers_email_key"':
      "Já existe um usuário cadastrado com esse email",
    "Email not confirmed": "Você precisa ir no seu email e clicar no link para ativar a sua conta",
    "Cannot read properties of null (reading 'id')": "Deu Ruin aqui pai!",
    "Failed to fetch": "Falha de conexão",
  };

  if (/For security purposes, you can only request this after/.test(message))
    translations[message] = `Por questões de segurança você precisa esperar ${message.replace(
      /\D/g,
      ""
    )} segundos antes de tentar novamente`;

  return translations[message] ? translations[message] : message;
};
