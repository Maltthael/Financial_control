from email.message import EmailMessage
import smtplib

def enviar_email_recuperacao(destinatario: str, token: str):
  email_remetente = "suportecontrolefinanceiro1@gmail.com"
  senha_app = "wvwh dyqr jces ikek"

  msg = EmailMessage()
  msg["Subject"] = "Recuperação de Senha - Controle Financeiro"
  msg["From"] = email_remetente
  msg["To"] = destinatario  

  link_frontend = f"http://localhost:5173/mudar_senha?token={token}"

  msg.set_content(
      f"Olá,\n\nRecebemos uma solicitação para redefinir a senha da sua conta."
      f" Clique no link abaixo para criar uma nova senha:\n\n{link_frontend}"
  )

  with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
    smtp.login(email_remetente, senha_app)
    smtp.send_message(msg)