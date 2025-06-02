function CuttingVisualizer({ daten }) {
  return (
    <div className="flex flex-wrap justify-center gap-10 p-6 w-full">
      {daten.map(({ platte, zuschnitte }, index) => {
        const breite = Number(platte.breite);
        const länge = Number(platte.länge);
        const ratio = breite / länge;

        // Maximalgröße auf dem Bildschirm
        const maxBreite = 400;
        const maxHöhe = 300;

        // Skalierte Maße berechnen, sodass Seitenverhältnis stimmt
        let scaledWidth = maxBreite;
        let scaledHeight = scaledWidth / ratio;

        if (scaledHeight > maxHöhe) {
          scaledHeight = maxHöhe;
          scaledWidth = scaledHeight * ratio;
        }

        return (
          <div key={index} className="text-center">
            <p className="font-bold mb-2">
              Hauptplatte: {breite} x {länge}
            </p>

            <div
              className="relative bg-gray-300 border-2 overflow-hidden shadow"
              style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
              }}
            >
              {zuschnitte.map((z, idx) => {
                const w = (z.breite / breite) * scaledWidth;
                const h = (z.länge / länge) * scaledHeight;

                return (
                  <div
                    key={idx}
                    className="absolute bg-green-500 border text-[10px] text-white flex items-center justify-center"
                    style={{
                      width: `${w}px`,
                      height: `${h}px`,
                      left: 0,
                      top: `${idx * 10}px`, // nur Test-Demo
                    }}
                  >
                    {z.breite}x{z.länge}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CuttingVisualizer;
