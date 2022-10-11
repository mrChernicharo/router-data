import { createStore } from "solid-js/store";

export const [userStore, setUserStore] = createStore({ user: null });

const login = email => {
  console.log("login", email);
  setUserStore("user", email);
};

const logout = () => {
  console.log("logout");
  setUserStore("user", null);
};

export { login, logout };
