export type BDTip = {
  category: string;
  title: string;
  items: { heading: string; points: string[] }[];
};

export const healthTipsBD: BDTip[] = [
  {
    category: 'Dengue Prevention',
    title: 'Dengue Awareness during Monsoon',
    items: [
      { heading: 'Reduce Mosquito Breeding', points: [
        'Eliminate standing water (flower pots, buckets, tires)',
        'Change water in containers every 2–3 days',
        'Keep rooftop tanks and drums tightly covered'
      ]},
      { heading: 'Personal Protection', points: [
        'Use mosquito nets and repellents (DEET/PMD) at night',
        'Wear long sleeves and light-colored clothing',
        'Install window screens if possible'
      ]},
      { heading: 'When to Seek Care', points: [
        'High fever with severe headache or eye pain',
        'Bleeding gums, vomiting, or severe abdominal pain',
        'Go to hospital immediately if warning signs appear'
      ]}
    ]
  },
  {
    category: 'Water & Sanitation',
    title: 'Safe Water and Diarrhea Prevention',
    items: [
      { heading: 'Safe Drinking Water', points: [
        'Boil water for 1 minute or use certified filters',
        'Store in clean, covered containers; use ladle to pour',
        'Wash hands before handling water'
      ]},
      { heading: 'ORS at Home', points: [
        'Use WHO-ORS or homemade: 6 level tsp sugar + 1/2 tsp salt in 1 liter clean water',
        'Give small sips frequently after each loose stool',
        'Continue breastfeeding/regular diet for children'
      ]}
    ]
  },
  {
    category: 'Heatwave Safety',
    title: 'Stay Safe in High Heat',
    items: [
      { heading: 'Hydration', points: [
        'Drink water regularly; carry a bottle outdoors',
        'Avoid sugary drinks; choose water, lemon water, ORS',
        'Check on elderly/neighbors'
      ]},
      { heading: 'Exposure', points: [
        'Avoid peak sun (11am–4pm); seek shade',
        'Wear loose, light, breathable clothing',
        'Use umbrella/hat; rest often'
      ]}
    ]
  },
  {
    category: 'Air Pollution',
    title: 'Protect Yourself from Poor Air Quality',
    items: [
      { heading: 'Reduce Exposure', points: [
        'Wear a well-fitted mask (N95/KN95) outdoors',
        'Keep windows closed during peak pollution; ventilate when better',
        'Use indoor plants/air purifiers if available'
      ]},
      { heading: 'Vulnerable Groups', points: [
        'Children, elderly, pregnant women, and those with asthma/heart disease need extra caution',
        'Always carry inhaler/meds if prescribed'
      ]}
    ]
  },
  {
    category: 'Maternal & Child Health',
    title: 'Essential Care for Mothers and Children',
    items: [
      { heading: 'Pregnancy Care', points: [
        'Attend all antenatal check-ups',
        'Take iron-folic acid as advised',
        'Know danger signs: bleeding, severe headache, swelling'
      ]},
      { heading: 'Child Immunization', points: [
        'Follow EPI schedule; keep vaccination card safe',
        'Seek care for fever > 3 days, fast breathing, or poor feeding'
      ]}
    ]
  },
  {
    category: 'NCD Awareness',
    title: 'Diabetes & Hypertension Basics',
    items: [
      { heading: 'Lifestyle', points: [
        'Limit salt and sugar; avoid trans fats',
        'Walk 30 minutes daily; take the stairs',
        'Quit tobacco; limit alcohol'
      ]},
      { heading: 'Check-Ups', points: [
        'Screen blood pressure and blood sugar regularly',
        'Adhere to prescribed medications'
      ]}
    ]
  },
  {
    category: 'Nutrition',
    title: 'Balanced Diet on a Rice-Heavy Plate',
    items: [
        { heading: 'Add Protein & Iron', points: [
          'Add lentils, eggs, fish, or chicken to meals',
          'Include leafy greens (spinach), beans, and seasonal fruits',
          'Use iodized salt'
        ]},
        { heading: 'Meal Tips', points: [
          'Half plate vegetables, quarter protein, quarter rice/roti',
          'Carry healthy snacks: fruit, nuts, chana'
        ]}
    ]
  }
];
