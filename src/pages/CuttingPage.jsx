import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { GoDot } from "react-icons/go";
import { GoDotFill } from "react-icons/go";

function CuttingPage() {
  const [panelOffen, setPanelOffen] = useState(false);
  const [maße, setMaße] = useState([]);
  const [platten, setPlatten] = useState([]); // Array weil mehrere Platten
  const [fill, setFill] = useState(false);

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
        className={`relative mb-8 border transition-all duration-300 overflow-y-scroll overflow-hidden ${
          panelOffen ? "h-[200px] overflow-y-scroll" : "h-[40px]"
        } bg-gray-100 shadow-md flex-shrink-0
            `}
      >
        <div className="absolute top-0 left-0 w-full flex justify-between h-10 bg-gray-400 border-b-1 items-center">
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

        <div className="flex gap-4 mt-10">
          {/* Sidebar links im Panel */}
          <div className="flex-shrink-0 justify-center items-center w-40 md:w-80 lg:w-100 bg-amber-400 h-50">
            <button onClick={() => setFill(false)}>
              {fill ? <GoDot size={15} /> : <GoDotFill size={15} />}
              <span className="text-md">Hauptplatten</span>
            </button>
          </div>
          {/* Eingabefelder für Zuschnitten */}
          <div className="flex flex-col h-6 gap-3 mt-3 flex-1">
            {maße.map((eintrag) => (
              <div
                key={eintrag.id}
                className="flex-1 flex items-center justify-end gap-8 sm:mr-4 md:mr-12 lg:mr-24"
              >
                <input
                  type="text"
                  value={eintrag.breite}
                  placeholder="Breite..."
                  onChange={(e) =>
                    handleInputChange(eintrag.id, "breite", e.target.value)
                  }
                  className="w-40 sm:w-35 md:w-40 lg:w-56 border-2 p-2 rounded-lg h-6"
                />
                <input
                  type="text"
                  value={eintrag.länge}
                  onChange={(e) =>
                    handleInputChange(eintrag.id, "länge", e.target.value)
                  }
                  placeholder="Länge..."
                  className="w-40 sm:w-35 md:w-40 lg:w-56 border-2 p-2 rounded-lg h-6"
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
      </div>
    </div>
  );
}

export default CuttingPage;
