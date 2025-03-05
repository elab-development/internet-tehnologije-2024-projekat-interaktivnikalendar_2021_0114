import { useEffect } from "react";
import { fetchSprints, fetchTasks, fetchHolidays } from "../components/api";

export const useFetchData = (
  setSprints,
  setTasks,
  setHolidays,
  country,
  year,
  refresh
) => {
  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        const [sprintsData, tasksData, holidaysData] = await Promise.all([
          fetchSprints(),
          fetchTasks(),
          fetchHolidays(country, year),
        ]);
        if (active) {
          setSprints(sprintsData);
          setTasks(tasksData);
          setHolidays(holidaysData);
        }
      } catch (error) {
        if (active) {
          alert("Failed to fetch data");
        }
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [refresh]);
};

export const useHandleClickOutside = (ref, buttonRef, setShow) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        (!buttonRef ||
          (buttonRef.current && !buttonRef.current.contains(event.target)))
      ) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, buttonRef, setShow]);
};
