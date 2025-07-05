import { useState } from "react";
import api from "../services/api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async () => {
    const res = await api.post("/auth/login", form);
    alert("Token: " + res.data.token);
  };

  return (
    <div>
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={submit}>Login</button>
    </div>
  );
}

export default Login;
