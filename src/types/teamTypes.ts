export interface MemberType {
    id: string;
    name: string;
    timezone: string;
    workingHours: string;
    currentTime: string;
    LocalWorkHours: string;
}

export interface TeamState {
    team: MemberType[];
    addMember: (member: MemberType) => void;
    removeMember: (id: string) => void;
}
