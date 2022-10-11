import { useNavigate } from "solid-app-router";

import { onMount, createEffect } from "solid-js";
import { userStore, setUserStore } from "./userStore";

export default function Customer() {
  //   const navigate = useNavigate();
  //   onMount(() => {
  //     if (!userStore.user_id && !userStore.id) {
  //       setUserStore(
  //         JSON.parse(localStorage.getItem("user")) &&
  //           JSON.parse(localStorage.getItem("user")).category === "customer"
  //       );
  //     }
  //   });

  //   createEffect(() => {
  //     console.log(userStore);
  //   });

  //   if (!userStore) navigate("/login");

  return (
    <div>
      <h1>Customer</h1>
    </div>
  );
}
