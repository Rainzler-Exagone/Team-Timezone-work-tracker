import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TeamState } from "../types/teamTypes";

const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      team: [],

      addMember: (member) =>
        set((state) => ({ team: [...state.team, member] })),

      removeMember: (id) =>
        set((state) => {
          const updatedTeam = state.team.filter((m) => m.id !== id);
          return { team: updatedTeam };
        }),
    }),
    {
      name: "team-storage", // Key for localStorage
    }
  )
);

export default useTeamStore;

