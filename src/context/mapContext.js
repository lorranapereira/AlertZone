import React, { createContext, useState } from "react";

export const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
  };

  const handleSuggestionsChange = (newSuggestions) => {
    setSuggestions(newSuggestions);
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  return (
    <MapContext.Provider
      value={{
        address,
        suggestions,
        selectedLocation,
        handleAddressChange,
        handleSuggestionsChange,
        handleLocationChange,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
