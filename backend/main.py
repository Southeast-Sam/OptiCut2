from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# CORS erlauben für Frontend-Zugriff
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


class Platzierung(BaseModel):
    breite: int
    länge: int
    x: int
    y: int
    rotiert: bool
    platten_index: int


class OptimierungsDaten(BaseModel):
    platten: List[Platte]
    zuschnitte: List[Zuschnitt]


@app.post("/optimize")
def optimiere(daten: OptimierungsDaten):
    platzierungen = []

    # Jede Hauptplatte
    for platten_index, platte in enumerate(daten.platten):
        belegte_flaechen = []
        y_cursor = 0

        while True:
            x_cursor = 0
            max_zeilenhoehe = 0
            platz_in_zeile = False

            for zuschnitt in daten.zuschnitte:
                if any(pz['breite'] == zuschnitt.breite and pz['länge'] == zuschnitt.länge for pz in platzierungen):
                    continue  # Schon platziert

                for rotiert in [False, True]:
                    w = zuschnitt.breite if not rotiert else zuschnitt.länge
                    h = zuschnitt.länge if not rotiert else zuschnitt.breite

                    # Prüfen ob Platz in dieser Zeile ist
                    if x_cursor + w <= platte.breite and y_cursor + h <= platte.länge:
                        neue_box = {"x": x_cursor, "y": y_cursor, "breite": w, "länge": h}

                        # Keine Kollision mit anderen
                        if not kollidiert(neue_box, belegte_flaechen):
                            platzierungen.append({
                                "breite": zuschnitt.breite,
                                "länge": zuschnitt.länge,
                                "x": x_cursor,
                                "y": y_cursor,
                                "rotiert": rotiert,
                                "platten_index": platten_index
                            })
                            belegte_flaechen.append(neue_box)
                            x_cursor += w
                            max_zeilenhoehe = max(max_zeilenhoehe, h)
                            platz_in_zeile = True
                            break

                if platz_in_zeile:
                    continue

            if not platz_in_zeile:
                y_cursor += max_zeilenhoehe
                if y_cursor >= platte.länge:
                    break  # Keine Zeilen mehr übrig
                else:
                    continue

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