export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
};

const make = (id: number, title: string, category: string, date: string): BlogPost => ({
  id,
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + id,
  title,
  excerpt: 'Actionable guidance from Doctori AI on ' + title.toLowerCase() + '. Practical, trustworthy, and easy to follow.',
  category,
  readTime: `${4 + (id % 5)} min read`,
  date,
  image: `https://picsum.photos/seed/health-${id}/400/250`
});

export const blogPosts: BlogPost[] = [
  // Children’s Health (1-7)
  make(1, "Child Fever: What Parents Should Know", "Children's Health", '2025-07-01'),
  make(2, "Common Childhood Vaccines Explained", "Children's Health", '2025-06-28'),
  make(3, "Managing Cough and Cold in Kids", "Children's Health", '2025-06-25'),
  make(4, "Healthy School Lunchbox Ideas", "Children's Health", '2025-06-22'),
  make(5, "Recognizing Dehydration in Children", "Children's Health", '2025-06-18'),
  make(6, "When to See a Pediatrician", "Children's Health", '2025-06-15'),
  make(7, "Screen Time Balance for Kids", "Children's Health", '2025-06-12'),
  // Diseases and Conditions (8-14)
  make(8, "Understanding Dengue Symptoms", "Diseases and Conditions", '2025-06-09'),
  make(9, "Hypertension Basics", "Diseases and Conditions", '2025-06-06'),
  make(10, "Type 2 Diabetes Early Signs", "Diseases and Conditions", '2025-06-03'),
  make(11, "Asthma Triggers and Control", "Diseases and Conditions", '2025-05-31'),
  make(12, "Tuberculosis Awareness", "Diseases and Conditions", '2025-05-28'),
  make(13, "Thyroid Disorders: A Primer", "Diseases and Conditions", '2025-05-25'),
  make(14, "Migraine vs Headache", "Diseases and Conditions", '2025-05-22'),
  // Healthy Living (15-21)
  make(15, "Daily Habits for Better Sleep", "Healthy Living", '2025-05-19'),
  make(16, "Stress Management Techniques", "Healthy Living", '2025-05-16'),
  make(17, "Hydration: How Much Water?", "Healthy Living", '2025-05-13'),
  make(18, "Building a Simple Home Workout", "Healthy Living", '2025-05-10'),
  make(19, "Healthy Habits for Busy People", "Healthy Living", '2025-05-07'),
  make(20, "Sun Safety and Skin Care", "Healthy Living", '2025-05-04'),
  make(21, "Healthy Sleep for Shift Workers", "Healthy Living", '2025-05-01'),
  // Men's Health (22-27)
  make(22, "Men's Heart Health Essentials", "Men's Health", '2025-04-28'),
  make(23, "Prostate Health Awareness", "Men's Health", '2025-04-25'),
  make(24, "Fitness After 40: Safe Routines", "Men's Health", '2025-04-22'),
  make(25, "Managing Work Stress for Men", "Men's Health", '2025-04-19'),
  make(26, "Nutrition Tips for Muscle Health", "Men's Health", '2025-04-16'),
  make(27, "Understanding Hair Loss Causes", "Men's Health", '2025-04-13'),
  // Nutrition and Fitness (28-34)
  make(28, "Balanced Plate: Protein, Carbs, Fats", "Nutrition and Fitness", '2025-04-10'),
  make(29, "Beginner's Guide to Walking Workouts", "Nutrition and Fitness", '2025-04-07'),
  make(30, "Affordable High-Protein Foods", "Nutrition and Fitness", '2025-04-04'),
  make(31, "Meal Prep for Busy Weeks", "Nutrition and Fitness", '2025-04-01'),
  make(32, "Strength Training Basics at Home", "Nutrition and Fitness", '2025-03-29'),
  make(33, "Fiber-Rich Foods for Gut Health", "Nutrition and Fitness", '2025-03-26'),
  make(34, "Cardio vs Strength: What to Choose?", "Nutrition and Fitness", '2025-03-23'),
  // Symptoms and Diagnosis (35-41)
  make(35, "When Chest Pain Is an Emergency", "Symptoms and Diagnosis", '2025-03-20'),
  make(36, "Persistent Cough: What It Means", "Symptoms and Diagnosis", '2025-03-17'),
  make(37, "Fever Patterns and What They Signal", "Symptoms and Diagnosis", '2025-03-14'),
  make(38, "Shortness of Breath: Red Flags", "Symptoms and Diagnosis", '2025-03-11'),
  make(39, "Abdominal Pain: When to Worry", "Symptoms and Diagnosis", '2025-03-08'),
  make(40, "Headache Types Simplified", "Symptoms and Diagnosis", '2025-03-05'),
  make(41, "Dizziness: Causes and Care", "Symptoms and Diagnosis", '2025-03-02'),
  // Treatments and Prevention (42-47)
  make(42, "Antibiotics: When They Help", "Treatments and Prevention", '2025-02-27'),
  make(43, "Vaccination Myths vs Facts", "Treatments and Prevention", '2025-02-24'),
  make(44, "Home First Aid Essentials", "Treatments and Prevention", '2025-02-21'),
  make(45, "Preventing Seasonal Flu", "Treatments and Prevention", '2025-02-18'),
  make(46, "Managing High Cholesterol", "Treatments and Prevention", '2025-02-15'),
  make(47, "Back Pain: Prevention Basics", "Treatments and Prevention", '2025-02-12'),
  // Women's Health (48-55)
  make(48, "PCOS: Signs and Lifestyle Tips", "Women's Health", '2025-02-09'),
  make(49, "Iron Deficiency in Women", "Women's Health", '2025-02-06'),
  make(50, "Breast Self-Exam: How-To", "Women's Health", '2025-02-03'),
  make(51, "Prenatal Nutrition Essentials", "Women's Health", '2025-01-31'),
  make(52, "Period Pain: Relief Tips", "Women's Health", '2025-01-28'),
  make(53, "Menopause: Common Symptoms", "Women's Health", '2025-01-25'),
  // More General Wellness (54-60)
  make(54, "Safe Drinking Water at Home", "Healthy Living", '2025-01-22'),
  make(55, "Healthy Weight Loss Basics", "Nutrition and Fitness", '2025-01-19'),
  make(56, "Office Ergonomics to Prevent Pain", "Healthy Living", '2025-01-16'),
  make(57, "Allergy Season: Preparation Tips", "Diseases and Conditions", '2025-01-13'),
  make(58, "Healthy Morning Routine", "Healthy Living", '2025-01-10'),
  make(59, "Reading Food Labels Simply", "Nutrition and Fitness", '2025-01-07'),
  make(60, "Mindful Eating for Beginners", "Nutrition and Fitness", '2025-01-04'),
];
