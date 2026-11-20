/* =====================================================================
   LOOT MARKET — Product catalogue
   Product names, MRP and selling prices are modelled on Amazon.in
   listings (snapshot, INR). Prices on Amazon change daily, so treat
   these as reference values, not live prices.
   ===================================================================== */

const UNSPLASH = (id, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

const CATEGORIES = [
  { id: "electronics", name: "Electronics", blurb: "Phones, audio, laptops & TVs", subs: ["Mobiles", "Audio", "Laptops", "Wearables", "Televisions"], tone: "#E9EEF5" },
  { id: "fashion", name: "Fashion", blurb: "Clothing, shoes & accessories", subs: ["Men", "Women", "Footwear", "Accessories"], tone: "#F4ECE4" },
  { id: "home", name: "Home & Kitchen", blurb: "Appliances, storage & furniture", subs: ["Appliances", "Kitchenware", "Furniture"], tone: "#EAF1EA" },
  { id: "beauty", name: "Beauty & Care", blurb: "Skincare, makeup & grooming", subs: ["Skincare", "Makeup", "Grooming", "Fragrance"], tone: "#F6E9EC" },
  { id: "books", name: "Books", blurb: "Bestsellers & self-help", subs: ["Self-help", "Finance", "Fiction"], tone: "#F3EFE2" },
  { id: "sports", name: "Sports & Fitness", blurb: "Gym, yoga & outdoor play", subs: ["Fitness", "Yoga", "Outdoor"], tone: "#E6F0F0" },
  { id: "gaming", name: "Toys & Gaming", blurb: "Consoles, controllers & LEGO", subs: ["Gaming", "Toys"], tone: "#EEEAF4" }
];

const PRODUCTS = [
  /* ---------------- ELECTRONICS : MOBILES ---------------- */
  {
    id: "LM1001", cat: "electronics", sub: "Mobiles", brand: "Apple",
    title: "Apple iPhone 15 (128 GB) – Black",
    price: 61900, mrp: 69900, rating: 4.5, reviews: 8432, stock: 14, badge: "Bestseller",
    img: UNSPLASH("photo-1592750475338-74b7b21085ab"),
    colors: [["Black", "#2b2b2e"], ["Blue", "#c9d6df"], ["Pink", "#f1d4d6"], ["Green", "#d6e2cf"]],
    options: { label: "Storage", values: ["128 GB", "256 GB", "512 GB"], add: [0, 10000, 30000] },
    highlights: [
      "Dynamic Island bubbles up alerts and Live Activities so you don't miss them while doing something else",
      "48MP Main camera with 2x Telephoto — shoot super high-resolution photos with incredible detail",
      "A16 Bionic chip powers advanced photography features and all-day battery life",
      "Durable colour-infused back glass and aluminium design, IP68 splash, water and dust resistant",
      "USB-C connector lets you charge your Mac or iPad with the same cable"
    ],
    specs: { "Display": "6.1\" Super Retina XDR OLED", "Processor": "A16 Bionic, 6-core CPU", "Rear Camera": "48MP + 12MP", "Front Camera": "12MP TrueDepth", "Battery": "Up to 20 hrs video playback", "OS": "iOS 17", "Weight": "171 g", "In the box": "iPhone, USB-C cable" }
  },
  {
    id: "LM1002", cat: "electronics", sub: "Mobiles", brand: "Samsung",
    title: "Samsung Galaxy S24 Ultra 5G AI Smartphone (Titanium Gray, 12GB, 256GB)",
    price: 109999, mrp: 134999, rating: 4.3, reviews: 3120, stock: 6, badge: "Galaxy AI",
    img: UNSPLASH("photo-1610945415295-d9bbf067e59c"),
    colors: [["Titanium Gray", "#8d8a85"], ["Titanium Black", "#2f2f31"], ["Titanium Violet", "#a59bb3"]],
    options: { label: "Storage", values: ["256 GB", "512 GB", "1 TB"], add: [0, 12000, 36000] },
    highlights: [
      "Circle to Search with Google — circle anything on screen to search without switching apps",
      "Live Translate for two-way, real-time voice and text translation of phone calls",
      "200MP wide camera with ProVisual Engine and 100x Space Zoom",
      "Built-in S Pen, titanium frame and Corning Gorilla Armor glass",
      "Snapdragon 8 Gen 3 for Galaxy with 7 years of OS upgrades"
    ],
    specs: { "Display": "6.8\" QHD+ Dynamic AMOLED 2X, 120Hz", "Processor": "Snapdragon 8 Gen 3 for Galaxy", "RAM": "12 GB", "Rear Camera": "200MP + 50MP + 12MP + 10MP", "Battery": "5000 mAh, 45W", "OS": "Android 14, One UI 6.1", "Weight": "232 g" }
  },
  {
    id: "LM1003", cat: "electronics", sub: "Mobiles", brand: "OnePlus",
    title: "OnePlus Nord CE4 5G (Celadon Marble, 8GB RAM, 128GB Storage)",
    price: 22999, mrp: 24999, rating: 4.2, reviews: 15670, stock: 40,
    img: UNSPLASH("photo-1598327105666-5b89351aff97"),
    colors: [["Celadon Marble", "#9fc2b5"], ["Dark Chrome", "#3a3c40"]],
    options: { label: "Variant", values: ["8GB + 128GB", "8GB + 256GB"], add: [0, 2000] },
    highlights: [
      "Snapdragon 7 Gen 3 mobile platform for smooth multitasking and gaming",
      "100W SUPERVOOC charging — a day's power in 15 minutes",
      "50MP Sony LYT-600 main camera with OIS",
      "6.7\" 120Hz AMOLED display with Aqua Touch",
      "5500 mAh battery, OxygenOS 14 based on Android 14"
    ],
    specs: { "Display": "6.7\" FHD+ AMOLED, 120Hz", "Processor": "Snapdragon 7 Gen 3", "RAM": "8 GB LPDDR4X", "Rear Camera": "50MP + 8MP", "Front Camera": "16MP", "Battery": "5500 mAh, 100W", "Weight": "186 g" }
  },
  {
    id: "LM1004", cat: "electronics", sub: "Mobiles", brand: "Redmi",
    title: "Redmi Note 13 5G (Arctic White, 6GB RAM, 128GB Storage)",
    price: 16999, mrp: 20999, rating: 4.0, reviews: 22410, stock: 52,
    img: UNSPLASH("photo-1574944985070-8f3ebc6b79d2"),
    colors: [["Arctic White", "#eceae6"], ["Stealth Black", "#232325"], ["Prism Gold", "#d8c6a2"]],
    options: { label: "Variant", values: ["6GB + 128GB", "8GB + 256GB", "12GB + 256GB"], add: [0, 2000, 4000] },
    highlights: [
      "108MP 3x in-sensor zoom camera for crisp portraits",
      "6.67\" FHD+ AMOLED display, 120Hz, 1000 nits peak brightness",
      "MediaTek Dimensity 6080 6nm 5G processor",
      "5000 mAh battery with 33W fast charger in the box",
      "IP54 splash resistance, slim 7.6mm design"
    ],
    specs: { "Display": "6.67\" AMOLED, 120Hz", "Processor": "Dimensity 6080", "RAM": "6 GB", "Rear Camera": "108MP + 8MP + 2MP", "Battery": "5000 mAh, 33W", "Weight": "174.5 g" }
  },

  /* ---------------- ELECTRONICS : AUDIO ---------------- */
  {
    id: "LM1101", cat: "electronics", sub: "Audio", brand: "Apple",
    title: "Apple AirPods Pro (2nd Generation) with MagSafe Case (USB‑C)",
    price: 20900, mrp: 24900, rating: 4.6, reviews: 11250, stock: 22, badge: "Top rated",
    img: UNSPLASH("photo-1600294037681-c80b4cb5b434"),
    highlights: [
      "Up to 2x more Active Noise Cancellation than the previous generation",
      "Adaptive Audio blends Transparency and ANC based on your environment",
      "Personalised Spatial Audio with dynamic head tracking",
      "Up to 6 hours listening time; up to 30 hours with case",
      "Dust, sweat and water resistant (IP54) earbuds and case"
    ],
    specs: { "Chip": "Apple H2", "Noise control": "ANC + Transparency", "Battery": "6 h (30 h with case)", "Connector": "USB-C, MagSafe", "Water resistance": "IP54", "Weight": "5.3 g per bud" }
  },
  {
    id: "LM1102", cat: "electronics", sub: "Audio", brand: "Sony",
    title: "Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones",
    price: 26990, mrp: 34990, rating: 4.4, reviews: 6890, stock: 9,
    img: UNSPLASH("photo-1618366712010-f4ae9c647dcb"),
    colors: [["Black", "#1f1f1f"], ["Silver", "#d9d6d0"], ["Midnight Blue", "#2c3446"]],
    highlights: [
      "Industry-leading noise cancellation with two processors and 8 microphones",
      "Auto NC Optimizer adjusts noise cancelling to your environment",
      "Up to 30-hour battery; 3 min charge gives 3 hours of playback",
      "Crystal-clear hands-free calling with AI noise reduction",
      "Multipoint connection — pair two Bluetooth devices at once"
    ],
    specs: { "Driver": "30 mm carbon fibre dome", "Battery": "30 hours (NC on)", "Bluetooth": "5.2, LDAC", "Charging": "USB-C fast charge", "Weight": "250 g" }
  },
  {
    id: "LM1103", cat: "electronics", sub: "Audio", brand: "boAt",
    title: "boAt Airdopes 141 Bluetooth TWS Earbuds with 42H Playtime, ENx Tech",
    price: 1099, mrp: 4490, rating: 4.0, reviews: 384200, stock: 230, badge: "Deal",
    img: UNSPLASH("photo-1590658268037-6bf12165a8df"),
    colors: [["Bold Black", "#1c1c1c"], ["Cider Cyan", "#7cc7c8"], ["Pure White", "#f2f2f0"]],
    highlights: [
      "42 hours total playback with the charging case",
      "ENx Environmental Noise Cancellation for clear calls",
      "BEAST Mode with 50ms low latency for gaming",
      "ASAP Charge — 5 min charge gives 75 min playback",
      "IPX4 water resistance, IWP instant pairing"
    ],
    specs: { "Driver": "8 mm", "Battery": "42 hours total", "Bluetooth": "v5.1", "Water resistance": "IPX4", "Charging": "USB Type-C" }
  },
  {
    id: "LM1104", cat: "electronics", sub: "Audio", brand: "JBL",
    title: "JBL Flip 6 Wireless Portable Bluetooth Speaker, IP67 Waterproof",
    price: 9999, mrp: 14999, rating: 4.5, reviews: 9840, stock: 18,
    img: UNSPLASH("photo-1608043152269-423dbba4e7e1"),
    colors: [["Black", "#1d1d1d"], ["Blue", "#2d5c9e"], ["Red", "#b3262b"], ["Teal", "#2d8c8a"]],
    highlights: [
      "JBL Original Pro Sound with racetrack woofer and separate tweeter",
      "IP67 waterproof and dustproof — take it to the pool or the beach",
      "12 hours of playtime on a single charge",
      "PartyBoost — pair two compatible JBL speakers for stereo sound",
      "JBL Portable app for EQ and firmware updates"
    ],
    specs: { "Output": "20W woofer + 10W tweeter", "Battery": "12 hours", "Bluetooth": "5.1", "Rating": "IP67", "Weight": "550 g" }
  },

  /* ---------------- ELECTRONICS : LAPTOPS ---------------- */
  {
    id: "LM1201", cat: "electronics", sub: "Laptops", brand: "Apple",
    title: "Apple MacBook Air Laptop M2 chip: 13.6\" Liquid Retina, 8GB RAM, 256GB SSD",
    price: 79990, mrp: 99900, rating: 4.6, reviews: 5210, stock: 7, badge: "Bestseller",
    img: UNSPLASH("photo-1517336714731-489689fd1ca8"),
    colors: [["Midnight", "#2e3641"], ["Starlight", "#e6dfd3"], ["Space Grey", "#7d7e80"], ["Silver", "#e3e4e5"]],
    options: { label: "Configuration", values: ["8GB / 256GB", "16GB / 256GB", "16GB / 512GB"], add: [0, 20000, 40000] },
    highlights: [
      "Strikingly thin design weighing just 1.24 kg, fanless and silent",
      "M2 chip with 8-core CPU and up to 10-core GPU",
      "Up to 18 hours of battery life",
      "13.6\" Liquid Retina display with 500 nits brightness and 1 billion colours",
      "1080p FaceTime HD camera, three-mic array and four-speaker sound system"
    ],
    specs: { "Processor": "Apple M2, 8-core CPU", "RAM": "8 GB unified memory", "Storage": "256 GB SSD", "Display": "13.6\" 2560×1664", "Battery": "Up to 18 hours", "Ports": "2× Thunderbolt, MagSafe 3, 3.5 mm", "Weight": "1.24 kg" }
  },
  {
    id: "LM1202", cat: "electronics", sub: "Laptops", brand: "HP",
    title: "HP Victus Gaming Laptop, 12th Gen Intel Core i5-12450H, RTX 3050, 16GB, 512GB SSD, 15.6\" FHD 144Hz",
    price: 58990, mrp: 76640, rating: 4.1, reviews: 2870, stock: 11,
    img: UNSPLASH("photo-1603302576837-37561b2e2302"),
    highlights: [
      "NVIDIA GeForce RTX 3050 4GB graphics for smooth 1080p gaming",
      "15.6\" FHD 144Hz IPS anti-glare display with 250 nits",
      "16 GB DDR4 RAM, 512 GB PCIe NVMe SSD",
      "Improved thermal design with dual fans and expanded rear vents",
      "Windows 11 Home and MS Office Home & Student 2021 pre-installed"
    ],
    specs: { "Processor": "Intel Core i5-12450H", "GPU": "RTX 3050 4GB", "RAM": "16 GB DDR4", "Storage": "512 GB SSD", "Display": "15.6\" FHD 144Hz", "Weight": "2.29 kg" }
  },
  {
    id: "LM1203", cat: "electronics", sub: "Laptops", brand: "Lenovo",
    title: "Lenovo IdeaPad Slim 3 AMD Ryzen 5 7520U 15.6\" FHD Thin & Light Laptop (16GB/512GB SSD)",
    price: 37990, mrp: 64890, rating: 4.0, reviews: 4120, stock: 25, badge: "41% off",
    img: UNSPLASH("photo-1496181133206-80ce9b88a853"),
    highlights: [
      "AMD Ryzen 5 7520U processor with integrated Radeon graphics",
      "15.6\" FHD anti-glare display, narrow bezels",
      "Rapid Charge — 2 hours of use from a 15-minute charge",
      "Privacy shutter on the 1080p webcam",
      "Office Home 2021 and 1-year Lenovo warranty"
    ],
    specs: { "Processor": "AMD Ryzen 5 7520U", "RAM": "16 GB LPDDR5", "Storage": "512 GB SSD", "Display": "15.6\" FHD TN", "Weight": "1.62 kg" }
  },

  /* ---------------- ELECTRONICS : WEARABLES / TV ---------------- */
  {
    id: "LM1301", cat: "electronics", sub: "Wearables", brand: "Apple",
    title: "Apple Watch SE (2nd Gen) [GPS 40 mm] Smartwatch with Midnight Aluminium Case",
    price: 24900, mrp: 29900, rating: 4.5, reviews: 3980, stock: 15,
    img: UNSPLASH("photo-1546868871-7041f2a55e12"),
    colors: [["Midnight", "#2e3641"], ["Starlight", "#e6dfd3"], ["Silver", "#e3e4e5"]],
    options: { label: "Case size", values: ["40 mm", "44 mm"], add: [0, 3000] },
    highlights: [
      "Track workouts, heart rate and sleep with advanced sensors",
      "Crash Detection and Fall Detection to get help when you need it",
      "Water resistant to 50 metres — swim-proof",
      "Seamlessly works with your iPhone and other Apple devices",
      "Up to 18 hours battery life"
    ],
    specs: { "Display": "Retina LTPO OLED", "Chip": "S8 SiP", "Water resistance": "WR50", "Sensors": "Optical heart, accelerometer, gyroscope", "Battery": "Up to 18 hours" }
  },
  {
    id: "LM1302", cat: "electronics", sub: "Wearables", brand: "Noise",
    title: "Noise ColorFit Pro 5 Smart Watch with 1.85\" AMOLED Display, Bluetooth Calling",
    price: 3499, mrp: 7999, rating: 4.1, reviews: 18730, stock: 80, badge: "Deal",
    img: UNSPLASH("photo-1575311373937-040b8e1fd5b6"),
    colors: [["Jet Black", "#1e1e1e"], ["Rose Pink", "#d9a8a6"], ["Silver Grey", "#a7a8aa"]],
    highlights: [
      "1.85\" AMOLED display with always-on mode",
      "BT calling with Tru Sync, single-chip connectivity",
      "Noise Health Suite — SpO2, heart rate, stress, sleep",
      "100+ sports modes, IP68 water resistance",
      "Up to 7 days battery life"
    ],
    specs: { "Display": "1.85\" AMOLED", "Battery": "Up to 7 days", "Water resistance": "IP68", "Connectivity": "Bluetooth 5.3" }
  },
  {
    id: "LM1401", cat: "electronics", sub: "Televisions", brand: "Samsung",
    title: "Samsung 108 cm (43 inches) Crystal iSmart 4K Ultra HD Smart LED TV UA43CUE60AKLXL",
    price: 28490, mrp: 52900, rating: 4.3, reviews: 12460, stock: 12, badge: "46% off",
    img: UNSPLASH("photo-1593359677879-a4bb92f829d1"),
    options: { label: "Screen size", values: ["43 inch", "50 inch", "55 inch"], add: [0, 6500, 11500] },
    highlights: [
      "Crystal Processor 4K with PurColor and HDR10+ support",
      "Tizen OS with Netflix, Prime Video, Disney+ Hotstar, YouTube",
      "Q-Symphony, Adaptive Sound and 20W output",
      "SmartThings hub, screen mirroring and voice assistant",
      "1 year comprehensive warranty from Samsung"
    ],
    specs: { "Resolution": "3840 × 2160", "Refresh rate": "50 Hz", "Sound": "20 W, 2 CH", "Ports": "3× HDMI, 1× USB", "OS": "Tizen" }
  },

  /* ---------------- FASHION ---------------- */
  {
    id: "LM2001", cat: "fashion", sub: "Men", brand: "Levi's",
    title: "Levi's Men's 511 Slim Fit Mid-Rise Stretch Jeans",
    price: 1679, mrp: 3999, rating: 4.1, reviews: 9520, stock: 60,
    img: UNSPLASH("photo-1542272604-787c3835535d"),
    colors: [["Dark Indigo", "#2b3a55"], ["Mid Blue", "#5a7aa3"], ["Black", "#1f1f22"]],
    options: { label: "Waist", values: ["28", "30", "32", "34", "36"], add: [0, 0, 0, 0, 0] },
    highlights: [
      "Slim fit through hip and thigh with a narrow leg opening",
      "Cotton-elastane blend for all-day stretch comfort",
      "Classic 5-pocket styling with zip fly",
      "Machine wash cold, inside out",
      "Country of origin: India"
    ],
    specs: { "Fit": "Slim", "Rise": "Mid rise", "Material": "98% Cotton, 2% Elastane", "Closure": "Zipper", "Care": "Machine wash" }
  },
  {
    id: "LM2002", cat: "fashion", sub: "Men", brand: "Allen Solly",
    title: "Allen Solly Men's Regular Fit Solid Cotton Polo T-Shirt",
    price: 799, mrp: 1599, rating: 4.0, reviews: 14200, stock: 120,
    img: UNSPLASH("photo-1586363104862-3a5e2ab60d99"),
    colors: [["Navy", "#25304a"], ["White", "#f5f5f2"], ["Maroon", "#6b2232"], ["Olive", "#5d6142"]],
    options: { label: "Size", values: ["S", "M", "L", "XL", "XXL"], add: [0, 0, 0, 0, 0] },
    highlights: [
      "Breathable pique cotton for everyday comfort",
      "Ribbed collar and cuffs with 2-button placket",
      "Signature embroidered logo on chest",
      "Regular fit — true to size",
      "Machine wash"
    ],
    specs: { "Fit": "Regular", "Fabric": "100% Cotton pique", "Sleeve": "Short sleeve", "Neck": "Polo collar" }
  },
  {
    id: "LM2003", cat: "fashion", sub: "Men", brand: "U.S. Polo Assn.",
    title: "U.S. POLO ASSN. Men's Solid Slim Fit Casual Oxford Shirt",
    price: 1149, mrp: 2299, rating: 4.1, reviews: 6380, stock: 70,
    img: UNSPLASH("photo-1596755094514-f87e34085b2c"),
    colors: [["Sky Blue", "#a9c4de"], ["White", "#f6f6f4"], ["Light Pink", "#ecc9cc"]],
    options: { label: "Size", values: ["S", "M", "L", "XL"], add: [0, 0, 0, 0] },
    highlights: ["Oxford weave cotton with a soft hand feel", "Button-down collar and curved hem", "Slim fit for a tailored look", "Signature USPA logo embroidery"],
    specs: { "Fit": "Slim", "Fabric": "100% Cotton", "Sleeve": "Full sleeve", "Collar": "Button-down" }
  },
  {
    id: "LM2101", cat: "fashion", sub: "Women", brand: "Libas",
    title: "Libas Women's Cotton Printed Straight Kurta with Palazzo & Dupatta Set",
    price: 1299, mrp: 3999, rating: 4.2, reviews: 7260, stock: 45, badge: "68% off",
    img: UNSPLASH("photo-1610030469983-98e550d6193c"),
    colors: [["Mustard", "#d3a03a"], ["Teal", "#2f7d7a"], ["Rust", "#b2512f"]],
    options: { label: "Size", values: ["XS", "S", "M", "L", "XL", "XXL"], add: [0, 0, 0, 0, 0, 0] },
    highlights: ["Pure cotton fabric, ideal for daily and festive wear", "Straight-cut kurta with three-quarter sleeves", "Includes matching palazzo and printed dupatta", "Hand wash recommended"],
    specs: { "Set": "Kurta, Palazzo, Dupatta", "Fabric": "100% Cotton", "Length": "Calf length", "Care": "Hand wash" }
  },
  {
    id: "LM2102", cat: "fashion", sub: "Women", brand: "Lavie",
    title: "Lavie Women's Ushawu Large Tote Handbag",
    price: 1399, mrp: 4950, rating: 4.0, reviews: 5110, stock: 33,
    img: UNSPLASH("photo-1584917865442-de89df76afd3"),
    colors: [["Tan", "#b07a4f"], ["Black", "#1e1e1e"], ["Beige", "#d8c3a5"]],
    highlights: ["Spacious main compartment fits a 13\" laptop", "Durable vegan leather with structured silhouette", "Zip closure with interior pockets", "Detachable sling strap"],
    specs: { "Material": "Synthetic PU", "Dimensions": "40 × 30 × 13 cm", "Closure": "Zip", "Compartments": "3" }
  },
  {
    id: "LM2201", cat: "fashion", sub: "Footwear", brand: "Nike",
    title: "Nike Men's Revolution 7 Road Running Shoes",
    price: 3326, mrp: 3695, rating: 4.3, reviews: 4430, stock: 28,
    img: UNSPLASH("photo-1606107557195-0e29a4b5b4aa"),
    colors: [["University Red", "#c0262d"], ["Black/White", "#202020"], ["Grey", "#9a9a9a"]],
    options: { label: "UK Size", values: ["6", "7", "8", "9", "10", "11"], add: [0, 0, 0, 0, 0, 0] },
    highlights: ["Soft foam cushioning for a smooth stride", "Breathable mesh upper with a supportive fit", "Rubber outsole for durable traction", "Padded heel collar for comfort"],
    specs: { "Use": "Road running", "Upper": "Engineered mesh", "Sole": "Rubber", "Closure": "Lace-up" }
  },
  {
    id: "LM2202", cat: "fashion", sub: "Footwear", brand: "Campus",
    title: "Campus Men's North Plus Running Shoes",
    price: 1099, mrp: 1999, rating: 3.9, reviews: 32880, stock: 150,
    img: UNSPLASH("photo-1491553895911-0055eca6402d"),
    colors: [["White/Grey", "#e5e5e3"], ["Navy", "#26324c"]],
    options: { label: "UK Size", values: ["6", "7", "8", "9", "10"], add: [0, 0, 0, 0, 0] },
    highlights: ["Lightweight EVA sole with anti-skid grip", "Mesh upper for airflow", "Cushioned insole for long walks", "Easy to clean"],
    specs: { "Upper": "Mesh", "Sole": "EVA", "Closure": "Lace-up", "Weight": "≈ 300 g per shoe" }
  },
  {
    id: "LM2301", cat: "fashion", sub: "Accessories", brand: "Fastrack",
    title: "Fastrack Unisex UV Protected Square Sunglasses",
    price: 999, mrp: 1599, rating: 4.0, reviews: 3020, stock: 64,
    img: UNSPLASH("photo-1572635196237-14b3f281503f"),
    highlights: ["100% UV400 protection lenses", "Lightweight polycarbonate frame", "Comes with branded case and cleaning cloth", "6 month manufacturer warranty"],
    specs: { "Lens": "Polycarbonate, UV400", "Frame": "Full rim", "Shape": "Square", "Gender": "Unisex" }
  },
  {
    id: "LM2302", cat: "fashion", sub: "Accessories", brand: "Titan",
    title: "Titan Neo Analog Blue Dial Men's Watch — Stainless Steel Strap",
    price: 4495, mrp: 5995, rating: 4.4, reviews: 2140, stock: 19,
    img: UNSPLASH("photo-1524592094714-0f0654e20314"),
    highlights: ["Sunburst blue dial with day-date display", "Stainless steel case and bracelet", "Water resistant up to 50 m", "2 year Titan warranty"],
    specs: { "Movement": "Quartz", "Case": "42 mm stainless steel", "Strap": "Stainless steel", "Water resistance": "5 ATM" }
  },

  /* ---------------- HOME & KITCHEN ---------------- */
  {
    id: "LM3001", cat: "home", sub: "Appliances", brand: "Prestige",
    title: "Prestige Iris 750 Watt Mixer Grinder with 3 Stainless Steel Jars + 1 Juicer Jar",
    price: 2999, mrp: 5795, rating: 4.0, reviews: 46700, stock: 85, badge: "Bestseller",
    img: UNSPLASH("photo-1585515320310-259814833e62"),
    highlights: ["Powerful 750W motor for wet and dry grinding", "4 jars including a juicer jar with fruit filter", "3 speed control with pulse function", "Overload protection, 2 year warranty"],
    specs: { "Power": "750 W", "Jars": "1.5 L, 1 L, 0.4 L + 1.5 L juicer", "Speed": "3 + pulse", "Warranty": "2 years" }
  },
  {
    id: "LM3002", cat: "home", sub: "Appliances", brand: "Philips",
    title: "Philips Air Fryer HD9200/90, uses up to 90% less fat, 1400W, 4.1 Litre",
    price: 6999, mrp: 9995, rating: 4.4, reviews: 28400, stock: 30,
    img: UNSPLASH("photo-1695089028114-ce28248f0ab9"),
    highlights: ["Rapid Air technology — fry, bake, grill and roast with little or no oil", "4.1 L capacity, ideal for 2–3 people", "Temperature control up to 200°C, 30 min timer", "Dishwasher-safe basket", "2 year warranty"],
    specs: { "Power": "1400 W", "Capacity": "4.1 L", "Temperature": "80–200°C", "Timer": "30 minutes" }
  },
  {
    id: "LM3003", cat: "home", sub: "Kitchenware", brand: "Milton",
    title: "Milton Thermosteel Flip Lid Flask, 1000 ml, Silver — Hot & Cold 24 Hours",
    price: 899, mrp: 1350, rating: 4.3, reviews: 61200, stock: 200,
    img: UNSPLASH("photo-1602143407151-7111542de6e8"),
    highlights: ["Double-walled vacuum insulation keeps drinks hot or cold for 24 hours", "Food-grade 304 stainless steel", "Leak-proof flip lid", "Rust-proof and easy to clean"],
    specs: { "Capacity": "1000 ml", "Material": "Stainless steel 304", "Insulation": "24 hours", "Lid": "Flip" }
  },
  {
    id: "LM3004", cat: "home", sub: "Appliances", brand: "Pigeon",
    title: "Pigeon by Stovekraft Amaze Plus 1.5 Litre Electric Kettle, 1500W",
    price: 599, mrp: 1445, rating: 4.1, reviews: 98300, stock: 300, badge: "Deal",
    img: UNSPLASH("photo-1594213114663-d94db9b17125"),
    highlights: ["Boils 1.5 L of water in 5–6 minutes", "Auto shut-off and boil-dry protection", "Stainless steel body, cool-touch handle", "360° swivel base"],
    specs: { "Capacity": "1.5 L", "Power": "1500 W", "Material": "Stainless steel", "Warranty": "1 year" }
  },
  {
    id: "LM3101", cat: "home", sub: "Furniture", brand: "Wakefit",
    title: "Wakefit Ergonomic Office Chair with Adjustable Lumbar Support and Headrest",
    price: 8999, mrp: 17999, rating: 4.2, reviews: 3540, stock: 16,
    img: UNSPLASH("photo-1580480055273-228ff5388ef8"),
    highlights: ["Breathable mesh back with adjustable lumbar support", "3D armrests and adjustable headrest", "Class-4 gas lift, 135° tilt with lock", "Supports up to 120 kg", "1 year warranty"],
    specs: { "Material": "Mesh + nylon base", "Max load": "120 kg", "Recline": "Up to 135°", "Assembly": "DIY, 15 min" }
  },

  /* ---------------- BEAUTY ---------------- */
  {
    id: "LM4001", cat: "beauty", sub: "Skincare", brand: "Minimalist",
    title: "Minimalist 10% Niacinamide Face Serum for Acne Marks & Oil Balance, 30 ml",
    price: 569, mrp: 599, rating: 4.2, reviews: 71500, stock: 140,
    img: UNSPLASH("photo-1620916566398-39f1143ab7be"),
    highlights: ["10% niacinamide + 1% zinc to reduce acne marks and blemishes", "Controls excess oil and minimises pores", "Lightweight, non-sticky water-based formula", "Fragrance-free, suitable for all skin types"],
    specs: { "Volume": "30 ml", "Key ingredients": "Niacinamide 10%, Zinc 1%", "Skin type": "All", "pH": "5.5 – 6.5" }
  },
  {
    id: "LM4002", cat: "beauty", sub: "Makeup", brand: "Maybelline",
    title: "Maybelline New York Fit Me Matte + Poreless Liquid Foundation, 128 Warm Nude, 30 ml",
    price: 449, mrp: 599, rating: 4.1, reviews: 54200, stock: 95,
    img: UNSPLASH("photo-1522335789203-aabd1fc54bc9"),
    options: { label: "Shade", values: ["115 Ivory", "128 Warm Nude", "220 Natural Beige", "230 Natural Buff"], add: [0, 0, 0, 0] },
    highlights: ["Matte finish with poreless look for normal to oily skin", "Blurs pores and controls shine", "Lightweight and breathable, up to 12 hours wear", "Dermatologist tested"],
    specs: { "Volume": "30 ml", "Finish": "Matte", "Coverage": "Medium, buildable", "Skin type": "Normal to oily" }
  },
  {
    id: "LM4003", cat: "beauty", sub: "Grooming", brand: "Philips",
    title: "Philips Battery Powered Beard Trimmer BT3241/15 — 90 min Runtime, 20 Length Settings",
    price: 1399, mrp: 1995, rating: 4.2, reviews: 82300, stock: 110,
    img: UNSPLASH("photo-1621607512214-68297480165e"),
    highlights: ["Lift & Trim technology for 30% faster trimming", "20 length settings, 0.5 mm precision", "90 min cordless use after 1 hour charge", "Skin-friendly stainless steel blades"],
    specs: { "Runtime": "90 minutes", "Settings": "20 (0.5–10 mm)", "Charging": "USB", "Warranty": "2 years" }
  },
  {
    id: "LM4004", cat: "beauty", sub: "Fragrance", brand: "Bella Vita",
    title: "Bella Vita Luxury Perfume Gift Set for Men — 4 × 20 ml Eau De Parfum",
    price: 549, mrp: 999, rating: 4.0, reviews: 44100, stock: 160,
    img: UNSPLASH("photo-1588405748880-12d1d2a59f75"),
    highlights: ["Set of 4 long-lasting EDP fragrances", "Notes of citrus, oud, leather and aqua", "Travel-friendly 20 ml bottles", "Ideal gifting box"],
    specs: { "Volume": "4 × 20 ml", "Type": "Eau de Parfum", "Longevity": "6–8 hours", "Gender": "Men" }
  },

  /* ---------------- BOOKS ---------------- */
  {
    id: "LM5001", cat: "books", sub: "Self-help", brand: "Penguin Random House",
    title: "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones — James Clear",
    price: 399, mrp: 799, rating: 4.6, reviews: 108900, stock: 500, badge: "#1 Bestseller",
    cover: { bg: "#F3EBDD", fg: "#1c1c1c", accent: "#d64a2b", author: "James Clear", short: "Atomic Habits" },
    highlights: ["Over 15 million copies sold worldwide", "A practical framework for improving every day", "Learn the four laws of behaviour change", "Paperback, 320 pages"],
    specs: { "Author": "James Clear", "Publisher": "Random House Business", "Format": "Paperback", "Pages": "320", "Language": "English" }
  },
  {
    id: "LM5002", cat: "books", sub: "Finance", brand: "Jaico Publishing",
    title: "The Psychology of Money — Morgan Housel",
    price: 289, mrp: 399, rating: 4.6, reviews: 72400, stock: 380,
    cover: { bg: "#1f3a33", fg: "#f4efe3", accent: "#e2b04a", author: "Morgan Housel", short: "The Psychology of Money" },
    highlights: ["19 short stories exploring the strange ways people think about money", "Timeless lessons on wealth, greed and happiness", "Paperback, 252 pages"],
    specs: { "Author": "Morgan Housel", "Publisher": "Jaico Publishing House", "Format": "Paperback", "Pages": "252", "Language": "English" }
  },
  {
    id: "LM5003", cat: "books", sub: "Self-help", brand: "Penguin",
    title: "Ikigai: The Japanese Secret to a Long and Happy Life — Héctor García",
    price: 339, mrp: 599, rating: 4.5, reviews: 65800, stock: 410,
    cover: { bg: "#c9473c", fg: "#fbf6ef", accent: "#fbf6ef", author: "Héctor García & Francesc Miralles", short: "Ikigai" },
    highlights: ["The international bestseller about finding purpose", "Lessons from the people of Okinawa", "Hardcover, 208 pages"],
    specs: { "Author": "Héctor García, Francesc Miralles", "Publisher": "Hutchinson", "Format": "Hardcover", "Pages": "208" }
  },
  {
    id: "LM5004", cat: "books", sub: "Fiction", brand: "HarperCollins",
    title: "The Alchemist — Paulo Coelho (25th Anniversary Edition)",
    price: 269, mrp: 399, rating: 4.5, reviews: 58300, stock: 290,
    cover: { bg: "#e8c37a", fg: "#3b2414", accent: "#7a3d16", author: "Paulo Coelho", short: "The Alchemist" },
    highlights: ["A fable about following your dream", "Translated into 80+ languages", "Paperback, 172 pages"],
    specs: { "Author": "Paulo Coelho", "Publisher": "HarperCollins", "Format": "Paperback", "Pages": "172" }
  },

  /* ---------------- SPORTS ---------------- */
  {
    id: "LM6001", cat: "sports", sub: "Yoga", brand: "Boldfit",
    title: "Boldfit Yoga Mat for Men & Women, 6mm Anti-Slip with Carry Strap",
    price: 449, mrp: 1499, rating: 4.1, reviews: 39800, stock: 210, badge: "70% off",
    img: UNSPLASH("photo-1601925260368-ae2f83cf8b7f"),
    colors: [["Purple", "#6d4c8f"], ["Blue", "#3b6ea5"], ["Green", "#4e8a5a"], ["Black", "#222"]],
    highlights: ["6 mm thick EVA foam for joint cushioning", "Textured anti-slip surface on both sides", "Lightweight with free carry strap", "183 × 61 cm"],
    specs: { "Thickness": "6 mm", "Size": "183 × 61 cm", "Material": "EVA", "Weight": "≈ 700 g" }
  },
  {
    id: "LM6002", cat: "sports", sub: "Outdoor", brand: "Cosco",
    title: "Cosco Rio Football, Size 5 — Machine Stitched, Rubber Bladder",
    price: 589, mrp: 850, rating: 4.0, reviews: 8800, stock: 75,
    img: UNSPLASH("photo-1614632537190-23e4146777db"),
    highlights: ["Size 5 standard match ball", "32-panel machine-stitched construction", "Butyl bladder for air retention", "Suitable for grass and hard grounds"],
    specs: { "Size": "5", "Panels": "32", "Bladder": "Butyl", "Use": "Training, match" }
  },
  {
    id: "LM6003", cat: "sports", sub: "Fitness", brand: "Kore",
    title: "Kore PVC 20 kg Home Gym Set with Dumbbell Rods and Accessories",
    price: 1399, mrp: 4999, rating: 3.9, reviews: 21300, stock: 44,
    img: UNSPLASH("photo-1583454110551-21f2fa2afe61"),
    highlights: ["4 × 2.5 kg + 4 × 2 kg PVC plates", "Two 14\" dumbbell rods with locks", "Includes skipping rope, gloves and hand grippers", "Perfect starter kit for home workouts"],
    specs: { "Total weight": "20 kg", "Plates": "PVC, sand-filled", "Rods": "2 × 14\" dumbbell", "Extras": "Gloves, rope, gripper" }
  },

  /* ---------------- GAMING / TOYS ---------------- */
  {
    id: "LM7001", cat: "gaming", sub: "Gaming", brand: "Sony",
    title: "Sony PS5 DualSense Wireless Controller — Cosmic Red",
    price: 5390, mrp: 6390, rating: 4.6, reviews: 25600, stock: 21,
    img: UNSPLASH("photo-1606318801954-d46d46d3360a"),
    colors: [["White", "#f1f1ef"], ["Cosmic Red", "#a42032"], ["Midnight Black", "#232428"]],
    highlights: ["Haptic feedback and adaptive triggers", "Built-in microphone and headset jack", "Create button to capture and share gameplay", "USB-C rechargeable battery"],
    specs: { "Connectivity": "Bluetooth, USB-C", "Compatibility": "PS5, PC", "Battery": "Built-in rechargeable", "Weight": "280 g" }
  },
  {
    id: "LM7002", cat: "gaming", sub: "Toys", brand: "LEGO",
    title: "LEGO Classic Medium Creative Brick Box 10696 Building Toy Set (484 Pieces)",
    price: 2399, mrp: 2999, rating: 4.7, reviews: 12900, stock: 37,
    img: UNSPLASH("photo-1587654780291-39c9404d746b"),
    highlights: ["484 LEGO bricks in 35 different colours", "Includes windows, eyes and wheels for builds", "Ideas booklet to spark creativity", "For ages 4 and up"],
    specs: { "Pieces": "484", "Age": "4+", "Set no.": "10696", "Material": "ABS plastic" }
  }
];

/* Bank / platform offers shown on the product page */
const OFFERS = [
  { tag: "Bank Offer", text: "10% instant discount on HDFC Bank credit cards, up to ₹1,500 on orders above ₹5,000" },
  { tag: "Partner", text: "5% cashback on Loot Pay UPI, up to ₹100" },
  { tag: "No-cost EMI", text: "Available on orders above ₹3,000 on select cards" },
  { tag: "Coupon", text: "Use LOOT10 for an extra 10% off (max ₹500)" }
];

/* Coupons accepted at cart */
const COUPONS = {
  LOOT10: { type: "pct", value: 10, cap: 500, min: 999, label: "10% off up to ₹500" },
  FIRST200: { type: "flat", value: 200, min: 1499, label: "Flat ₹200 off on your first order" },
  BIGLOOT: { type: "pct", value: 15, cap: 3000, min: 20000, label: "15% off up to ₹3,000 on ₹20,000+" }
};
