import { useState } from "react";
import api from "../services/api";

function Register() {
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const submit = async () => {
    await api.post("/auth/register", form);
    alert("Đăng ký thành công!");
  };

  return (
    <div>
      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={submit}>Register</button>
    </div>
  );
}

export default Register;
