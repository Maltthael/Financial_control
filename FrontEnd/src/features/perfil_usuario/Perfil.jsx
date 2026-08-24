import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "./perfil.css"; 

export default function Perfil() {
    const [usuario, setUsuario] = useState({ nome: "", email: "", is_2fa_enabled: false });
    const [dados2FA, setDados2FA] = useState(null);
    const [tokenDigitado, setTokenDigitado] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");
    const [backupCodes, setBackupCodes] = useState([]);
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
            const response = await api.post("/perfil/disable-2fa", { current_password: senhaAtual, token: tokenDigitado });
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
    };

    if (!usuario.nome && !usuario.email) {
        return (
            <div className="perfil-loading">
                <div className="spinner"></div>
                <p>Carregando dados do perfil...</p>
            </div>
        );
    }

    return (
        <div className="perfil-container">
            <div className="perfil-header">
                <div>
                    <h1>Meu Perfil</h1>
                    <p>Gerencie suas informações pessoais e configurações de segurança.</p>
                </div>
            </div>

            <div className="perfil-grid">
                {/* Cartão de Informações Pessoais */}
                <div className="perfil-card">
                    <h3>Informações da Conta</h3>
                    <div className="info-group">
                        <p><strong>Nome:</strong><span>{usuario.nome}</span></p>
                        <p><strong>E-mail:</strong><span>{usuario.email}</span></p>
                        <p>
                            <strong>Status 2FA:</strong>
                            <span className={usuario.is_2fa_enabled ? "badge-ativo" : "badge-inativo"}>
                                {usuario.is_2fa_enabled ? "Ativado ✅" : "Desativado ❌"}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Cartão de Segurança / 2FA */}
                <div className="perfil-card">
                    <h3>Segurança da Conta</h3>

                    {!usuario.is_2fa_enabled && !dados2FA && backupCodes.length === 0 && (
                        <div className="sec-section">
                            <p className="sec-desc">Aumente a segurança da sua conta ativando a Autenticação de Dois Fatores (2FA).</p>
                            <button className="btn-primary" onClick={handleSetup2FA}>
                                Ativar 2FA
                            </button>
                        </div>
                    )}

                    {dados2FA && backupCodes.length === 0 && (
                        <div className="area-2fa">
                            <p><strong>1.</strong> Escaneie o QR Code abaixo no seu aplicativo autenticador:</p>
                            <div className="qrcode-wrapper">
                                <img src={dados2FA.qr_code_base64} alt="QR Code 2FA" />
                            </div>
                            <p className="secret-text">Ou digite a chave secreta manualmente: <strong>{dados2FA.secret}</strong></p>

                            <form onSubmit={handleVerify2FA} className="form-group">
                                <p><strong>2.</strong> Digite o código de 6 dígitos:</p>
                                <input
                                    type="text"
                                    maxLength="6"
                                    value={tokenDigitado}
                                    onChange={(e) => setTokenDigitado(e.target.value)}
                                    placeholder="123456"
                                />
                                <button type="submit" className="btn-primary">Confirmar Ativação</button>
                            </form>
                        </div>
                    )}

                    {backupCodes.length > 0 && (
                        <div className="area-backup-codes">
                            <h3>⚠️ Guarde seus Códigos de Recuperação!</h3>
                            <p>Estes códigos permitem que você acesse sua conta caso perca o acesso ao app autenticador. <strong>Eles não serão exibidos novamente.</strong></p>

                            <ul className="backup-list">
                                {backupCodes.map((code, index) => (
                                    <li key={index}>{code}</li>
                                ))}
                            </ul>

                            <button
                                className="btn-primary"
                                onClick={() => window.location.reload()}
                            >
                                Já salvei os códigos, continuar
                            </button>
                        </div>
                    )}

                    {usuario.is_2fa_enabled && !dados2FA && backupCodes.length === 0 && (
                        <div className="area-disable-2fa">
                            <p className="sec-desc">O 2FA está ativado na sua conta. Deseja desativá-lo?</p>

                            {/* Opção 1: Desativar via App */}
                            <form onSubmit={handleDisable2FA} className="form-group">
                                <p className="form-subtitle">Via Aplicativo Authenticator:</p>
                                <input
                                    type="password"
                                    value={senhaAtual}
                                    onChange={(e) => setSenhaAtual(e.target.value)}
                                    placeholder="Digite sua senha atual"
                                    required
                                />
                                <input
                                    type="text"
                                    maxLength="6"
                                    value={tokenDigitado}
                                    onChange={(e) => setTokenDigitado(e.target.value)}
                                    placeholder="Digite o token de 6 dígitos"
                                    required
                                />
                                <button type="submit" className="btn-danger">Desativar 2FA</button>
                            </form>

                            <hr className="divider" />

                            {/* Opção 2: Desativar com Código de Backup */}
                            <form onSubmit={handleDisable2FABackup} className="form-group">
                                <p className="form-subtitle">Perdeu o acesso ao app? Use um Código de Backup:</p>
                                <input
                                    type="password"
                                    value={senhaAtual}
                                    onChange={(e) => setSenhaAtual(e.target.value)}
                                    placeholder="Digite sua senha atual"
                                    required
                                />
                                <input
                                    type="text"
                                    value={backupCodeDigitado}
                                    onChange={(e) => setBackupCodeDigitado(e.target.value)}
                                    placeholder="Digite o código de backup"
                                    required
                                />
                                <button type="submit" className="btn-danger">Desativar 2FA com Código</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}