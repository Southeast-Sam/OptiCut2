from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Zuschnitt(BaseModel):
    breite: int
    länge: int

class Platte(BaseModel):
    breite: int
    länge: int

class OptimierungsDaten(BaseModel):
    platten: List[Platte]
    zuschnitte: List[Zuschnitt]

@app.post("/optimize")
def optimiere(daten: OptimierungsDaten):
    print("🔧 Backend hat Anfrage erhalten!")

    platzierungen = []
    rest_zuschnitte = daten.zuschnitte.copy()

    for platten_index, platte in enumerate(daten.platten):
        belegte_flaechen = []
        y_cursor = 0

        while y_cursor < platte.länge:
            x_cursor = 0
            max_zeilenhoehe = 0
            platz_in_dieser_zeile = False

            for zuschnitt in rest_zuschnitte[:]:
                for rotiert in [False, True]:
                    w = zuschnitt.breite if not rotiert else zuschnitt.länge
                    h = zuschnitt.länge if not rotiert else zuschnitt.breite

                    if x_cursor + w <= platte.breite and y_cursor + h <= platte.länge:
                        neue_box = {"x": x_cursor, "y": y_cursor, "breite": w, "länge": h}

                        if not kollidiert(neue_box, belegte_flaechen):
                            print(f"✅ Platziert: {w}x{h} auf Platte {platten_index}")
                            platzierungen.append({
                                "breite": zuschnitt.breite,
                                "länge": zuschnitt.länge,
                                "x": x_cursor,
                                "y": y_cursor,
                                "rotiert": rotiert,
                                "platten_index": platten_index
                            })
                            belegte_flaechen.append(neue_box)
                            rest_zuschnitte.remove(zuschnitt)
                            x_cursor += w
                            max_zeilenhoehe = max(max_zeilenhoehe, h)
                            platz_in_dieser_zeile = True
                            break  # Raus aus Rotation-Schleife

            if not platz_in_dieser_zeile:
                if max_zeilenhoehe == 0:
                    print("⚠️ Kein Platz in dieser Zeile, breche ab.")
                    break
                y_cursor += max_zeilenhoehe

        if not rest_zuschnitte:
            print("🎉 Alle Zuschnitte platziert.")
            break

    return {"platzierungen": platzierungen}

def kollidiert(neu, flaechen):
    for fl in flaechen:
        if not (
            neu["x"] + neu["breite"] <= fl["x"] or
            neu["x"] >= fl["x"] + fl["breite"] or
            neu["y"] + neu["länge"] <= fl["y"] or
            neu["y"] >= fl["y"] + fl["länge"]
        ):
            return True
    return False
