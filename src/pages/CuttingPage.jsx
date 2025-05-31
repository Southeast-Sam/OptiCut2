import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";

function CuttingPage() {
  const [panelOffen, setPanelOffen] = useState(false);
  const [maße, setMaße] = useState([]);

  const handleInputChange = (id, feld, wert) => {
    const neueListe = maße.map((eintrag) => {
      if (eintrag.id === id) {
        return { ...eintrag, [feld]: wert };
      }
      return eintrag;
    });
    setMaße(neueListe);
  };

  const handleDelete = (id) => {
    setMaße(maße.filter((eintrag) => eintrag.id !== id));
  };
  return (
    <div className="flex flex-col-reverse h-screen">
      {/* Panel */}
      <div
        className={`mb-8 border transition-all duration-300 overflow-hidden ${
          panelOffen ? "h-[200px] overflow-y-scroll" : "h-[40px]"
        } bg-gray-100 shadow-md flex-shrink-0
            `}
      >
        <div className="flex justify-between h-10 bg-gray-400 border-b-1 items-center">
          <button
            onClick={() => setPanelOffen(!panelOffen)}
            className="p-3 text-md cursor-pointer"
          >
            {panelOffen ? "▼ schließen" : "▲ öffnen"}
          </button>
          <button
            onClick={() => {
              setMaße([...maße, { id: Date.now(), breite: "", länge: "" }]);
            }}
            className="text-md p-4 cursor-pointer"
          >
            <FaPlusCircle size={24} />
          </button>
        </div>

        {/* Eingabefelder für Zuschnitten */}
        {maße.map((eintrag) => (
          <div
            key={eintrag.id}
            className="flex justify-center gap-10 mt-3 ml-6"
          >
            <input
              type="text"
              value={eintrag.breite}
              placeholder="Breite..."
              onChange={(e) =>
                handleInputChange(eintrag.id, "breite", e.target.value)
              }
              className="border-2 p-2 rounded-lg h-6"
            />
            <input
              type="text"
              value={eintrag.länge}
              onChange={(e) =>
                handleInputChange(eintrag.id, "länge", e.target.value)
              }
              placeholder="Länge..."
              className="border-2 p-2 rounded-lg h-6"
            />

            <button
              onClick={() => handleDelete(eintrag.id)}
              className="cursor-pointer"
            >
              <FaDeleteLeft size={24} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CuttingPage;
