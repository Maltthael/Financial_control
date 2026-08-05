import React, { useState } from "react";
import api from "../../services/api";
import "./auth.css";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCarregando(true);
        setMensagem("");

        try {
            const response = await api.post("/auth/password-recover", { email });
            setMensagem(response.data.message);
        } catch (error) {
            console.error("Erro na recuperação:", error);
            setMensagem("Ocorreu um erro ao tentar enviar o e-mail. Tente novamente.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="auth-container" style={{ position: 'relative' }}>
            <Link to="/login">
                <button className="btn-voltar">
                    ‹
                </button>
            </Link>
            <form onSubmit={handleSubmit} className="auth-form">

                <h2>Recuperar Senha</h2>
                <p>Informe seu e-mail para receber as instruções de recuperação.</p>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu e-mail cadastrado"
                    required
                />

                <button type="submit" disabled={carregando}>
                    {carregando ? "Enviando..." : "Enviar instruções"}
                </button>

                {mensagem && <p className="auth-mensagem">{mensagem}</p>}
            </form>
        </div>
    );
}