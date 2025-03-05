import { useEffect } from "react";
import { fetchActiveTeams, fetchArchivedTeams } from "../components/api";

export const useFetchActiveTeams = (setSprints, refresh) => {
  useEffect(() => {
    let active = true;
    fetchActiveTeams().then((data) => {
      if (active) setSprints(data);
    });

    return () => {
      active = false;
    };
  }, [refresh]);
};

export const useFetchArchivedTeams = (
  setArchivedSprints,
  showArchivedTeams,
  refresh
) => {
  useEffect(() => {
    if (showArchivedTeams) {
      let active = true;
      fetchArchivedTeams().then((data) => {
        if (active) setArchivedSprints(data);
      });

      return () => {
        active = false;
      };
    }
  }, [showArchivedTeams, refresh]);
};
