import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./auth.css";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            const response = await api.post("/auth/reset-password", {
                token: token,
                new_password: newPassword
            });

            alert(response.data.message);
            navigate("/login"); 
        } catch (error) {
            console.error("Erro ao redefinir senha:", error);
            setMensagem(error.response?.data?.detail || "Erro ao redefinir senha.");
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Nova Senha</h2>
                <p>Digite sua nova senha abaixo.</p>

                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nova senha"
                    required
                />

                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme a nova senha"
                    required
                />

                <button type="submit">Salvar nova senha</button>

                {mensagem && <p className="auth-mensagem-erro">{mensagem}</p>}
            </form>
        </div>
    );
}