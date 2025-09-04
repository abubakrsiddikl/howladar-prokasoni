
import { useEffect, useState } from "react";
import bdLocation from "@/data/bd-location.json";

export interface LocationData {
  divisions: string[];
  districts: string[];
  cities: string[];
  setDivision: (division: string) => void;
  setDistrict: (district: string) => void;
  selectedDivision: string;
  selectedDistrict: string;
}

export const useLocationData = (): LocationData => {
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const divisions = bdLocation.shippingInfo.map((item) => item.divisionName);

  const [districts, setDistricts] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    const division = bdLocation.shippingInfo.find(
      (d) => d.divisionName === selectedDivision
    );
    if (division) {
      setDistricts(division.districts.map((d) => d.districtName));
    } else {
      setDistricts([]);
    }
    setSelectedDistrict("");
    setCities([]);
  }, [selectedDivision]);

  useEffect(() => {
    const division = bdLocation.shippingInfo.find(
      (d) => d.divisionName === selectedDivision
    );
    const district = division?.districts.find(
      (dist) => dist.districtName === selectedDistrict
    );
    if (district) {
      setCities(district.upazilas);
    } else {
      setCities([]);
    }
  }, [selectedDivision, selectedDistrict]);

  return {
    divisions,
    districts,
    cities,
    setDivision: setSelectedDivision,
    setDistrict: setSelectedDistrict,
    selectedDivision,
    selectedDistrict,
  };
};
