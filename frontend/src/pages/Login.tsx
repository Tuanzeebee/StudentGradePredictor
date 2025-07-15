import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const clearForm = () => {
    setForm({ email: "", password: "" });
  };

  const submit = async () => {
    try {
      const res = await api.post("/auth/login", form);
      
      // Lưu token vào localStorage
      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        console.log("✅ Token saved:", token);
      } else {
        throw new Error("No token received from server");
      }

      setMessage("Đăng nhập thành công!");
      setIsSuccess(true);
      clearForm();

      // Chuyển đến trang landing sau 2 giây
      setTimeout(() => {
        navigate("/landing");
      }, 2000);
    } catch (error) {
      console.error("❌ Login error:", error);
      setMessage("Đăng nhập thất bại. Vui lòng kiểm tra email và password!");
      setIsSuccess(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Login</h2>

      {message && (
        <div
          style={{
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px",
            backgroundColor: isSuccess ? "#d4edda" : "#f8d7da",
            color: isSuccess ? "#155724" : "#721c24",
            border: `1px solid ${isSuccess ? "#c3e6cb" : "#f5c6cb"}`,
          }}
        >
          {message}
        </div>
      )}

      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ padding: "8px", margin: "5px", width: "200px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{ padding: "8px", margin: "5px", width: "200px" }}
        />
      </div>
      <div>
        <button
          onClick={submit}
          style={{
            padding: "10px 20px",
            margin: "5px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            margin: "5px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Login;
