# 💰 Financial Control

<p align="left">
  <a href="./README.md">Português</a> | <b>English</b>
</p>

---

A personal finance management application for tracking income, expenses, and real-time balance monitoring.

## 📌 Features

* **Register Transactions:** Record income and expenses with description, amount, and file attachments per transaction.
* **Categorization:** Organize expenses by categories (e.g., *Food*, *Transport*, *Leisure*).
* **Security:** Two-factor authentication (2FA) and password reset.
* **Financial Summary:** View current balance and complete transaction history.

## 🛠️ Built With

### Frontend
- **React** (with JSX)
- **JavaScript (ES6+)**
- **CSS3**

### Backend
- **Python 3.x**
- **FastAPI**
- **SQLite**

## 📁 Project Structure

```text
Financial_control/
├── src/
│   └── app/
│       ├── routers/
│       ├── uploads/
│       ├── database.py
│       ├── main.py
│       ├── schemas.py
│       └── utils.py
├── FrontEnd/
├── .gitignore
├── README.md
├── README.en.md
└── requirements.txt
```
 1. Clone the repository
```
git clone [https://github.com/your-username/financial-control.git](https://github.com/your-username/financial-control.git)
```
 2. Go to the project directory
```
cd Financial_control
```
 3. Install Python dependencies
```
pip install -r requirements.txt
```
 4. Start the FastAPI server
```
uvicorn src.app.main:app --reload
```
# Open a second terminal

5. Install REACT dependencies
```
npm install
```
6. Start REACT
```
npm run dev
```

With both terminals running:

Frontend: http://localhost:5173

Backend / API Docs: http://127.0.0.1:8000/docs
