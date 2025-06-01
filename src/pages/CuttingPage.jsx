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

  // Hauptplatten && Zuschnitten hinzufügen durch FaPlus
  const handleAdd = () => {
    if (fill) {
      // Zuschnitten
      setMaße([...maße, { id: Date.now(), breite: "", länge: "" }]);
    } else {
      // Hauptplatten
      setPlatten([...platten, { id: Date.now(), breite: "", länge: "" }]);
    }
  };

  // Zuschnitten Inputs
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

  // Hauptplatten Inputs
  const handleInputChangePlatte = (id, feld, wert) => {
    const neueListe = platten.map((eintrag) => {
      if (eintrag.id === id) {
        return { ...eintrag, [feld]: wert };
      }
      return eintrag;
    });
    setPlatten(neueListe);
  };

  const handleDeletePlatte = (id) => {
    setPlatten(platten.filter((eintrag) => eintrag.id !== id));
  };

  return (
    <div className="flex flex-col-reverse h-screen">
      {/* Panel */}
      <div
        className={`mb-8 border-2 transition-all duration-300 overflow-hidden ${
          panelOffen ? "h-[200px]" : "h-[40px]"
        } bg-gray-100 shadow-md flex-shrink-0
            `}
      >
        <div className="w-full flex justify-between h-10 bg-gray-400 border-b-2 items-center">
          <button
            onClick={() => setPanelOffen(!panelOffen)}
            className="p-3 text-md cursor-pointer"
          >
            {panelOffen ? "▼ schließen" : "▲ öffnen"}
          </button>
          <button onClick={handleAdd} className="text-md p-4 cursor-pointer">
            <FaPlusCircle size={24} />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar links im Panel */}
          <div className="flex flex-col flex-shrink-0 gap-2 ml-4 w-40 md:w-60 lg:w-80 border-r-2 border-black h-50">
            <button
              onClick={() => setFill(false)}
              className="flex items-center mt-10"
            >
              {!fill ? <GoDotFill size={20} /> : <GoDot size={20} />}
              <span className="text-lg">Hauptplatten</span>
            </button>

            <button onClick={() => setFill(true)} className="flex items-center">
              {fill ? <GoDotFill size={20} /> : <GoDot size={20} />}
              <span className="text-lg">Zuschnitte</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-scroll mb-12">
            {/* Eingabefelder für Zuschnitten */}
            <div className="flex flex-col h-6 gap-3 mt-3">
              {fill
                ? //  Zuschnitte anzeigen
                  maße.map((eintrag) => (
                    <div
                      key={eintrag.id}
                      className="flex-1 flex items-center justify-end gap-8 sm:mr-4 md:mr-12 lg:mr-24"
                    >
                      <input
                        type="text"
                        value={eintrag.breite}
                        placeholder="Breite..."
                        onChange={(e) =>
                          handleInputChange(
                            eintrag.id,
                            "breite",
                            e.target.value
                          )
                        }
                        className="w-40 sm:w-25 md:w-40 lg:w-56 border-2 p-2 rounded-lg h-6"
                      />
                      <input
                        type="text"
                        value={eintrag.länge}
                        onChange={(e) =>
                          handleInputChange(eintrag.id, "länge", e.target.value)
                        }
                        placeholder="Länge..."
                        className="w-40 sm:w-25 md:w-40 lg:w-56 border-2 p-2 rounded-lg h-6"
                      />

                      <button
                        onClick={() => handleDelete(eintrag.id)}
                        className="cursor-pointer"
                      >
                        <FaDeleteLeft size={24} />
                      </button>
                    </div>
                  ))
                : // Hauptplatten anzeigen
                  platten.map((eintrag) => (
                    <div
                      key={eintrag.id}
                      className="flex-1 flex items-center justify-end gap-8 sm:mr-4 md:mr-12 lg:mr-24"
                    >
                      <input
                        type="text"
                        value={eintrag.breite}
                        placeholder="Breite..."
                        onChange={(e) =>
                          handleInputChangePlatte(
                            eintrag.id,
                            "breite",
                            e.target.value
                          )
                        }
                        className="w-40 sm:w-25 md:w-40 lg:w-56 border-2 p-2 rounded-lg h-6"
                      />

                      <input
                        type="text"
                        value={eintrag.länge}
                        placeholder="Länge..."
                        onChange={(e) =>
                          handleInputChangePlatte(
                            eintrag.id,
                            "länge",
                            e.target.value
                          )
                        }
                        className="w-40 sm:w-25 md:w-40 lg:w-56 border-2 p-2 rounded-lg h-6"
                      />

                      <button onClick={() => handleDeletePlatte(eintrag.id)}>
                        <FaDeleteLeft size={24} />
                      </button>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CuttingPage;
