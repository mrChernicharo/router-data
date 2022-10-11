import { useNavigate } from "solid-app-router";

import { onMount, createEffect } from "solid-js";
import { userStore, setUserStore } from "./userStore";

export default function Professional() {
  //   const navigate = useNavigate();
  //   onMount(() => {
  //     if (!userStore.user_id && !userStore.id) {
  //       setUserStore(
  //         JSON.parse(localStorage.getItem("user")) &&
  //           JSON.parse(localStorage.getItem("user")).category === "Professional"
  //       );
  //     }
  //   });

  //   createEffect(() => {
  //     console.log(userStore);
  //   });

  //   if (!userStore) navigate("/login");

  return (
    <div>
      <h1>Professional</h1>
    </div>
  );
}
