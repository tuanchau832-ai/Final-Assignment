// @ts-nocheck  (ported from the design prototype; typed loosely on purpose)
/* Figures and lists behind the charts and cards: criteria, options, costs, life cycle, team. */
export const CRIT = [
  { k: 'Timely', w: 25, c: '#c8f169', d: 'Detects a limit breach and alerts within minutes, day or night.', why: 'Discharges happen at night; lab tests take five days.' },
  { k: 'Traceable', w: 20, c: '#4a9fd8', d: 'Links every reading to one outfall, a time and a calibration record; a lab sample confirms before any fine.', why: 'Authorities need evidence that holds up.' },
  { k: 'Reliable', w: 20, c: '#2f8f83', d: 'Keeps false alarms rare and flags faulty or missing readings.', why: 'Residents ignore alerts that are often wrong.' },
  { k: 'Clear for residents', w: 15, c: '#f2a541', d: 'Vietnamese language, colour paired with text and symbols, readable by older users.', why: 'The people most affected are often the least digital.' },
  { k: 'Durable', w: 10, c: '#8ea6b8', d: 'Survives dirty water, plastics and floods, runs on solar power and stores data offline.', why: 'Outfalls flood in the rainy season.' },
  { k: 'Affordable', w: 10, c: '#ff9b8a', d: 'Low enough cost per site to cover many outfalls, including upkeep.', why: 'The city budget is already stretched.' }
];
export const OPTS = [
  { k: 'A · Sensor stations', s: [5, 5, 4, 4, 3, 3], r: ['Reads every 2 s; alerts in minutes', 'One station per outfall', 'Three-reading rule; probes can drift', 'Colour map plus SMS', 'Fouling and floods need care', 'About ₫13.9 million in listed parts per site; installation and upkeep still to be quoted'] },
  { k: 'B · Test kits and app', s: [2, 2, 2, 4, 5, 4], r: ['Only when a volunteer tests', 'Tests river water, not outfalls', 'Kit accuracy and training vary', 'Residents take part directly', 'Kits are simple', 'Kits are cheap'] },
  { k: 'C · Manual sampling', s: [1, 3, 5, 2, 4, 2], r: ['Days between visits, plus lab time', 'Samples one outfall, if it is the right one', 'Laboratory accuracy', 'Results rarely reach residents', 'No equipment left on site', 'Staff time grows with every site'] }
];
/* Q190 chosen for proposed costing on 28 November 2026; USD units use the explicit
   historical 25,940 VND/USD assumption, rounded per unit. Not a purchase or installed budget. The pH kit is also the optional shared spare. */
export const PH_KIT = { n: 'Industrial pH probe kit', s: 'SEN0169-V2 · US$64.90 · DFRobot (n.d.-a)', p: 1683506 };
export const BUILD = [
  { n: 'Turbidity sensor', s: 'SEN0710 · US$229 · DFRobot (n.d.-c)', p: 5940260 },
  { n: 'Dissolved-oxygen sensor', s: 'SEN0680 · Hshop (n.d.-c)', p: 4428000 },
  PH_KIT,
  { n: 'Integrated ESP32/4G board', s: 'LILYGO Q190 R2 4MB · US$69.34 · LILYGO (n.d.)', p: 1798680 },
  { n: 'Temperature sensor', s: 'DS18B20, waterproof · Hshop (n.d.-b)', p: 35000 },
  { n: 'RS485 converter', s: 'TTL to RS485 · Hshop (n.d.-a)', p: 35000 },
  { n: 'Four cable glands', s: 'PG13.5, fit to be checked · Đại Hòa Phú (n.d.)', p: 4 * 3175 }
];
export const LIFE = [
  { k: 'Materials', imp: 'Electronics need copper, plastics and lithium for the battery.', who: 'Component suppliers', act: 'Choose RoHS-compliant parts, a stainless cage and a recyclable enclosure.' },
  { k: 'Assembly', imp: 'Assembly uses energy and creates offcuts and packaging.', who: 'Our team, local workshops', act: 'Assemble in Hanoi to cut shipping and support local jobs.' },
  { k: 'Transport', imp: 'Short trips by van; each station weighs only a few kilograms.', who: 'Our team', act: 'Group installations by district to cut trips.' },
  { k: 'Installation', imp: 'Work on embankment walls beside traffic and water.', who: 'Drainage company, ward committees, residents', act: 'Agree access, follow safety rules and tell residents before work starts.' },
  { k: 'Use', imp: 'Solar powered, but needs service trips and calibration chemicals.', who: 'Inspectors, residents, factories', act: 'Collect used calibration fluid and plan visits by route.' },
  { k: 'End of life', imp: 'Retired boards and lithium batteries become e-waste.', who: 'Certified recycler, the Department', act: 'Review wear in month 36, replace parts only as needed, recycle boards and batteries and reuse cages.' }
];
export const TEAM = [
  { n: 'Nguyễn Gia Ngân', f: 'Industrial wastewater', b: 'Researched how industrial wastewater affects water quality in Hanoi, from COD and BOD₅ in the Tô Lịch to metals in river sediments.' },
  { n: 'Huỳnh Lâm Nguyên', f: 'Monitoring reliability', b: 'Focused on why discharges are recognised late, and on keeping readings reliable, traceable and clearly explained to the public.' },
  { n: 'Nguyễn Ngọc Anh Thư', f: 'Policy and budgets', b: 'Studied the causes behind the problem, from scarce monitoring and split responsibilities to the strain on Hanoi’s budget.' },
  { n: 'Nguyễn Tấn Đạt', f: 'Economic impact', b: 'Examined the economic cost of late detection for households, farmers, fisheries and the agencies that clean up.' },
  { n: 'Lê Nguyễn Bá Nguyên', f: 'Drains and outfalls', b: 'Investigated how incomplete drains in peri-urban areas and urban villages send greywater and plastics through unmonitored outfalls.' },
  { n: 'Châu Hoàng Tuấn', f: 'Research focus', b: 'Research focus and a short bio to be added.' }
];
