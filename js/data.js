/* =========================================================================
   PORTFOLIO CONTENT — the only file you need to edit.
   - Add a project / cert / skill by adding an object to the matching array.
   - Leave a field empty ("" or []) and the UI simply hides it.
   - Leave a whole section empty and that section (and its nav link) disappears.
   - Icons: any key from the ICONS map in js/main.js (e.g. "brain", "eye").
   ========================================================================= */

window.PORTFOLIO = {
  profile: {
    name: "Alpesh Gaykar",
    shortName: "Alpesh",
    role: "AI & Data Science Engineer",
    location: "Mumbai, India",
    email: "ai.alpeshgaykar@gmail.com",
    phone: "+91 96041 77511",
    linkedin: "https://linkedin.com/in/alpeshgaykar",
    github: "",            // e.g. "https://github.com/yourname"
    resume: "",            // e.g. "assets/Alpesh_Gaykar_Resume.pdf"
    available: true,       // shows the "open to opportunities" badge
    headline: ["Turning data into", "intelligent systems."],
    rotatingRoles: [
      "Machine Learning",
      "Deep Learning",
      "Natural Language Processing",
      "Generative AI",
      "Computer Vision",
      "Data Analytics",
    ],
    intro:
      "AI & Data Science graduate building predictive models, computer-vision pipelines and generative AI apps — from raw data to deployed product.",
    // Big sentence in the About section that "lights up" word by word as you scroll
    statement:
      "I turn raw data into models that see, read, predict and create — and ship them as products people can actually use.",
    about: [
      "I'm an <b>AI & Data Science graduate</b> skilled in Machine Learning, Deep Learning, NLP, Data Analytics and Generative AI.",
      "I work mostly in <b>Python, SQL, TensorFlow, Scikit-learn and Power BI</b>, and enjoy taking ideas end-to-end — cleaning the data, training and evaluating models, and shipping them behind a usable interface.",
      "My path started with a Diploma in Information Technology and continued into a Bachelor's in AI & Data Science, giving me a foundation in both software engineering and data-driven problem solving.",
    ],
    // Shown in the hero code card
    codeStack: ["Python", "TensorFlow", "Scikit-learn", "LLMs"],
  },

  // Extra stats. Projects / certifications / skills counts are computed automatically.
  extraStats: [],

  skills: [
    { category: "ML & AI", icon: "brain",
      items: ["TensorFlow", "Scikit-learn", "Keras", "Pandas", "NumPy", "OpenCV", "NLP", "GANs", "Generative AI", "LLMs", "Prompt Engineering"] },
    { category: "Languages", icon: "code",
      items: ["Python", "SQL", "R", "C", "C++", "HTML", "CSS", "JavaScript"] },
    { category: "Tools", icon: "tool",
      items: ["Power BI", "MS Excel", "Jupyter", "Google Colab", "Git", "GitHub", "VS Code", "Linux"] },
    { category: "Concepts", icon: "chart",
      items: ["EDA", "Feature Engineering", "Data Wrangling", "REST APIs", "Model Evaluation"] },
    { category: "Databases", icon: "database",
      items: ["MySQL"] },
  ],

  projects: [
    {
      title: "APSR AI Content Creator",
      year: 2025,
      icon: "sparkles",
      tags: ["Generative AI", "NLP"],
      featured: true,
      description:
        "An AI system that generates images, memes and text from user prompts, combining NLP and GAN models with prompt engineering in a single creative pipeline.",
      tech: ["Python", "GANs", "NLP", "Generative AI"],
      links: { github: "", demo: "" },
    },
    {
      title: "Multiple Disease Prediction",
      year: 2024,
      icon: "pulse",
      tags: ["Machine Learning"],
      description:
        "Predicts likely diseases from symptoms. Full ML pipeline — preprocessing, feature selection, model training & evaluation — deployed as a Flask web app.",
      tech: ["Python", "Scikit-learn", "Flask"],
      links: { github: "", demo: "" },
    },
    {
      title: "Face Mask Detection",
      year: 2023,
      icon: "eye",
      tags: ["Computer Vision", "Deep Learning"],
      description:
        "Real-time face mask detection on live camera input using a CNN, classifying each face as Mask / No Mask with TensorFlow and OpenCV.",
      tech: ["Python", "OpenCV", "TensorFlow", "CNN"],
      links: { github: "", demo: "" },
    },
    {
      title: "NLP Sentiment Analyzer",
      year: 2023,
      icon: "chat",
      tags: ["NLP", "Machine Learning"],
      description:
        "Sentiment analysis on Twitter data: tokenization, stemming, stop-word removal and TF-IDF vectorization feeding an ML classifier.",
      tech: ["Python", "NLTK", "TF-IDF"],
      links: { github: "", demo: "" },
    },
  ],

  // Add internships / jobs here later — the section appears automatically.
  experience: [
    // { title: "ML Intern", org: "Company", period: "Jun 2025 — Aug 2025", description: "...", tags: ["Python"] },
  ],

  education: [
    {
      title: "B.E. — Artificial Intelligence & Data Science",
      org: "Datta Meghe College of Engineering, Navi Mumbai",
      period: "2022 — 2026",
      tags: ["Machine Learning", "Deep Learning", "NLP", "DBMS", "Computer Vision", "Statistics"],
    },
    {
      title: "Diploma — Information Technology",
      org: "Government Polytechnic Mumbai",
      period: "2019 — 2022",
      tags: ["Python", "Data Structures", "Networking", "DBMS", "HTML & CSS"],
    },
  ],

  certifications: [
    { title: "An Introduction to Generative AI", issuer: "Infosys Wingspan / Google Cloud", date: "Sep 2024", topics: "Generative AI, LLMs, prompt engineering", credentialId: "", url: "" },
    { title: "Python for Data Science", issuer: "Infosys Wingspan / Coursera", date: "Dec 2023", topics: "Python, NumPy, data analysis", credentialId: "", url: "" },
    { title: "R Training", issuer: "Spoken Tutorial, IIT Bombay", date: "Feb 2022", topics: "Data manipulation, statistics, visualization", credentialId: "2465689JTQ", url: "" },
    { title: "Linux Training", issuer: "Spoken Tutorial, IIT Bombay", date: "Aug 2021", topics: "Shell, system administration", credentialId: "2831554S10", url: "" },
    { title: "C Training", issuer: "Spoken Tutorial, IIT Bombay", date: "Jun 2021", topics: "C programming, problem solving", credentialId: "2465689JHJ", url: "" },
    { title: "C++ Training", issuer: "Spoken Tutorial, IIT Bombay", date: "May 2021", topics: "OOP, C++ fundamentals", credentialId: "283155408X", url: "" },
  ],

  contact: {
    heading: "Let's build something intelligent.",
    text: "I'm looking for roles in Machine Learning, Data Science and Generative AI. Have an opportunity or an idea? My inbox is always open.",
  },
};
