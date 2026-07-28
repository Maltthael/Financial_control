import React, { useState, useEffect } from "react";
import api from "../../services/api"; 
import "./perfil.css";

export default function Perfil() {
    const [usuario, setUsuario] = useState({ nome: "", email: "", is_2fa_enabled: false });
    const [dados2FA, setDados2FA] = useState(null); 
    const [tokenDigitado, setTokenDigitado] = useState("");

    useEffect(() => {
        api.get("/perfil/")
            .then((res) => setUsuario(res.data))
            .catch((err) => console.error("Erro ao buscar perfil.", err));
    }, []);

    const handleSetup2FA = async () => {
        try {
            const response = await api.post("/perfil/setup-2fa");
            setDados2FA(response.data);
        } catch (error) {
            console.error("Erro ao iniciar 2FA:", error);
            alert("Erro ao iniciar 2FA: " + (error.response?.data?.detail || "Erro desconhecido"));
        }
    };

    const handleVerify2FA = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/perfil/verify-setup-2fa", { token: tokenDigitado });
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            console.error("Detalhe exato do erro:", error.response?.data);
            alert("Erro: " + (error.response?.data?.detail || "Código inválido"));
        }
    };
    return (
        <div className="perfil-container">
            <h1>Meu Perfil</h1>
            
            <div className="perfil-info">
                <p><strong>Nome:</strong> {usuario.nome || "Carregando..."}</p>
                <p><strong>E-mail:</strong> {usuario.email || "Carregando..."}</p>
                <p><strong>Status 2FA:</strong> {usuario.is_2fa_enabled ? "Ativado ✅" : "Desativado ❌"}</p>
            </div>

            <hr />

            <h2>Segurança da Conta</h2>
            {!usuario.is_2fa_enabled && !dados2FA && (
                <button onClick={handleSetup2FA}>Ativar Autenticação de Dois Fatores (2FA)</button>
            )}

            {dados2FA && (
                <div className="area-2fa">
                    <p><strong>1.</strong> Escaneie o QR Code abaixo no seu aplicativo autenticador:</p>
                    <img src={dados2FA.qr_code_base64} alt="QR Code 2FA" style={{ width: "180px" }} />
                    <p>Ou digite a chave secreta manualmente: <strong>{dados2FA.secret}</strong></p>

                    <form onSubmit={handleVerify2FA} style={{ marginTop: "15px" }}>
                        <p><strong>2.</strong> Digite o código de 6 dígitos:</p>
                        <input
                            type="text"
                            maxLength="6"
                            value={tokenDigitado}
                            onChange={(e) => setTokenDigitado(e.target.value)}
                            placeholder="123456"
                        />
                        <button type="submit">Confirmar Ativação</button>
                    </form>
                </div>
            )}
        </div>
    );
}