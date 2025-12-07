import type {AutopsyScenario} from '@/lib/types';

export const predefinedScenario: AutopsyScenario = {
  scenario:
    'The deceased is a 45-year-old male found in his home office. There are no signs of forced entry. The scene suggests a sudden collapse. The initial report from paramedics notes a single, deep puncture wound to the chest.',
  causeOfDeath: 'stabbing',
  timeOfDeath: 'Approximately 10:00 PM',
  injuriesSustained:
    'A single, clean-edged stab wound is present on the anterior chest wall, directly over the heart. There are no other significant injuries or defensive wounds noted.',
  injuries: [
    {
      type: 'stabbing',
      location: 'Heart',
      position: [0, 0, 1.5],
      orientation: [0, 0, 0],
      size: [0.5, 0.5, 1],
    },
  ],
  evidence: [
    {
      id: 'evidence-heart',
      description:
        'The stab wound to the heart shows clean, incised margins with minimal surrounding contusion, suggesting a sharp, single-edged blade was used. The wound track passes directly through the right ventricle.',
      type: 'visual',
      discovered: false,
      data: {
        title: 'Stab Wound to Heart',
      },
    },
  ],
};
