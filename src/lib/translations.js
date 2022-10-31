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
};

export const t = term => {
  if (!(term in TERMS)) return term;
  return TERMS[term];
};



export const translateError = message => {
  console.log(message)

  const translations = {
    "Rate limit exceeded": "Limite de tentativas excedido. Espere alguns minutos e tente novamente.",
    "Invalid login credentials": "Credenciais inválidas. Verifique se Email e Senha estão corretos",
    'duplicate key value violates unique constraint "customers_email_key"':
      "Já existe um usuário cadastrado com esse email",
    "For security purposes, you can only request this after 32 seconds.": "Por questões de segurança...",
    "Email not confirmed": "Você precisa ir no seu email e clicar no link para ativar a sua conta",
    "Cannot read properties of null (reading 'id')": "Deu Ruin aqui pai!",
    "Failed to fetch": "Falha de conexão"
  };

  return translations[message] ? translations[message] : message;
};