import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

const [userStore, setUserStore] = createStore({ session: null, user: null });


// createEffect(() => {
//   // console.log({ session: query.data?.session });
// });

// const login = email => {
//   console.log("login", email);
//   setUserStore("user", email);
// };

// const logout = () => {
//   console.log("logout");
//   setUserStore("user", null);
// };

// export { login, logout };

export {userStore, setUserStore}
