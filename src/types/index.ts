export interface ITeamMember {
  name: string;
  email: string;
  phone: string;
  institution: string;
  year: number;
  isa: "student" | "professional";
  city: string;
  state: string;
}

export interface ITeamData {
  allowEdits?: boolean;
  teamNumber: string;
  teamName: string;
  ideaTitle: string;
  ideaDescription: string;
  lead: ITeamMember;
  members: [ITeamMember, ITeamMember, ITeamMember];
}

export interface ITeamEvaluation {
  teamNumber: string;
  teamName: string;
  teamIdea: string;
  evaluations: Array<{
    evaluatedBy: {
      uuid: string;
      email: string;
    };
    evaluation: {
      descriptionMatch: number;
      deployment: number;
      businessValue: number;
      execution: number;
      presentation: number;
      overall: number;
      usesGemini: boolean;
      usesAI: boolean;
      isAgent: boolean;
      predeveloped: boolean;
      changedIdea: boolean;
      remarks: string;
    };
    leadPresent: boolean;
    member1Present: boolean;
    member2Present: boolean;
    member3Present: boolean;
    totalPoints: number;
    assessedAt: Date; // Changed from Firestore timestamp to Date
  }>;
  createdAt?: any; // Document-level creation timestamp
  lastUpdated?: any; // Document-level last update timestamp
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}
