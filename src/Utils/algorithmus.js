export function findePassendePlatte(zuschnitt, platten) {
  const passendePlatten = platten.filter(
    (platte) =>
      Number(platte.breite) >= Number(zuschnitt.breite) &&
      Number(platte.länge) >= Number(zuschnitt.länge)
  );

  if (Number(zuschnitt.breite) <= 0 || Number(zuschnitt.länge) <= 0)
    return null;

  // kleinste passende Platte anhand Fläche wählen
  return passendePlatten.reduce((kleinste, aktuelle) => {
    const flächeK = Number(kleinste.breite) * Number(kleinste.länge);
    const flächeA = Number(aktuelle.breite) * Number(aktuelle.länge);
    return flächeA < flächeK ? aktuelle : kleinste;
  });
}

export function gruppiereZuschnitteNachPlatte(zuschnitte, platten) {
  const zuordnung = {};

  for (const zuschnitt of zuschnitte) {
    const platte = findePassendePlatte(zuschnitt, platten);
    if (platte) {
      const key = `${platte.breite}x${platte.länge}`;
      if (!zuordnung[key]) zuordnung[key] = { platte, zuschnitte: [] };
      zuordnung[key].zuschnitte.push(zuschnitt);
    }
  }

  return Object.values(zuordnung);
}
