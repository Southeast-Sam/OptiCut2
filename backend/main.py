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
    rest_zuschnitte = sorted(
        daten.zuschnitte,
        key=lambda z: z.breite * z.länge,
        reverse=True
    )

    for platten_index, platte in enumerate(daten.platten):
        freie_flaechen = [{
            "x": 0,
            "y": 0,
            "breite": platte.breite,
            "länge": platte.länge
        }]

        platzierte_in_dieser_platte = []

        for zuschnitt in rest_zuschnitte[:]:
            platziert = False
            for i, frei in enumerate(freie_flaechen):
                for rotiert in [False, True]:
                    w = zuschnitt.breite if not rotiert else zuschnitt.länge
                    h = zuschnitt.länge if not rotiert else zuschnitt.breite

                    if w <= frei["breite"] and h <= frei["länge"]:
                        # Platziere
                        platzierung = {
                            "breite": zuschnitt.breite,
                            "länge": zuschnitt.länge,
                            "x": frei["x"],
                            "y": frei["y"],
                            "rotiert": rotiert,
                            "platten_index": platten_index
                        }
                        platzierungen.append(platzierung)
                        platzierte_in_dieser_platte.append(zuschnitt)
                        print(f"✅ Platziert: {w}x{h} auf Platte {platten_index}")

                        # Guillotine-Aufteilung
                        neue_flaechen = []

                        rechts = {
                            "x": frei["x"] + w,
                            "y": frei["y"],
                            "breite": frei["breite"] - w,
                            "länge": h
                        }
                        unten = {
                            "x": frei["x"],
                            "y": frei["y"] + h,
                            "breite": frei["breite"],
                            "länge": frei["länge"] - h
                        }

                        if rechts["breite"] > 0 and rechts["länge"] > 0:
                            neue_flaechen.append(rechts)
                        if unten["breite"] > 0 and unten["länge"] > 0:
                            neue_flaechen.append(unten)

                        freie_flaechen.pop(i)
                        freie_flaechen.extend(neue_flaechen)
                        platziert = True
                        break
                if platziert:
                    break
            if platziert:
                rest_zuschnitte.remove(zuschnitt)

        if not rest_zuschnitte:
            print("🎉 Alle Zuschnitte platziert!")
            break

    if rest_zuschnitte:
        print(f"⚠️ Nicht platzierbar: {[f'{z.breite}x{z.länge}' for z in rest_zuschnitte]}")

    return {"platzierungen": platzierungen}
