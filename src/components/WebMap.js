import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Corrige URLs dos ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const WebMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = L.map(mapRef.current).setView([-32.035, -52.0986], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([-32.035, -52.0986])
      .addTo(map)
      .bindPopup("Suspeito vendendo celular")
      .openPopup();

    L.marker([-32.04, -52.11])
      .addTo(map)
      .bindPopup("Suspeito em atividade");

    return () => {
      map.remove(); // Remove o mapa ao desmontar o componente
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100%", borderRadius: "10px" }}
    />
  );
};

export default WebMap;
