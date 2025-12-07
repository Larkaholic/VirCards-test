export type AutopsyScenario = {
  scenario: string;
  causeOfDeath: string;
  timeOfDeath: string;
  injuriesSustained: string;
  injuries: Injury[];
  evidence: Evidence[];
};

export type OrganInteraction = {
  name: string;
  count: number;
};

export type DataTag = {
  id: string;
  text: string;
  position: THREE.Vector3;
};

export type Evidence = {
  id: string;
  description: string;
  type: 'visual' | 'toxicology' | 'document';
  discovered: boolean;
  data: Record<string, any>;
};

export type CauseOfDeath =
  | 'stabbing'
  | 'gunshot'
  | 'poisoning'
  | 'blunt-force-trauma'
  | 'unknown';

export type Injury = {
  type: CauseOfDeath;
  location: string; // e.g., 'Heart', 'Left Lung'
  position: [number, number, number];
  orientation: [number, number, number];
  size: [number, number, number];
};
