import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./perfil.css";

export default function Perfil() {
    const [usuario, setUsuario] = useState({ nome: "", email: "", is_2fa_enabled: false });
    const [dados2FA, setDados2FA] = useState(null);
    const [tokenDigitado, setTokenDigitado] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");
    const [backupCodes, setBackupCodes] = useState("");
    const [backupCodeDigitado, setBackupCodeDigitado] = useState("");

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
            setBackupCodes(response.data.backup_codes);
            alert(response.data.message);
        } catch (error) {
            console.error("Detalhe exato do erro:", error.response?.data);
            alert("Erro: " + (error.response?.data?.detail || "Código inválido"));
        }
    };
    const handleDisable2FA = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/perfil/disable-2fa", { current_password: senhaAtual, token: tokenDigitado});
            
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            console.error("Erro ao desativar 2FA:", error.response?.data);
            alert("Erro: " + (error.response?.data?.detail || "Erro ao desativar 2FA"));
        }
    };

    const handleDisable2FABackup = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/perfil/disable-2fa-backup", {
                current_password: senhaAtual,
                backup_code: backupCodeDigitado
            });
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            console.error("Erro ao desativar 2FA com backup:", error.response?.data);
            alert("Erro: " + (error.response?.data?.detail || "Erro ao desativar 2FA"));
        }
    }
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
            {backupCodes.length > 0 && (
                <div className="area-backup-codes">
                    <h3>⚠️ Guarde seus Códigos de Recuperação!</h3>
                    <p>Estes códigos permitem que você acesse sua conta caso perca o acesso ao seu aplicativo autenticador. <strong>Eles não serão exibidos novamente.</strong></p>

                    <ul>
                        {backupCodes.map((code, index) => (
                            <li key={index}>
                                {code}
                            </li>
                        ))}
                    </ul>

                    <button
                        className="btn-continuar-backup"
                        onClick={() => window.location.reload()}
                    >
                        Já salvei os códigos, continuar
                    </button>
                </div>
            )}
            {usuario.is_2fa_enabled && (
                <div className="area-disable-2fa">
                    <p>O 2FA está ativado na sua conta. Deseja desativá-lo?</p>

                    {/* Opção 1: Desativar com senha normal */}
                    <form onSubmit={handleDisable2FA} style={{ marginBottom: "20px" }}>
                        <p><strong>Via Aplicativo Authenticator:</strong></p>
                        <input
                            type="password"
                            value={senhaAtual}
                            onChange={(e) => setSenhaAtual(e.target.value)}
                            placeholder="Digite sua senha atual"
                            required
                        />
                        <input
                            type="password"
                            value={tokenDigitado}
                            onChange={(e) => setTokenDigitado(e.target.value)}
                            placeholder="Digite o token"
                            required
                        />
                        <button type="submit">Desativar 2FA</button>
                    </form>

                    <hr />

                    <form onSubmit={handleDisable2FABackup}>
                        <p><strong>Perdeu o acesso ao app? Use um Código de Backup:</strong></p>
                       
                        <input
                            type="text"
                            value={backupCodeDigitado}
                            onChange={(e) => setBackupCodeDigitado(e.target.value)}
                            placeholder="Digite o código de backup"
                            required
                        />
                        <button type="submit">Desativar 2FA com Código de Backup</button>
                    </form>
                </div>
            )}
        </div>
    );
}