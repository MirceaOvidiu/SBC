# Sistem Logistic Web App

Web application pentru interogarea bazei de cunoștințe logistice.

## Instalare

1. Instalează dependențele:
```bash
pip install -r requirements.txt
```

## Rulare

1. Pornește serverul Flask:
```bash
python app.py
```

2. Deschide browser-ul la: `http://localhost:5000`

## Funcționalități

- **Verificare Conexiune**: Verifică dacă există conexiune directă între două locații
- **Găsire Rută**: Găsește rute cu intermediari între locații
- **Vehicul Potrivit**: Găsește vehicule capabile să transporte o anumită greutate
- **Comenzi**: Interogări despre comenzi (după locație de plecare/destinație)
- **Calcul Consum**: Calculează consumul de combustibil pentru o rută
- **Interogare Personalizată**: Parametri custom în format JSON

## Structură

```
├── app.py                 # Flask backend
├── InterfaceV2.py        # Inference engine
├── DatabaseV2.xml        # Knowledge base
├── templates/
│   └── index.html        # Frontend HTML
├── static/
│   ├── style.css         # Styling
│   └── script.js         # Frontend logic
└── requirements.txt      # Python dependencies
```

## Exemple de Interogări

### Conexiune Directă
Parametri: `A=bucuresti, B=craiova`

### Rută cu Intermediar
Parametri: `A=bucuresti, C=ploiesti, B=giurgiu`

### Vehicul pentru Greutate
Parametri: `greutate=2000`

### Comenzi din Locație
Parametri: `Plecare=bucuresti`

### Consum Combustibil
Parametri: `A=bucuresti, B=craiova, Vehicul=tir1`
