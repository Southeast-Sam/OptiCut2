# OptiCut V2

OptiCut basiert auf der Idee, dass Nutzer mehrere Hauptplatten direkt am Anfang eingeben können.
So sehen sie sofort, wie viel Plattenmaterial sie insgesamt benötigen, bevor gesägt wird - mit dem Ziel, möglichst wenig Verschnitt zu erzeugen und Materialkosten und Zeit zu sparen.

Die App sollte dabei helfen, Zuschnitte automatisch auf vorhandene Platten zu verteilen.

## Features

- Eingabe beliebig vieler **Hauptplatten**
- Eingabe und Verwaltung von **Zuschnitten**
- Klare, aufgeräumte Benutzeroberfläche (TailwindCSS)
- React + React Router Struktur
- Automatische Auswahl der kleinsten passenden Hauptplatte
- Zuschnitt-Optimierung mit intelligenter Platzierung
- PDF-Export & Verlaufsspeicherung

## Tech Stack

- **React**
- **TailwindCSS**
- **React Router**
- **React Icons**
- **Vite**

## Status

Dieses Projekt befindet sich aktuell in der aktiven Entwicklung. Weitere Funktionen wie automatische Zuschnittplatzierung, PDF-Export und Plattenwahl werden schrittweise hinzugefügt.

## Projektstruktur

```bash
src/
├── components/       # UI-Komponenten
├── pages/            # Seiten wie CuttingPage, PDFExportPage
├── utils/            # Hilfsfunktionen (z. B. Optimierer)
├── App.jsx           # Haupt-Routing
├── main.jsx          # Entry Point

```
