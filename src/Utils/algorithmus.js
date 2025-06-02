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
