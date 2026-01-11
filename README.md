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

### Interogări de Bază
- **Verificare Conexiune**: Verifică dacă există conexiune directă între două locații
- **Găsire Rută**: Găsește rute cu intermediari între locații
- **Verificare Depozit**: Verifică dacă o locație este un depozit valid
- **Vehicul Potrivit**: Găsește vehicule capabile să transporte o anumită greutate
- **Comenzi**: Interogări despre comenzi (după locație de plecare/destinație)
- **Comenzi Prioritare**: Verifică comenzile cu prioritate 1 pentru o rută
- **Calcul Consum**: Calculează consumul de combustibil pentru o rută
- **Vehicul pentru Comandă**: Verifică dacă un vehicul poate transporta o comandă
- **Rută Optimă**: Găsește cea mai bună rută (după distanță sau timp)

### 🆕 Funcționalități Noi

#### 🗺️ Distanță cu Intermediar
Calculează distanța și timpul total pentru o rută cu punct intermediar.
- **Input**: Locație A (plecare), Locație C (intermediar), Locație B (destinație)
- **Output**: Distanță totală în km
- **Exemplu**: București → Ploiești → Constanța

#### 💰 Cost Transport
Calculează costul total de transport pe baza consumului vehiculului și prețului combustibilului.
- **Input**: Vehicul, Locație plecare, Locație destinație, Preț combustibil (RON/litru)
- **Output**: 
  - Consum total combustibil (litri)
  - Cost total transport (RON)
  - Cost per km (RON/km)
- **Exemplu**: tir1 de la București la Craiova cu combustibil 7.5 RON/L
- **Rezultat**: 87.5 litri, 656.25 RON total, 2.62 RON/km

#### 🛣️ Toate Rutele Disponibile
Găsește toate rutele posibile între două locații (directe și cu intermediari).
- **Input**: Locație plecare, Locație destinație
- **Output**: Lista tuturor rutelor sortate după distanță, cu traseu complet, distanță și timp
- **Exemplu**: București → Constanța găsește 5 rute diferite
- **Utilitate**: Comparare alternative, planificare back-up, alegere rută optimă

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

### 🆕 Exemple Noi

#### Cost Transport
```
Vehicul: tir1
Plecare: bucuresti
Destinație: craiova
Preț combustibil: 7.5 RON/L

Rezultat:
- Distanță: 250 km
- Consum: 35 L/100km
- Total combustibil: 87.5 litri
- Cost total: 656.25 RON
- Cost/km: 2.62 RON/km
```

#### Toate Rutele
```
Plecare: bucuresti
Destinație: constanta

Rezultat: 5 rute găsite
1. bucuresti → constanta (223 km, 150 min) ⭐ Cea mai scurtă
2. bucuresti → craiova → ploiesti → constanta (804 km, 540 min)
3. bucuresti → craiova → ploiesti → giurgiu → constanta (944 km, 655 min)
4. bucuresti → craiova → brasov → giurgiu → constanta (1055 km, 815 min)
5. bucuresti → craiova → brasov → giurgiu → ploiesti → constanta (1221 km, 940 min)
```

## API Endpoints

### POST `/api/query`
Execută interogări generale asupra bazei de cunoștințe.

### POST `/api/best_route`
Găsește ruta optimă între două locații.

### 🆕 POST `/api/all_routes`
Returnează toate rutele disponibile între două locații.
```json
{
  "start": "bucuresti",
  "end": "constanta"
}
```

### 🆕 POST `/api/transport_cost`
Calculează costul de transport.
```json
{
  "vehicle": "tir1",
  "start": "bucuresti",
  "end": "craiova",
  "fuel_price": 7.5
}
```

### Vehicul pentru Greutate
Parametri: `greutate=2000`

### Comenzi din Locație
Parametri: `Plecare=bucuresti`

### Consum Combustibil
Parametri: `A=bucuresti, B=craiova, Vehicul=tir1`
