from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# CORS für das React-Frontend erlauben
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"], # später auf http://localhost:5173 einschränken
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Datenmodelle =====
class Zuschnitt(BaseModel):
    breite: int
    länge: int

class Platte(BaseModel):
    breite: int
    länge: int

class OptimierungsAnfrage(BaseModel):
    platten: List[Platte]
    zuschnitte: List[Zuschnitt]


# ===== API-Endpoint =====
@app.post("/optimize")
def optimiere(anf: OptimierungsAnfrage):
    platzierungen = []
    belegung = []   # Hier wird belegte Flächen je Platte gespeichert

    for zuschnitt in anf.zuschnitte:
        platziert = False
        for i, platte in enumerate(anf.platten):
            platte_breite = platte.breite
            platte_länge = platte.länge
            belegte = belegung[i] if i < len(belegung) else []

            # Vereinfachung: versuche, ihn bei x = 0, y = sum(belegte Höhen) zu platzieren
            y_offset = sum(b['länge'] for b in belegte)
            if zuschnitt.breite <= platte_breite and zuschnitt.länge + y_offset <= platte_länge:
                platzierungen.append({
                    "x": 0,
                    "y": y_offset,
                    "breite": zuschnitt.breite,
                    "länge": zuschnitt.länge,
                    "rotation": False,
                    "platte": i
                })
                belegte.append({"länge": zuschnitt.länge})
                if i >= len(belegung):
                    belegung.append(belegte)
                else:
                    belegung[i] = belegte
                platziert = True
                break

        if not platziert:
            # neue Platte verwenden (wenn verfügbar)
            return {"message": "Nicht alle Zuschnitte passen", "platzierungen": platzierungen}
        
    return {"message": "Optimierung erfolgreich", "platzierungen": platzierungen}


@app.get("/")
def index():
    return {"message": "OptiCut V2 Backend läuft"}