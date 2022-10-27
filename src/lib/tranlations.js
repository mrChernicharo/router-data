const TERMS = {
  firstName: "Nome",
  lastName: "Sobrenome",
  dateOfBirth: "Data de nascimento",
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
