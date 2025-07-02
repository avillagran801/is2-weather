import LoginRegisterForm from "@/components/login/LoginRegisterForm";
import React from "react";
import { signIn } from "next-auth/react";

export default function IniciarSesion() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    try {
      if(!username || !password){
        throw new Error("Hay al menos un campo obligatorio incompleto");
      }

      const checkUser = await fetch("/api/login/read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        })        
      });

      if (!checkUser.ok) {
        const errorData = await checkUser.json();
        throw new Error(errorData.error || "Error al iniciar sesión");
      }

      const auth = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (!auth?.error) {
        window.location.href = "/";
      }
    }
    catch (error) {
      console.log(error);
      if(error instanceof Error) {
        alert(error.message)
      }
    }
  }

  const handleRegister = async () => {
    try {
      if(!username || !password){
        throw new Error("Hay al menos un campo obligatorio incompleto");
      }

      if(password.length <4){
        throw new Error("La contraseña debe tener por lo menos 4 caracteres")
      }

      const response = await fetch("/api/registration/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        })        
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al registrarse");
      }

      alert("La cuenta fue creada con éxito. Ya puedes iniciar sesión");
      setUsername("");
      setPassword("");
      setIsLogin(true);
    }
    catch (error) {
      console.log(error);
      if(error instanceof Error) {
        alert(error.message)
      }
    }
  }

  return(
    <>
      <LoginRegisterForm
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
      />
    </>
  );
}