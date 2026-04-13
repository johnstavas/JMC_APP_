import { useState, useMemo, useEffect, useRef } from "react";

const SKUS = [
  { id:"ribeye",    label:"Ribeye",       cat:"Premium",  mix:0.10, price:49.99, farm:7.31, p3:2.0401, pO:0.7472, ws:20.00, comp:49.0  },
  { id:"nystrip",   label:"NY Strip",     cat:"Premium",  mix:0.09, price:44.99, farm:7.31, p3:2.0401, pO:0.7472, ws:22.00, comp:44.0  },
  { id:"filet",     label:"Filet",        cat:"Premium",  mix:0.04, price:62.99, farm:8.31, p3:2.0401, pO:0.7472, ws:28.00, comp:59.0  },
  { id:"flatIron",  label:"Flat Iron",    cat:"Core",     mix:0.06, price:27.99, farm:6.31, p3:2.0401, pO:0.7472, ws:14.00, comp:30.0  },
  { id:"hanger",    label:"Hanger",       cat:"Core",     mix:0.04, price:34.99, farm:7.31, p3:2.0401, pO:0.7472, ws:11.00, comp:36.0  },
  { id:"skirt",     label:"Skirt",        cat:"Traffic",  mix:0.08, price:26.99, farm:6.81, p3:2.0401, pO:0.7472, ws:11.50, comp:22.99 },
  { id:"ground",    label:"Ground Chuck", cat:"Everyday", mix:0.25, price:12.99, farm:5.31, p3:2.3401, pO:0.7972, ws:8.50,  comp:14.99 },
  { id:"stew",      label:"Stew Meat",    cat:"Everyday", mix:0.10, price:12.99, farm:6.31, p3:2.0401, pO:0.7472, ws:8.00,  comp:14.99 },
  { id:"brisket",   label:"Brisket",      cat:"Everyday", mix:0.12, price:17.99, farm:6.31, p3:2.0401, pO:0.7472, ws:9.50,  comp:18.99 },
  { id:"shortRibs", label:"Short Ribs",   cat:"Core",     mix:0.07, price:25.99, farm:7.31, p3:2.0401, pO:0.7472, ws:9.25,  comp:26.99 },
  { id:"roasts",    label:"Roasts",       cat:"Everyday", mix:0.02, price:16.00, farm:6.31, p3:2.0401, pO:0.7472, ws:7.50,  comp:18.0  },
  { id:"tbone",     label:"T-Bone",       cat:"Core",     mix:0.03, price:39.99, farm:8.31, p3:2.0401, pO:0.7472, ws:22.00, comp:40.0  },
];

const USDA_WS = {
  ribeye:{lo:17.44,hi:25.03},nystrip:{lo:20.05,hi:28.00},filet:{lo:24.99,hi:44.00},
  flatIron:{lo:10.99,hi:20.11},hanger:{lo:7.92,hi:13.70},skirt:{lo:10.89,hi:12.89},
  ground:{lo:6.81,hi:9.95},stew:{lo:6.89,hi:10.49},brisket:{lo:6.09,hi:12.25},
  shortRibs:{lo:8.08,hi:10.49},roasts:{lo:5.39,hi:8.88},tbone:{lo:18.46,hi:29.50},
};

const REST_BUYERS = [
  {name:"High-End Steakhouse",ex:"Gwen · Fia · Alexander's",items:[
    {cut:"ribeye",menu:72,oz:14,loss:0.25,fc:0.32},{cut:"filet",menu:58,oz:8,loss:0.22,fc:0.30},{cut:"nystrip",menu:62,oz:12,loss:0.23,fc:0.31}]},
  {name:"Farm-to-Table",ex:"Republique · A.O.C. · Manuela",items:[
    {cut:"hanger",menu:42,oz:10,loss:0.20,fc:0.33},{cut:"flatIron",menu:36,oz:8,loss:0.18,fc:0.32},{cut:"ground",menu:20,oz:8,loss:0.12,fc:0.30}]},
  {name:"Upscale Casual",ex:"Jar · Kali · Carlitos",items:[
    {cut:"ribeye",menu:58,oz:12,loss:0.24,fc:0.33},{cut:"skirt",menu:28,oz:10,loss:0.20,fc:0.33},{cut:"brisket",menu:32,oz:12,loss:0.38,fc:0.33}]},
  {name:"Craft Burger / Bar",ex:"Butchr Bar · Bar Ama",items:[
    {cut:"ground",menu:22,oz:8,loss:0.12,fc:0.30},{cut:"skirt",menu:18,oz:6,loss:0.18,fc:0.28}]},
  {name:"Korean BBQ / Fusion",ex:"Mun · BLVD",items:[
    {cut:"shortRibs",menu:45,oz:12,loss:0.15,fc:0.32},{cut:"brisket",menu:28,oz:8,loss:0.30,fc:0.30}]},
  {name:"Hotel / Catering",ex:"Redbird · Nick & Stef's",items:[
    {cut:"ribeye",menu:65,oz:14,loss:0.25,fc:0.30},{cut:"filet",menu:55,oz:8,loss:0.22,fc:0.29}]},
];

const COMPS = [
  {store:"Cream Co./Cookbook",tier:"Premium Butcher",items:[{n:"Ribeye",p:66.00},{n:"NY Strip",p:57.38},{n:"Hanger",p:42.90},{n:"Ground",p:14.50}]},
  {store:"McCall's/Atwater",  tier:"Premium Butcher",items:[{n:"Ribeye DA",p:59.99},{n:"Ribeye",p:47.00},{n:"NY Strip",p:42.00},{n:"Filet",p:69.99},{n:"Flat Iron",p:28.99},{n:"Short Ribs",p:27.50},{n:"Ground GF",p:14.99}]},
  {store:"Sprouts/Eagle Rock", tier:"Natural Market", items:[{n:"Ribeye GF",p:27.99},{n:"NY Strip GF",p:24.99},{n:"Filet GF",p:34.99},{n:"Stew GF",p:12.99},{n:"Ground GF",p:9.49}]},
  {store:"Vons/Eagle Rock",    tier:"Mass Market",    items:[{n:"Ribeye Prime",p:38.99},{n:"NY Strip Prime",p:29.99},{n:"Ground 90/10",p:6.99}]},
  {store:"Trader Joe's/ER",    tier:"Mass Market",    items:[{n:"Ribeye Choice",p:21.99},{n:"Filet Choice",p:35.99},{n:"Ground 80/20",p:6.49}]},
];

const CAT_C = {Premium:"#f59e0b",Core:"#3b82f6",Traffic:"#22c55e",Everyday:"#64748b"};

// ── JMC CUTS DATA (from jmc_cuts_data.js) ───────────────────────
const JMC_CUTS = [
  {id:"chuck-roast",      primal:"Chuck",          name:"Chuck Roast",           unitWeight:"2–4 lbs",      yLo:24,  yHi:32,  wholeCowQty:8,  unit:"roasts",   butcher:"Butcher paper — wrap tight, tie with twine",              ws:"Cryovac · per piece or 2-pack · IMPS #2720",                  rfRef:7,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"chuck-eye-steak",  primal:"Chuck",          name:"Chuck Eye Steak",       unitWeight:"10–14 oz",     yLo:9,   yHi:12,  wholeCowQty:14, unit:"steaks",   butcher:"Foam tray + film · 2-pack or singles",                    ws:"Cryovac · 2–4 per vac bag",                                   rfRef:5,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"flat-iron-steak",  primal:"Chuck",          name:"Flat Iron Steak",       unitWeight:"8–12 oz",      yLo:4,   yHi:6,   wholeCowQty:8,  unit:"steaks",   butcher:"Foam tray + film · singles, fan display",                 ws:"Cryovac · 2–3 per bag, case of 12",                           rfRef:5,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"stew-meat",        primal:"Chuck",          name:"Stew Meat",             unitWeight:"1–2 lbs",      yLo:12,  yHi:20,  wholeCowQty:12, unit:"packs",    butcher:"Foam tray or butcher paper · pre-cubed 1\u2033",              ws:"Cryovac · 5 lb vac bags",                                     rfRef:5,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"chuck-short-ribs", primal:"Chuck",          name:"Chuck Short Ribs",      unitWeight:"2–4 lbs",      yLo:16,  yHi:24,  wholeCowQty:6,  unit:"racks",    butcher:"Butcher paper or foam tray · 3–4 bone rack",              ws:"Cryovac · full rack per piece",                               rfRef:7,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"ribeye-steak",     primal:"Rib",            name:"Ribeye Steak",          unitWeight:"12–16 oz",     yLo:13,  yHi:18,  wholeCowQty:14, unit:"steaks",   butcher:"Foam tray + film · singles or 2-pack, 1\u2033 thickness",    ws:"Cryovac · 2 per bag, case of 12–14",                          rfRef:5,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"cowboy-ribeye",    primal:"Rib",            name:"Cowboy / Bone-In Ribeye",unitWeight:"18–24 oz",   yLo:7,   yHi:9,   wholeCowQty:6,  unit:"steaks",   butcher:"Butcher paper · singles, show bone",                      ws:"Cryovac · individually, case of 6–8",                         rfRef:7,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"prime-rib-roast",  primal:"Rib",            name:"Prime Rib Roast",       unitWeight:"4–8 lbs",      yLo:8,   yHi:16,  wholeCowQty:2,  unit:"roasts",   butcher:"Butcher paper · tied roast",                              ws:"Cryovac · whole or half, 2 per case",                         rfRef:7,  rfVac:35,  frRef:180, frVac:365, note:null},
  {id:"back-ribs",        primal:"Rib",            name:"Back Ribs",             unitWeight:"3–5 lbs",      yLo:12,  yHi:20,  wholeCowQty:4,  unit:"racks",    butcher:"Butcher paper or foam tray · full or halved",             ws:"Cryovac · full rack per bag",                                 rfRef:7,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"t-bone-steak",     primal:"Loin",           name:"T-Bone Steak",          unitWeight:"14–18 oz",     yLo:9,   yHi:11,  wholeCowQty:10, unit:"steaks",   butcher:"Foam tray + film · singles, 1\u20131.25\u2033 cut",               ws:"Cryovac · 2 per bag, case of 10–12",                          rfRef:5,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"porterhouse-steak",primal:"Loin",           name:"Porterhouse Steak",     unitWeight:"18–24 oz",     yLo:7,   yHi:9,   wholeCowQty:6,  unit:"steaks",   butcher:"Foam tray or butcher paper · singles",                    ws:"Cryovac · individually, case of 8",                           rfRef:5,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"ny-strip-steak",   primal:"Loin",           name:"NY Strip Steak",        unitWeight:"10–14 oz",     yLo:9,   yHi:12,  wholeCowQty:14, unit:"steaks",   butcher:"Foam tray + film · singles or 2-pack, 1\u2033 cut",          ws:"Cryovac · 2 per bag, case of 12–14",                          rfRef:5,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"filet-mignon",     primal:"Loin",           name:"Filet Mignon",          unitWeight:"6–8 oz",       yLo:4,   yHi:5,   wholeCowQty:10, unit:"steaks",   butcher:"Foam tray + film · singles, black tray (premium)",       ws:"Cryovac · 2 per bag, case of 12–16",                          rfRef:5,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"sirloin-steak",    primal:"Loin",           name:"Sirloin Steak",         unitWeight:"8–12 oz",      yLo:6,   yHi:9,   wholeCowQty:12, unit:"steaks",   butcher:"Foam tray + film · singles or 2-pack",                    ws:"Cryovac · 2–3 per bag, case of 12",                           rfRef:5,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"tri-tip-roast",    primal:"Loin",           name:"Tri-Tip Roast",         unitWeight:"2–3 lbs",      yLo:4,   yHi:6,   wholeCowQty:2,  unit:"roasts",   butcher:"Butcher paper · whole muscle",                            ws:"Cryovac · per piece, case of 4–6",                            rfRef:7,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"top-round-roast",  primal:"Round",          name:"Top Round Roast",       unitWeight:"3–5 lbs",      yLo:12,  yHi:20,  wholeCowQty:4,  unit:"roasts",   butcher:"Butcher paper · tied, white paper",                       ws:"Cryovac · per piece, case of 4",                              rfRef:7,  rfVac:35,  frRef:180, frVac:365, note:null},
  {id:"bottom-round-roast",primal:"Round",         name:"Bottom Round Roast",    unitWeight:"3–5 lbs",      yLo:12,  yHi:20,  wholeCowQty:4,  unit:"roasts",   butcher:"Butcher paper · tied, white paper",                       ws:"Cryovac · per piece, case of 4",                              rfRef:7,  rfVac:35,  frRef:180, frVac:365, note:null},
  {id:"eye-of-round-roast",primal:"Round",         name:"Eye of Round Roast",    unitWeight:"2–4 lbs",      yLo:8,   yHi:16,  wholeCowQty:4,  unit:"roasts",   butcher:"Butcher paper · whole muscle",                            ws:"Cryovac · per piece, case of 4–6",                            rfRef:7,  rfVac:35,  frRef:180, frVac:365, note:null},
  {id:"eye-of-round-steak",primal:"Round",         name:"Eye of Round Steak",    unitWeight:"6–10 oz",      yLo:5,   yHi:8,   wholeCowQty:12, unit:"steaks",   butcher:"Foam tray + film · 3–4 per tray, layered",               ws:"Cryovac · 4–6 per bag, case of 10",                           rfRef:5,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"sirloin-tip-roast",primal:"Round",          name:"Sirloin Tip Roast",     unitWeight:"3–5 lbs",      yLo:12,  yHi:20,  wholeCowQty:4,  unit:"roasts",   butcher:"Butcher paper · tied roast",                              ws:"Cryovac · per piece, case of 4",                              rfRef:7,  rfVac:35,  frRef:180, frVac:365, note:null},
  {id:"rump-roast",       primal:"Round",          name:"Rump Roast",            unitWeight:"3–5 lbs",      yLo:6,   yHi:10,  wholeCowQty:2,  unit:"roasts",   butcher:"Butcher paper · tied roast",                              ws:"Cryovac · per piece, case of 4",                              rfRef:7,  rfVac:35,  frRef:180, frVac:365, note:null},
  {id:"flank-steak",      primal:"Flank & Plate",  name:"Flank Steak",           unitWeight:"1–2 lbs",      yLo:2,   yHi:4,   wholeCowQty:2,  unit:"steaks",   butcher:"Foam tray or butcher paper · whole muscle",               ws:"Cryovac · per piece, case of 8–10",                           rfRef:5,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"skirt-steak",      primal:"Flank & Plate",  name:"Skirt Steak",           unitWeight:"1–1.5 lbs",    yLo:4,   yHi:6,   wholeCowQty:4,  unit:"pieces",   butcher:"Foam tray or butcher paper · designate inside/outside",   ws:"Cryovac · per piece, designate inside vs outside",            rfRef:5,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"hanger-steak",     primal:"Flank & Plate",  name:"Hanger Steak",          unitWeight:"0.75–1 lb",    yLo:0.75,yHi:1,   wholeCowQty:1,  unit:"steak",    butcher:"Foam tray + film · singles — only 1 per animal",         ws:"Cryovac · per piece, limit 1 per animal",                     rfRef:5,  rfVac:28,  frRef:180, frVac:365, note:"⚠ UNIQUE: Only 1 per animal. Cannot split on half cow."},
  {id:"plate-short-ribs", primal:"Flank & Plate",  name:"Plate Short Ribs",      unitWeight:"3–5 lbs",      yLo:12,  yHi:20,  wholeCowQty:4,  unit:"racks",    butcher:"Butcher paper · 3-bone rack, white paper",               ws:"Cryovac · full rack, case of 4–6",                            rfRef:7,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"brisket-flat",     primal:"Brisket",        name:"Brisket Flat",          unitWeight:"6–10 lbs",     yLo:12,  yHi:20,  wholeCowQty:2,  unit:"pieces",   butcher:"Butcher paper · whole flat, white paper",                 ws:"Cryovac · per piece, case of 2–3",                            rfRef:7,  rfVac:42,  frRef:180, frVac:365, note:null},
  {id:"brisket-point",    primal:"Brisket",        name:"Brisket Point (Deckle)", unitWeight:"4–7 lbs",     yLo:8,   yHi:14,  wholeCowQty:2,  unit:"pieces",   butcher:"Butcher paper · whole point, white paper",                ws:"Cryovac · per piece, case of 2–3",                            rfRef:7,  rfVac:42,  frRef:180, frVac:365, note:null},
  {id:"whole-packer",     primal:"Brisket",        name:"Whole Packer Brisket",  unitWeight:"12–18 lbs",    yLo:24,  yHi:36,  wholeCowQty:2,  unit:"packers",  butcher:"Butcher paper · heavy white paper + tape",               ws:"Cryovac or heavy shrink bag · per piece",                     rfRef:7,  rfVac:45,  frRef:180, frVac:365, note:null},
  {id:"osso-buco",        primal:"Shank",          name:"Osso Buco (Cross-Cut Shank)",unitWeight:"1–1.5 lbs",yLo:12, yHi:18,  wholeCowQty:12, unit:"pieces",   butcher:"Foam tray · 2 per tray, marrow-up display",              ws:"Cryovac · 2–4 per bag, case of 8",                            rfRef:5,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"marrow-bones",     primal:"Shank",          name:"Soup / Marrow Bones",   unitWeight:"2–4 lbs",      yLo:12,  yHi:20,  wholeCowQty:6,  unit:"packs",    butcher:"Butcher paper or foam tray · bagged loose",              ws:"Cryovac · 5 lb vac bags",                                     rfRef:7,  rfVac:28,  frRef:180, frVac:365, note:null},
  {id:"ground-80-20",     primal:"Ground & Trim",  name:"Ground Beef (80/20)",   unitWeight:"1–2 lbs",      yLo:80,  yHi:120, wholeCowQty:80, unit:"lbs",      butcher:"Foam tray + film or chub · 1 lb and 2 lb portions",       ws:"Cryovac chub logs · 5–10 lb logs, case of 4",                rfRef:3,  rfVac:21,  frRef:120, frVac:365, note:"Lean % must be declared. Safe handling instructions mandatory."},
  {id:"ground-85-15",     primal:"Ground & Trim",  name:"Ground Beef (85/15)",   unitWeight:"1–2 lbs",      yLo:30,  yHi:50,  wholeCowQty:30, unit:"lbs",      butcher:"Foam tray + film or chub · tray or chub",                ws:"Cryovac chub logs · 5–10 lb logs",                            rfRef:3,  rfVac:21,  frRef:120, frVac:365, note:"Lean % must be declared."},
  {id:"ground-90-10",     primal:"Ground & Trim",  name:"Ground Beef (90/10)",   unitWeight:"1 lb",         yLo:20,  yHi:30,  wholeCowQty:20, unit:"lbs",      butcher:"Foam tray + film · tray pack, label lean %",             ws:"Cryovac chub logs · 5–10 lb logs",                            rfRef:3,  rfVac:21,  frRef:120, frVac:365, note:null},
  {id:"beef-trim",        primal:"Ground & Trim",  name:"Beef Trim / Pet Grade", unitWeight:"5–10 lb bulk", yLo:25,  yHi:35,  wholeCowQty:6,  unit:"packs",    butcher:"Butcher paper · bulk, clearly labeled",                  ws:"Cryovac large bags · case label required",                    rfRef:5,  rfVac:21,  frRef:180, frVac:365, note:"Clearly distinguish human-grade from pet-grade. Different labeling applies."},
];

// Map model SKU IDs to cuts data
const SKU_CUT_MAP = {
  ribeye:"ribeye-steak", nystrip:"ny-strip-steak", filet:"filet-mignon",
  flatIron:"flat-iron-steak", hanger:"hanger-steak", skirt:"skirt-steak",
  ground:"ground-80-20", stew:"stew-meat", brisket:"brisket-flat",
  shortRibs:"plate-short-ribs", roasts:"chuck-roast", tbone:"t-bone-steak",
};

const PRIMALS = [...new Set(JMC_CUTS.map(c=>c.primal))];
const PKG_COLORS = {
  "Foam tray":"#3b82f6","Butcher paper":"#f59e0b",
  "Cryovac":"#22c55e","Mixed":"#a855f7"
};

const TABS = ["Executive Summary","① SKU P&L","② Scenarios","③ Competitors","④ Processing Scale","⑤ Wholesale","⑥ Cut Reference","⑦ Startup Costs"];

const STARTUP_SECTIONS = [
  {key:"facility",title:"Facility / Buildout",monthly:false,fields:[
    ["leaseDeposit","Lease Deposit"],["firstMonthRent","First Month Rent"],["buildoutRenovations","Buildout / Renovations"],
    ["flooring","Flooring"],["electrical","Electrical Upgrades"],["hvac","HVAC"],["plumbingDrainage","Plumbing / Drainage"]]},
  {key:"refrigeration",title:"Refrigeration & Cold Storage",monthly:false,fields:[
    ["walkInCooler","Walk-in Cooler"],["walkInFreezer","Walk-in Freezer"],["displayCases","Display Cases"],
    ["reachInFridges","Reach-in Refrigerators"],["iceMachine","Ice Machine"],["dryAgingFridge","Dry-aging Fridge"]]},
  {key:"equipment",title:"Butchering Equipment",monthly:false,fields:[
    ["bandSaw","Band Saw"],["meatGrinder","Meat Grinder"],["sausageStuffer","Sausage Stuffer"],["meatSlicer","Meat Slicer"],
    ["tenderizer","Tenderizer / Cuber"],["cuttingTables","Cutting Tables"],["knives","Knives"],["sharpeningSystem","Sharpening System"]]},
  {key:"packaging",title:"Packaging & Labeling",monthly:false,fields:[
    ["vacuumSealer","Vacuum Sealer"],["wrappingStation","Wrapping Station"],["traysAndFilm","Trays / Film"],
    ["digitalScales","Digital Scales"],["labelPrinter","Label Printer"],["labels","Labels"]]},
  {key:"supplyChain",title:"Supply Chain & Inventory",monthly:false,fields:[
    ["initialInventory","Initial Inventory"],["transport","Transport"],["coldChainLogistics","Cold Chain Logistics"],["storageOverflow","Storage Overflow"]]},
  {key:"licensing",title:"Licensing, Permits & Compliance",monthly:false,fields:[
    ["businessLicense","Business License"],["healthPermit","Health Permit"],["foodSafetyCertification","Food Safety Certification"],
    ["weightsAndMeasures","Weights & Measures"],["wasteDisposal","Waste Disposal Setup"],["insuranceLic","Insurance"]]},
  {key:"retail",title:"Retail & Customer Experience",monthly:false,fields:[
    ["posSystem","POS System"],["counterBuild","Counter / Checkout Build"],["signage","Signage"],["branding","Branding"],["website","Website / Online Ordering"]]},
  {key:"sanitation",title:"Sanitation & Safety",monthly:false,fields:[
    ["sinks","Commercial Sinks"],["cleaningSupplies","Cleaning Supplies"],["ppe","PPE / Aprons / Gloves"],["pestControl","Pest Control"]]},
  {key:"valueAdd",title:"Value-Add Production",monthly:false,fields:[
    ["smoker","Smoker"],["dehydrator","Dehydrator"],["marinades","Marinade Setup"],["spices","Spices / Seasonings"]]},
  {key:"laborMonthly",title:"Labor (Monthly)",monthly:true,fields:[
    ["headButcher","Head Butcher"],["assistantButchers","Assistant Butchers"],["retailStaff","Retail Staff"],["admin","Admin / Bookkeeping"]]},
  {key:"fixedMonthly",title:"Fixed Monthly Operating Costs",monthly:true,fields:[
    ["rentMo","Rent"],["utilities","Utilities"],["insuranceMo","Insurance"],["internetPhone","Internet / Phone"],
    ["software","Software"],["wasteRemoval","Waste Removal"],["maintenance","Maintenance / Repairs"],["marketing","Marketing"],["miscellaneous","Miscellaneous"]]},
];

const buildStartupState=()=>{const s={};STARTUP_SECTIONS.forEach(sec=>{s[sec.key]={};sec.fields.forEach(([k])=>{s[sec.key][k]="";});});return s;};
const parseAmt=(v)=>{const n=Number(v);return Number.isFinite(n)?n:0;};

const TIPS = {
  retailRevMo:   "MONTHLY RETAIL REVENUE\nTotal sales from your JMC butcher shop this month.\n= Blended sell price × lbs sold.\nDoes NOT include wholesale or hub revenue.",
  grossProfitMo: "MONTHLY GROSS PROFIT\nRevenue minus cost of goods (farm + proc + transport + shrink).\nThis is BEFORE subtracting rent, staff, and fixed overhead.",
  jmcNetMo:      "MONTHLY NET PROFIT — Retail Shop\nWhat you keep after ALL retail costs:\n• Minus $22,000/mo LA fixed costs (rent, staff, utilities)\n• Minus 2% card & misc fees\nThis is your retail bottom line.",
  hubNetMo:      "MONTHLY HUB NET CONTRIBUTION\nWhat your Nebraska plant earns from processing external ranchers' cattle.\n= Gross rancher revenue − variable costs − total plant fixed costs.\nNegative = hub is losing money at current utilization.",
  combinedNPMo:  "MONTHLY COMBINED NET PROFIT\nRetail net profit + Hub net contribution.\nYour total business bottom line across both operations.",
  wsGPMo:        "MONTHLY WHOLESALE GROSS PROFIT\nWhat you earn selling beef in bulk to restaurants.\nAdds directly to your monthly total — no separate fixed cost.",
  totalMo:       "MONTHLY TOTAL — ALL CHANNELS\nRetail Net Profit + Wholesale GP + Hub Net (if Phase 2).\nThis is your full monthly take-home across every revenue stream.",
  annualTotal:   "ANNUAL TOTAL (Projected)\nMonthly total × 12.\nAssumes current volume and pricing holds all year.",
  breakEven:     "BREAK-EVEN VOLUME\nMinimum monthly retail lbs to cover ALL fixed costs.\nBelow this = monthly net loss.\n= Fixed costs ÷ gross profit per lb.",
  farm:          "FARM COST ($/lb retail)\nWhat you pay per retail pound for live cattle.\nBase: Nebraska live steer $245.90/cwt (USDA AMS Apr 2026).\nAdjusts per SKU — premium cuts need better cattle.",
  proc:          "PROCESSING COST ($/lb retail)\nPhase 1 (3rd-Party): $2.04/lb — Midwest Meat Co., Minden NE.\nPhase 2 (Owned): $0.75/lb — your MBMC plant, labor only.\nSwitch phases at top to see the $1.29/lb difference.",
  trans:         "TRANSPORT ($/lb)\nBiweekly Nebraska→LA reefer truck cost spread across all lbs.\n= $2,200/trip × 2 trips ÷ monthly lbs.\nShrinks automatically as volume grows.",
  cogs:          "COGS / LB (All-In Cost)\nFarm + Processing + Transport + 8% shrink.\nShrink = weight lost to trim, moisture loss, and display waste.\nThis is what each lb costs you to put on the counter.",
  gpLb:          "GROSS PROFIT / LB\nWhat you earn per lb sold, before fixed costs.\n= Sell price − COGS/lb.",
  gm:            "GROSS MARGIN %\nGross profit as % of sell price.\nTarget for premium butcher: 55–70%.\nBelow 40% = consider raising price or cutting the SKU.",
  vsComp:        "VS COMPETITOR PRICE ($/lb difference)\nCompares to 7-store LA field survey, April 10 2026.\nNegative = you're BELOW comps — room to raise price.\nPositive = you're ABOVE comps — may deter price-sensitive buyers.",
  hubFixed:      "TOTAL MONTHLY PLANT FIXED COST\nYou pay this every month regardless of utilization.\n= Owned locations × $14,000/plant.\nThis is your biggest risk of owning plants.",
  hubBE:         "HUB BREAK-EVEN (Heads/Month)\nExternal heads needed just to cover plant fixed costs.\nEvery head above this goes almost entirely to profit.",
  netPerHead:    "NET REVENUE PER HEAD (Pre-Fixed)\nWhat each external head contributes before covering fixed costs.\n= ($1.00/lb × 491 retail lbs + $200 slaughter) − variable cost.\n≈ $617/head contribution at default rates.",
  usdaWS:        "USDA ACTUAL NEGOTIATED WHOLESALE PRICE\nFrom USDA AMS nw_ls110 — National Monthly Negotiated\nGrass-Fed Beef Wholesale Report.\nThese are REAL B2B prices paid between producers and buyers.\nNot estimated. Actual negotiated transactions.",
  wsPrice:       "YOUR WHOLESALE SELL PRICE\nPrice per lb you charge restaurant buyers for bulk orders.\nAim to be inside the USDA range — that's what market pays.\nSlider: green zone = inside USDA range.",
  maxWS:         "MAX WHOLESALE PRICE THIS RESTAURANT CAN AFFORD\nReverse-engineered from their menu:\n= (Menu price × food cost %) ÷ raw lbs needed\nRaw lbs = portion oz ÷ (1 − cooking loss %) ÷ 16\nGreen = your price fits. Red = over their budget.",
};

function fmt(v,d=2){return v.toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d});}
function money(v,d=0){return(v>=0?"$":"-$")+fmt(Math.abs(v),d);}

function hubCalc(numLoc,capPerPlant,fixedPerPlant,extH,lbPerHead,rLb,rHead,varCPH){
  const cap=numLoc*capPerPlant, fixed=numLoc*fixedPerPlant, h=Math.min(extH,cap);
  const gross=h*(lbPerHead*rLb+rHead), varC=h*varCPH, net=gross-varC-fixed;
  const rph=lbPerHead*rLb+rHead, nph=rph-varCPH;
  return{cap,fixed,h,gross,varC,net,rph,nph,be:fixed/Math.max(nph,.01),util:cap>0?h/cap:0};
}

const MLABEL = ({children}) => (
  <span style={{fontSize:8,padding:"1px 5px",borderRadius:3,marginLeft:4,background:"#1e3a5f",color:"#60a5fa",border:"1px solid #1e40af44",fontFamily:"monospace"}}>MONTHLY</span>
);
const YLABEL = () => (
  <span style={{fontSize:8,padding:"1px 5px",borderRadius:3,marginLeft:4,background:"#1a1a2e",color:"#a78bfa",border:"1px solid #6d28d944",fontFamily:"monospace"}}>ANNUAL</span>
);

export default function App(){
  // read-only investor mode via ?view=investor
  const [investorMode] = useState(()=>new URLSearchParams(window.location.search).get("view")==="investor");
  const printRef = useRef(null);

  // startup calculator
  const [suData,setSuData]=useState(buildStartupState);
  const updateSuField=(secKey,fieldKey,value)=>setSuData(p=>({...p,[secKey]:{...p[secKey],[fieldKey]:value}}));
  const suTotals=useMemo(()=>{const t={};STARTUP_SECTIONS.forEach(sec=>{t[sec.key]=sec.fields.reduce((s,[k])=>s+parseAmt(suData[sec.key][k]),0);});return t;},[suData]);
  const suStartupCost=useMemo(()=>STARTUP_SECTIONS.filter(s=>!s.monthly).reduce((s,sec)=>s+suTotals[sec.key],0),[suTotals]);
  const suMonthlyBurn=useMemo(()=>STARTUP_SECTIONS.filter(s=>s.monthly).reduce((s,sec)=>s+suTotals[sec.key],0),[suTotals]);

  // tooltip
  const [tip, setTip] = useState({show:false,text:"",x:0,y:0});
  const [tipsOn, setTipsOn] = useState(!investorMode);
  const T = (text) => tipsOn ? {
    onMouseEnter:(e)=>setTip({show:true,text:TIPS[text]||text,x:e.clientX,y:e.clientY}),
    onMouseMove:(e)=>setTip(t=>({...t,x:e.clientX,y:e.clientY})),
    onMouseLeave:()=>setTip(t=>({...t,show:false})),
    style:{cursor:"help"},
  } : {style:{cursor:"default"}};

  const [tab,setTab]=useState(0);
  const [phase,setPhase]=useState("3P");

  // retail
  const [lbs,setLbs]=useState(3000);
  const [tripCost,setTripCost]=useState(2200);
  const [trips,setTrips]=useState(2);
  const [shrink,setShrink]=useState(0.08);
  const [fixed,setFixed]=useState(22000);
  const [farmBase,setFarmBase]=useState(6.54);
  const [prices,setPrices]=useState(()=>{const o={};SKUS.forEach(s=>{o[s.id]=s.price;});return o;});
  const setP=(id,v)=>setPrices(p=>({...p,[id]:v}));

  // wholesale
  const [wsOn,setWsOn]=useState(false);
  const [wsPrices,setWsPrices]=useState(()=>{const o={};SKUS.forEach(s=>{o[s.id]=s.ws;});return o;});
  const setWP=(id,v)=>setWsPrices(p=>({...p,[id]:v}));
  const [wsLbs,setWsLbs]=useState(500);
  const [wsShrink,setWsShrink]=useState(0.03);

  // hub
  const [numLoc,setNumLoc]=useState(1);
  const [capPerPlant,setCapPerPlant]=useState(60);
  const [fixedPerPlant,setFixedPerPlant]=useState(14000);
  const [extH,setExtH]=useState(20);
  const [lbPerHead,setLbPerHead]=useState(491);
  const [rLb,setRLb]=useState(1.00);
  const [rHead,setRHead]=useState(200);
  const [varCPH,setVarCPH]=useState(73.65);

  const freight = (tripCost*trips)/lbs;
  const cardFee = 0.02;

  const skuRows = useMemo(()=>SKUS.map(s=>{
    const fa=farmBase+(s.farm-6.54), pc=phase==="3P"?s.p3:s.pO;
    const spLbs=lbs*s.mix, cogs=(fa+pc+freight)*(1+shrink), sp=prices[s.id];
    const gpLb=sp-cogs;
    return{...s,fa,pc,spLbs,cogs,gpLb,gm:gpLb/sp,rev:spLbs*sp,gpDol:spLbs*gpLb,compDelta:sp-s.comp};
  }),[prices,lbs,farmBase,phase,freight,shrink]);

  const totRev=skuRows.reduce((s,c)=>s+c.rev,0);
  const totGP=skuRows.reduce((s,c)=>s+c.gpDol,0);
  const totCOGS=skuRows.reduce((s,c)=>s+c.spLbs*c.cogs,0);
  const blendP=totRev/lbs, blendC=totCOGS/lbs, blendGM=totGP/totRev;
  const varFees=totRev*cardFee;
  const jmcNP=totGP-varFees-fixed;
  const beVol=(fixed+varFees)/(totGP/lbs);

  const cogs3P=useMemo(()=>SKUS.reduce((s,sk)=>s+sk.mix*(farmBase+(sk.farm-6.54)+sk.p3+freight)*(1+shrink),0),[farmBase,freight,shrink]);
  const cogsOwn=useMemo(()=>SKUS.reduce((s,sk)=>s+sk.mix*(farmBase+(sk.farm-6.54)+sk.pO+freight)*(1+shrink),0),[farmBase,freight,shrink]);

  const hub=useMemo(()=>hubCalc(numLoc,capPerPlant,fixedPerPlant,extH,lbPerHead,rLb,rHead,varCPH),
    [numLoc,capPerPlant,fixedPerPlant,extH,lbPerHead,rLb,rHead,varCPH]);
  const hubNP=phase==="Own"?hub.net:0;
  const combinedNP=jmcNP+hubNP;

  const wsRows=useMemo(()=>SKUS.map(s=>{
    const fa=farmBase+(s.farm-6.54), pc=phase==="3P"?s.p3:s.pO;
    const cogsWS=(fa+pc+freight)*(1+wsShrink), wsP=wsPrices[s.id];
    const gpLb=wsP-cogsWS, wLbs=wsLbs*s.mix, usda=USDA_WS[s.id];
    const uMid=usda?(usda.lo+usda.hi)/2:null;
    return{...s,wsP,cogsWS,gpLb,gm:gpLb/wsP,wLbs,rev:wLbs*wsP,gp:wLbs*gpLb,
      uLo:usda?.lo,uHi:usda?.hi,uMid,
      vsMid:uMid?((wsP-uMid)/uMid)*100:null,vsRetail:((wsP-prices[s.id])/prices[s.id])*100};
  }),[wsPrices,wsLbs,wsShrink,farmBase,phase,freight,prices]);

  const wsTotRev=wsRows.reduce((s,c)=>s+c.rev,0);
  const wsTotGP=wsRows.reduce((s,c)=>s+c.gp,0);
  const wsBlendP=wsTotRev/wsLbs, wsBlendGM=wsTotGP/wsTotRev;

  const wsActiveGP=wsOn?wsTotGP:0;
  const totalMo=jmcNP+wsActiveGP+hubNP;

  const locMatrix=Array.from({length:10},(_,i)=>i+1).map(loc=>{
    const cap=loc*capPerPlant, fix=loc*fixedPerPlant;
    const nph=(lbPerHead*rLb+rHead)-varCPH;
    const be=Math.ceil(fix/Math.max(nph,.01));
    const h50=hubCalc(loc,capPerPlant,fixedPerPlant,Math.floor(cap*.5),lbPerHead,rLb,rHead,varCPH);
    const h75=hubCalc(loc,capPerPlant,fixedPerPlant,Math.floor(cap*.75),lbPerHead,rLb,rHead,varCPH);
    const hMax=hubCalc(loc,capPerPlant,fixedPerPlant,cap,lbPerHead,rLb,rHead,varCPH);
    return{loc,cap,fix,be,at50:h50.net,at75:h75.net,atMax:hMax.net,current:loc===numLoc};
  });

  // head detail table
  const maxCap=numLoc*capPerPlant;
  const step=maxCap<=60?1:maxCap<=180?3:5;
  const headRows=[];
  for(let h=0;h<=maxCap;h+=step) headRows.push(h);
  if(!headRows.includes(extH)&&extH<=maxCap) headRows.push(extH);
  headRows.sort((a,b)=>a-b);

  const maxWS=(menuP,portOz,loss,fcPct)=>(menuP*fcPct)/((portOz/(1-loss))/16);

  const S=(l,v,setV,min,max,step2,fmt2,c,tipKey)=>(
    <div key={l} style={{flex:1,minWidth:130,padding:"2px 4px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span {...(tipKey?T(tipKey):{})} style={{fontSize:9,color:"#475569",fontFamily:"monospace",textTransform:"uppercase",
          borderBottom:tipKey?"1px dashed #374151":"none",cursor:tipKey?"help":"default"}}>{l}</span>
        <span style={{fontSize:11,fontWeight:"bold",color:c,fontFamily:"monospace"}}>{fmt2(v)}</span>
      </div>
      <input type="range" min={min} max={max} step={step2} value={v}
        onChange={e=>setV(parseFloat(e.target.value))} style={{width:"100%",accentColor:c,height:6}}/>
    </div>
  );

  const KPI=({label,val,sub,color,border,tipKey,badge})=>(
    <div {...T(tipKey)} style={{background:"#0c1628",border:`1px solid ${border||"#1e293b"}`,borderRadius:7,padding:"10px 12px"}}>
      <div style={{display:"flex",alignItems:"center",gap:3,marginBottom:4,flexWrap:"wrap"}}>
        <span style={{fontSize:9,color:"#475569",textTransform:"uppercase",fontFamily:"monospace",letterSpacing:"0.05em",borderBottom:"1px dashed #374151"}}>{label}</span>
        {badge==="M"&&<MLABEL/>}{badge==="Y"&&<YLABEL/>}
      </div>
      <div style={{fontSize:18,fontWeight:"bold",color,fontFamily:"monospace"}}>{val}</div>
      {sub&&<div style={{fontSize:9,color:"#475569",marginTop:3}}>{sub}</div>}
    </div>
  );

  return(
    <div style={{background:"#070d18",minHeight:"100vh",color:"#e2e8f0",fontFamily:"Georgia,serif",position:"relative"}}>

      {/* FLOATING TOOLTIP */}
      {tipsOn&&tip.show&&tip.text&&(
        <div style={{position:"fixed",left:Math.min(tip.x+12,window.innerWidth-250),top:Math.max(tip.y-6,8),
          zIndex:99999,background:"#0f172a",color:"#e2e8f0",border:"1px solid #334155",
          borderRadius:7,padding:"7px 10px",maxWidth:240,fontSize:10,lineHeight:1.55,
          boxShadow:"0 6px 20px #000b",pointerEvents:"none",fontFamily:"monospace",whiteSpace:"pre-line"}}>
          {tip.text.split("\n").map((line,i)=>(
            <div key={i} style={{color:i===0?"#fbbf24":"#64748b",fontWeight:i===0?"bold":"normal",marginBottom:i===0?3:0,fontSize:i===0?10:9}}>{line}</div>
          ))}
        </div>
      )}

      {/* MOBILE NOTICE */}
      <div className="mobile-notice" style={{display:"none",background:"#f59e0b",color:"#000",padding:"12px 22px",textAlign:"center",fontSize:12,fontFamily:"monospace",fontWeight:"bold"}}>
        Best viewed on desktop — rotate your device or open on a computer for the full experience.
      </div>

      {/* HEADER */}
      <div style={{background:"#0c1628",borderBottom:"1px solid #1e293b",padding:"10px 22px"}}>
        <div style={{maxWidth:1300,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:2}}>
              <div style={{width:28,height:28,borderRadius:6,background:"linear-gradient(135deg,#f59e0b,#d97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:"bold",color:"#000",fontFamily:"Georgia,serif",flexShrink:0}}>J</div>
              <div>
                <div style={{fontSize:9,color:"#475569",letterSpacing:"0.18em",textTransform:"uppercase",fontFamily:"monospace"}}>
                  Joseph Meat Company · Financial Model v10
                </div>
                <div style={{fontSize:15,fontWeight:"bold",color:"#f1f5f9",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  JMC Full Model
                  {investorMode&&<span style={{fontSize:9,padding:"2px 8px",borderRadius:4,background:"#f59e0b22",color:"#f59e0b",border:"1px solid #f59e0b44",fontFamily:"monospace"}}>INVESTOR VIEW</span>}
                  {!investorMode&&tipsOn&&<span style={{fontSize:10,color:"#4ade80",fontStyle:"italic",fontWeight:"normal"}}>
                    Hover <span style={{borderBottom:"1px dashed #4ade80"}}>dashed labels</span> for explanations · <MLABEL/> = monthly · <YLABEL/> = annual
                  </span>}
                </div>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            {/* PDF Export */}
            <button onClick={()=>window.print()} style={{
              padding:"7px 14px",borderRadius:6,cursor:"pointer",fontFamily:"monospace",fontSize:11,
              border:"2px solid #374151",background:"#0c1628",color:"#94a3b8",
              display:"flex",alignItems:"center",gap:6,
            }}>
              Export PDF
            </button>
            {/* Investor Link Copy */}
            {!investorMode&&<button onClick={()=>{navigator.clipboard.writeText(window.location.origin+"?view=investor");alert("Investor link copied to clipboard!");}} style={{
              padding:"7px 14px",borderRadius:6,cursor:"pointer",fontFamily:"monospace",fontSize:11,
              border:"2px solid #6d28d9",background:"#6d28d922",color:"#a78bfa",
              display:"flex",alignItems:"center",gap:6,
            }}>
              Copy Investor Link
            </button>}
            {/* Tooltip toggle */}
            {!investorMode&&<button onClick={()=>{setTipsOn(v=>!v);setTip(t=>({...t,show:false}));}} style={{
              padding:"7px 14px",borderRadius:6,cursor:"pointer",fontFamily:"monospace",fontSize:11,
              border:`2px solid ${tipsOn?"#4ade80":"#374151"}`,
              background:tipsOn?"#14532d":"#0c1628",
              color:tipsOn?"#4ade80":"#475569",
              display:"flex",alignItems:"center",gap:6,
            }}>
              {tipsOn?"Hints ON":"Hints OFF"}
            </button>}
            {!investorMode&&["3P","Own"].map(p=>(
              <button key={p} onClick={()=>setPhase(p)} style={{padding:"8px 18px",borderRadius:6,cursor:"pointer",
                fontFamily:"monospace",fontSize:12,fontWeight:"bold",
                border:`2px solid ${phase===p?"#f59e0b":"#1e293b"}`,
                background:phase===p?"#f59e0b18":"#0c1628",color:phase===p?"#f59e0b":"#64748b"}}>
                {p==="3P"?"Phase 1 · 3rd-Party":"Phase 2 · Owned Plant"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RETAIL SLIDERS */}
      <div style={{background:"#0c1628",borderBottom:"1px solid #1a2740",padding:"10px 22px",display:investorMode?"none":undefined}}>
        <div style={{maxWidth:1300,margin:"0 auto",display:"flex",gap:16,flexWrap:"wrap",alignItems:"flex-end"}}>
          {S("Retail Lbs/Month",lbs,setLbs,500,12000,250,v=>v.toLocaleString()+"lb","#c084fc","retailRevMo")}
          {S("Trip Cost $",tripCost,setTripCost,1000,5000,200,v=>"$"+v.toLocaleString(),"#0ea5e9","trans")}
          {S("Trips/Month",trips,setTrips,1,4,1,v=>v+"×","#0ea5e9","trans")}
          {S("Shrink %",shrink,setShrink,0.03,0.15,0.01,v=>Math.round(v*100)+"%","#f97316","cogs")}
          {S("Farm Base/lb",farmBase,setFarmBase,4.5,9.0,0.10,v=>"$"+fmt(v),"#ef4444","farm")}
          {S("LA Fixed/Month $",fixed,setFixed,15000,40000,1000,v=>"$"+v.toLocaleString(),"#f87171","jmcNetMo")}
          <div {...T("trans")} style={{background:"#070d18",borderRadius:5,padding:"5px 10px",fontSize:10,fontFamily:"monospace",color:"#64748b",border:"1px solid #1e293b",flexShrink:0}}>
            <div>Freight: <b style={{color:"#0ea5e9"}}>${fmt(freight)}/lb</b></div>
            <div style={{fontSize:9}}>${(tripCost*trips).toLocaleString()}/mo ÷ {lbs.toLocaleString()}lb</div>
          </div>
        </div>
      </div>

      {/* HUB CONTROLS */}
      {!investorMode&&phase==="Own"&&(
        <div style={{background:"#071a0f",borderBottom:"1px solid #166534",padding:"12px 22px"}}>
          <div style={{maxWidth:1300,margin:"0 auto"}}>
            <div style={{fontSize:10,color:"#22c55e",fontFamily:"monospace",fontWeight:"bold",marginBottom:10}}>⚙ PHASE 2 — OWNED PROCESSING HUB CONTROLS
              <span {...T("hubFixed")} style={{fontSize:10,color:"#4ade80",marginLeft:10,borderBottom:"1px dashed #166534",cursor:"help"}}>Fixed costs = locations you OWN, not heads processed</span>
            </div>
            <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"flex-end"}}>

              {/* Locations — prominent */}
              <div style={{background:"#0c2a1a",border:"2px solid #22c55e",borderRadius:10,padding:"12px 16px",minWidth:155,flexShrink:0}}>
                <div {...T("hubFixed")} style={{fontSize:9,color:"#22c55e",fontFamily:"monospace",textTransform:"uppercase",marginBottom:4,borderBottom:"1px dashed #166534",cursor:"help"}}>Owned Locations</div>
                <div style={{fontSize:32,fontWeight:"bold",color:"#4ade80",fontFamily:"monospace",textAlign:"center"}}>{numLoc}</div>
                <input type="range" min={1} max={20} step={1} value={numLoc}
                  onChange={e=>{const v=parseInt(e.target.value);setNumLoc(v);if(extH>v*capPerPlant)setExtH(v*capPerPlant);}}
                  style={{width:"100%",accentColor:"#22c55e",marginTop:6}}/>
                <div style={{marginTop:6,fontSize:9,fontFamily:"monospace",color:"#64748b",lineHeight:1.8}}>
                  <div>Capacity: <b style={{color:"#4ade80"}}>{hub.cap} hd/mo</b></div>
                  <div>Fixed: <b style={{color:"#f87171"}}>${(numLoc*fixedPerPlant).toLocaleString()}/mo</b></div>
                </div>
              </div>

              {S("Cap/Plant (hd)",capPerPlant,setCapPerPlant,10,300,5,v=>v+" hd","#a855f7","hubBE")}
              {S("Fixed/Plant/Mo",fixedPerPlant,setFixedPerPlant,8000,50000,1000,v=>"$"+v.toLocaleString(),"#a855f7","hubFixed")}

              <div style={{minWidth:130,flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span {...T("netPerHead")} style={{fontSize:9,color:"#4ade80",fontFamily:"monospace",textTransform:"uppercase",borderBottom:"1px dashed #166534",cursor:"help"}}>Ext Heads/Mo</span>
                  <span style={{fontSize:11,fontWeight:"bold",color:"#4ade80",fontFamily:"monospace"}}>{hub.h} / {hub.cap}</span>
                </div>
                <input type="range" min={0} max={Math.max(hub.cap,1)} step={1} value={extH}
                  onChange={e=>setExtH(parseInt(e.target.value))} style={{width:"100%",accentColor:"#4ade80"}}/>
                <div style={{height:5,background:"#1e293b",borderRadius:3,overflow:"hidden",marginTop:3}}>
                  <div style={{height:"100%",width:`${hub.util*100}%`,background:hub.util>0.7?"#4ade80":"#f59e0b",borderRadius:3}}/>
                </div>
                <div {...T("hubBE")} style={{fontSize:9,color:"#475569",fontFamily:"monospace",marginTop:2,cursor:"help"}}>{Math.round(hub.util*100)}% utilization · BE: {Math.ceil(hub.be)} heads</div>
              </div>

              {S("Rate $/lb retail",rLb,setRLb,0.5,3.0,0.05,v=>"$"+fmt(v),"#fbbf24","netPerHead")}
              {S("Rate $/head",rHead,setRHead,50,600,10,v=>"$"+v,"#fbbf24","netPerHead")}
              {S("Retail Lbs/Head",lbPerHead,setLbPerHead,300,700,5,v=>v+"lb","#34d399","netPerHead")}
              {S("Var Cost/Head",varCPH,setVarCPH,20,200,2.5,v=>"$"+fmt(v),"#f97316","netPerHead")}

              {/* Hub snapshot */}
              <div style={{background:"#0c1628",border:"1px solid #166534",borderRadius:8,padding:"8px 12px",minWidth:165,flexShrink:0}}>
                <div style={{fontSize:9,color:"#4ade80",fontFamily:"monospace",marginBottom:5}}>HUB P&L — MONTHLY</div>
                {[
                  ["Gross ext rev",money(hub.gross),"#4ade80","MONTHLY GROSS EXTERNAL REVENUE\nHeads × ($1.00/lb × 491 lbs + $200) per head"],
                  ["Variable cost","-"+money(hub.varC),"#f87171","Monthly variable cost to process external heads"],
                  ["Plant fixed","-"+money(hub.fixed),"#f87171","hubFixed"],
                  ["Hub net / mo",money(hub.net),hub.net>=0?"#22c55e":"#f87171","hubNetMo"],
                ].map(([k,v,c,tipK])=>(
                  <div key={k} {...T(tipK)} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",borderBottom:"1px solid #1a2740"}}>
                    <span style={{fontSize:9,color:"#475569",fontFamily:"monospace",borderBottom:"1px dashed #374151"}}>{k}</span>
                    <span style={{fontSize:10,fontWeight:"bold",color:c,fontFamily:"monospace"}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI BAR */}
      <div style={{background:"#0a1020",borderBottom:"1px solid #1a2740",padding:"10px 22px"}}>
        <div style={{maxWidth:1300,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:8}}>
          <KPI label="Revenue" badge="M" val={money(totRev)} sub={"$"+fmt(blendP)+"/lb · "+lbs.toLocaleString()+"lb"} color="#4ade80" tipKey="retailRevMo"/>
          <KPI label="Gross Profit" badge="M" val={money(totGP)} sub={fmt(blendGM*100,1)+"% GM — before fixed costs"} color="#60a5fa" tipKey="grossProfitMo"/>
          <KPI label="JMC Net Profit" badge="M" val={money(jmcNP)} sub="After $22K fixed + 2% fees" color={jmcNP>=0?"#4ade80":"#f87171"} border={jmcNP>=0?"#166534":"#7f1d1d"} tipKey="jmcNetMo"/>
          {phase==="Own"?<KPI label="Hub Net" badge="M" val={money(hub.net)} sub={hub.h+" ext heads · "+Math.round(hub.util*100)+"% util"} color={hub.net>=0?"#22c55e":"#f87171"} border={hub.net>=0?"#166534":"#7f1d1d"} tipKey="hubNetMo"/>
            :<KPI label="Net Profit" badge="Y" val={money(jmcNP*12)} sub="Monthly × 12" color={jmcNP>=0?"#c084fc":"#f87171"} tipKey="annualTotal"/>}
          <KPI label="Combined Net" badge="M" val={money(combinedNP)} sub={phase==="Own"?"Retail + Hub":"Retail only"} color={combinedNP>=0?"#4ade80":"#f87171"} border={combinedNP>=0?"#166534":"#7f1d1d"} tipKey="combinedNPMo"/>
          <KPI label="Wholesale GP" badge="M"
            val={wsOn?money(wsTotGP):"OFF"}
            sub={wsOn?"$"+fmt(wsBlendP)+"/lb · "+wsLbs.toLocaleString()+"lb":"Enable in ⑤ Wholesale tab"}
            color={wsOn?"#fbbf24":"#374151"} border={wsOn?"#92400e":"#1e293b"} tipKey="wsGPMo"/>
          <KPI label="All Channels" badge="M" val={money(totalMo)} sub={wsOn?"Retail NP + WS GP + Hub":"Retail NP + Hub (WS off)"} color={totalMo>=0?"#4ade80":"#f87171"} border={totalMo>=0?"#166534":"#7f1d1d"} tipKey="totalMo"/>
          <KPI label="All Channels" badge="Y" val={money(totalMo*12)} sub="Monthly × 12, current run rate" color={totalMo>=0?"#c084fc":"#f87171"} tipKey="annualTotal"/>
        </div>
      </div>

      {/* TABS */}
      <div style={{background:"#0c1628",borderBottom:"1px solid #1e293b"}}>
        <div style={{maxWidth:1300,margin:"0 auto",display:"flex"}}>
          {TABS.map((t,i)=>(
            <button key={i} onClick={()=>setTab(i)} style={{padding:"9px 16px",border:"none",cursor:"pointer",
              fontFamily:"monospace",fontSize:11,whiteSpace:"nowrap",
              borderBottom:`2px solid ${tab===i?"#f59e0b":"transparent"}`,
              background:"transparent",color:tab===i?"#f59e0b":"#64748b"}}>{t}</button>
          ))}
        </div>
      </div>

      <div ref={printRef} style={{maxWidth:1300,margin:"0 auto",padding:"16px 22px"}}>

        {/* ══ TAB 0: EXECUTIVE SUMMARY ══ */}
        {tab===0&&(
          <div>
            {/* Hero Section */}
            <div style={{background:"linear-gradient(135deg, #0c1628 0%, #1a1040 100%)",border:"1px solid #1e293b",borderRadius:12,padding:"32px 36px",marginBottom:16,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,right:0,width:200,height:200,background:"radial-gradient(circle, #f59e0b11 0%, transparent 70%)",pointerEvents:"none"}}/>
              <div style={{fontSize:9,color:"#f59e0b",letterSpacing:"0.2em",textTransform:"uppercase",fontFamily:"monospace",marginBottom:6}}>Investor Overview</div>
              <div style={{fontSize:24,fontWeight:"bold",color:"#f1f5f9",marginBottom:4}}>Joseph Meat Company</div>
              <div style={{fontSize:13,color:"#94a3b8",maxWidth:700,lineHeight:1.6}}>
                Vertically-integrated beef operation — Nebraska-sourced, LA-retail. Premium whole-animal butcher shop with wholesale channel and owned processing hub expansion path.
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
              {[
                {label:"Annual Revenue (Projected)",val:money(totRev*12),sub:lbs.toLocaleString()+" lbs/mo retail",color:"#4ade80",icon:"$"},
                {label:"Annual Net Profit",val:money(totalMo*12),sub:(totalMo>=0?"Profitable":"Pre-profit")+" at current volume",color:totalMo>=0?"#c084fc":"#f87171",icon:"$"},
                {label:"Gross Margin",val:fmt(blendGM*100,1)+"%",sub:"Blended across all SKUs",color:blendGM>=0.5?"#4ade80":"#f59e0b",icon:"%"},
                {label:"Break-Even Volume",val:fmt(beVol,0)+" lbs/mo",sub:beVol<=lbs?"Above break-even":"Below — need "+fmt(beVol-lbs,0)+" more lbs",color:beVol<=lbs?"#4ade80":"#f87171",icon:"BE"},
              ].map(k=>(
                <div key={k.label} style={{background:"#0c1628",border:"1px solid #1e293b",borderRadius:10,padding:"20px 18px",position:"relative"}}>
                  <div style={{position:"absolute",top:14,right:14,fontSize:20,color:"#1e293b",fontFamily:"monospace",fontWeight:"bold"}}>{k.icon}</div>
                  <div style={{fontSize:9,color:"#475569",textTransform:"uppercase",fontFamily:"monospace",letterSpacing:"0.05em",marginBottom:8}}>{k.label}</div>
                  <div style={{fontSize:24,fontWeight:"bold",color:k.color,fontFamily:"monospace"}}>{k.val}</div>
                  <div style={{fontSize:10,color:"#475569",marginTop:6}}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Two Column: Unit Economics + Revenue Channels */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
              {/* Unit Economics */}
              <div style={{background:"#0c1628",border:"1px solid #1e293b",borderRadius:10,padding:"20px 22px"}}>
                <div style={{fontSize:11,color:"#f59e0b",fontFamily:"monospace",fontWeight:"bold",marginBottom:14,borderBottom:"1px solid #1e293b",paddingBottom:8}}>UNIT ECONOMICS (per lb)</div>
                {[
                  ["Blended Sell Price","$"+fmt(blendP),"#4ade80"],
                  ["All-In COGS","$"+fmt(blendC),"#fb923c"],
                  ["Gross Profit / lb","$"+fmt(totGP/lbs),"#60a5fa"],
                  ["Processing ("+( phase==="3P"?"3rd-Party":"Owned")+")","$"+fmt(phase==="3P"?cogs3P-cogsOwn+SKUS.reduce((s,sk)=>s+sk.mix*sk.pO,0):SKUS.reduce((s,sk)=>s+sk.mix*sk.pO,0)),"#c084fc"],
                  ["Freight / lb","$"+fmt(freight),"#0ea5e9"],
                ].map(([k,v,c])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #1a2740"}}>
                    <span style={{fontSize:11,color:"#94a3b8",fontFamily:"monospace"}}>{k}</span>
                    <span style={{fontSize:12,fontWeight:"bold",color:c,fontFamily:"monospace"}}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Revenue Channels */}
              <div style={{background:"#0c1628",border:"1px solid #1e293b",borderRadius:10,padding:"20px 22px"}}>
                <div style={{fontSize:11,color:"#f59e0b",fontFamily:"monospace",fontWeight:"bold",marginBottom:14,borderBottom:"1px solid #1e293b",paddingBottom:8}}>REVENUE CHANNELS (Monthly)</div>
                {[
                  ["Retail Shop ("+lbs.toLocaleString()+" lbs/mo)",money(jmcNP),jmcNP>=0?"#4ade80":"#f87171","Net after $"+fmt(fixed,0)+" fixed"],
                  ["Wholesale "+(wsOn?"ACTIVE":"OFF"),wsOn?money(wsTotGP):"—",wsOn?"#fbbf24":"#374151",wsOn?wsLbs.toLocaleString()+" lbs/mo":"Not yet activated"],
                  ["Processing Hub "+(phase==="Own"?"ACTIVE":"PLANNED"),phase==="Own"?money(hub.net):"—",phase==="Own"?(hub.net>=0?"#22c55e":"#f87171"):"#374151",phase==="Own"?hub.h+" heads/mo, "+Math.round(hub.util*100)+"% util":"Phase 2 — owned plant"],
                  ["──────────","","#1e293b",""],
                  ["TOTAL Monthly",money(totalMo),totalMo>=0?"#4ade80":"#f87171","All active channels"],
                  ["TOTAL Annual",money(totalMo*12),totalMo>=0?"#c084fc":"#f87171","Projected run rate"],
                ].map(([k,v,c,s])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:k.startsWith("──")?"none":"1px solid #1a2740"}}>
                    <div>
                      <span style={{fontSize:11,color:k.startsWith("TOTAL")?"#e2e8f0":"#94a3b8",fontFamily:"monospace",fontWeight:k.startsWith("TOTAL")?"bold":"normal"}}>{k}</span>
                      {s&&<div style={{fontSize:9,color:"#374151"}}>{s}</div>}
                    </div>
                    <span style={{fontSize:k.startsWith("TOTAL")?14:12,fontWeight:"bold",color:c,fontFamily:"monospace"}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase Comparison */}
            <div style={{background:"#0c1628",border:"1px solid #1e293b",borderRadius:10,padding:"20px 22px",marginBottom:16}}>
              <div style={{fontSize:11,color:"#f59e0b",fontFamily:"monospace",fontWeight:"bold",marginBottom:14,borderBottom:"1px solid #1e293b",paddingBottom:8}}>PHASE COMPARISON — Processing Cost Impact</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
                {[
                  {label:"Phase 1: 3rd-Party",desc:"Midwest Meat Co., Minden NE",cogsVal:cogs3P,color:"#f59e0b"},
                  {label:"Phase 2: Owned Plant",desc:"MBMC plant, labor only",cogsVal:cogsOwn,color:"#22c55e"},
                  {label:"Savings per lb",desc:"Processing cost reduction",cogsVal:cogs3P-cogsOwn,color:"#c084fc"},
                ].map(p=>{
                  const annualSavings=p.label.includes("Savings")?(cogs3P-cogsOwn)*lbs*12:null;
                  return(
                    <div key={p.label} style={{background:"#070d18",borderRadius:8,padding:"16px",border:"1px solid #1e293b"}}>
                      <div style={{fontSize:10,color:p.color,fontFamily:"monospace",fontWeight:"bold",marginBottom:4}}>{p.label}</div>
                      <div style={{fontSize:9,color:"#374151",marginBottom:8}}>{p.desc}</div>
                      <div style={{fontSize:22,fontWeight:"bold",color:p.color,fontFamily:"monospace"}}>${fmt(p.cogsVal)}/lb</div>
                      {annualSavings!=null&&<div style={{fontSize:10,color:"#4ade80",marginTop:6}}>{money(annualSavings)}/yr savings at current volume</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top SKUs */}
            <div style={{background:"#0c1628",border:"1px solid #1e293b",borderRadius:10,padding:"20px 22px",marginBottom:16}}>
              <div style={{fontSize:11,color:"#f59e0b",fontFamily:"monospace",fontWeight:"bold",marginBottom:14,borderBottom:"1px solid #1e293b",paddingBottom:8}}>TOP SKUs BY GROSS PROFIT (Monthly)</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10}}>
                {[...skuRows].sort((a,b)=>b.gpDol-a.gpDol).slice(0,6).map(s=>{
                  const c=CAT_C[s.cat]||"#64748b";
                  return(
                    <div key={s.id} style={{background:"#070d18",borderRadius:8,padding:"14px",border:`1px solid ${c}33`}}>
                      <div style={{fontSize:11,color:"#e2e8f0",fontWeight:"bold",marginBottom:2}}>{s.label}</div>
                      <span style={{fontSize:8,padding:"1px 5px",borderRadius:3,background:c+"22",color:c,border:`1px solid ${c}44`}}>{s.cat}</span>
                      <div style={{fontSize:18,fontWeight:"bold",color:"#60a5fa",fontFamily:"monospace",marginTop:8}}>{money(s.gpDol,0)}</div>
                      <div style={{fontSize:9,color:"#475569",marginTop:2}}>{fmt(s.gm*100,1)}% GM · ${fmt(s.gpLb)}/lb</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Competitive Position */}
            <div style={{background:"#0c1628",border:"1px solid #1e293b",borderRadius:10,padding:"20px 22px"}}>
              <div style={{fontSize:11,color:"#f59e0b",fontFamily:"monospace",fontWeight:"bold",marginBottom:14,borderBottom:"1px solid #1e293b",paddingBottom:8}}>COMPETITIVE POSITIONING — LA Market</div>
              <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.7,fontFamily:"monospace"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
                  <div>
                    <div style={{color:"#f59e0b",fontWeight:"bold",marginBottom:6}}>Sourcing Advantage</div>
                    <div style={{fontSize:10,color:"#64748b"}}>Direct Nebraska ranch partnerships. No middleman markup. Full traceability from pasture to counter.</div>
                  </div>
                  <div>
                    <div style={{color:"#f59e0b",fontWeight:"bold",marginBottom:6}}>Price Position</div>
                    <div style={{fontSize:10,color:"#64748b"}}>Premium tier pricing — positioned between mass-market (Vons, TJ's) and ultra-premium (Cream Co., McCall's). Avg {skuRows.filter(s=>s.compDelta<0).length}/{skuRows.length} SKUs priced below comparable competitors.</div>
                  </div>
                  <div>
                    <div style={{color:"#f59e0b",fontWeight:"bold",marginBottom:6}}>Growth Path</div>
                    <div style={{fontSize:10,color:"#64748b"}}>Phase 1: Retail + Wholesale. Phase 2: Owned processing hub — $1.29/lb cost reduction, external rancher revenue, vertical integration moat.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB 1: SKU P&L ══ */}
        {tab===1&&(
          <div>
            <div style={{background:"#0c1628",border:"1px solid #1e293b",borderRadius:7,padding:"8px 14px",marginBottom:12,fontSize:10,color:"#64748b",fontFamily:"monospace"}}>
              All SKU figures are <MLABEL/> — multiply by 12 for annual. Hover column headers for explanations. Adjust retail prices with sliders.
            </div>
            <div style={{overflowX:"auto",marginBottom:12}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"monospace",fontSize:11}}>
                <thead>
                  <tr style={{borderBottom:"2px solid #1e293b"}}>
                    {[["SKU","Product name"],["Cat","Category type"],["Mix%","% of monthly volume"],["Lbs/Mo","Lbs sold per month — monthly"],
                      ["Retail Price","Your sell price per lb — adjust with slider + number"],
                      ["vs Comp","vsComp"],["Farm","farm"],["Proc","proc"],["Trans","trans"],["COGS","cogs"],
                      ["GP/lb","gpLb"],["GM%","gm"],
                      ["Revenue/Mo","Monthly sales from this SKU"],["GP/Mo","Monthly gross profit from this SKU"]
                    ].map(([h,tipK])=>(
                      <th key={h} style={{padding:"7px 8px",textAlign:["SKU","Cat"].includes(h)?"left":"right",color:"#475569",fontSize:9,textTransform:"uppercase",whiteSpace:"nowrap"}}>
                        <span {...(TIPS[tipK]||tipK?.length>10?T(tipK):{})} style={{borderBottom:TIPS[tipK]?"1px dashed #374151":"none",cursor:TIPS[tipK]?"help":"default"}}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {skuRows.map((s,i)=>{
                    const c=CAT_C[s.cat]||"#64748b";
                    const sp=prices[s.id];
                    return(
                      <tr key={s.id} style={{borderBottom:"1px solid #1a2740",background:i%2===0?"#0c162833":"transparent"}}>
                        <td style={{padding:"7px 8px",color:"#e2e8f0",fontWeight:"bold"}}>{s.label}</td>
                        <td style={{padding:"7px 8px"}}><span style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:c+"22",color:c,border:`1px solid ${c}44`}}>{s.cat}</span></td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:"#64748b"}}>{Math.round(s.mix*100)}%</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:"#64748b"}}>{Math.round(s.spLbs)}</td>
                        <td style={{padding:"12px 18px",textAlign:"right",minWidth:250}}>
                          <div style={{display:"flex",alignItems:"center",gap:14,justifyContent:"flex-end"}}>
                            <input type="range" min={5} max={120} step={1} value={sp} onChange={e=>setP(s.id,parseFloat(e.target.value))} style={{width:100,accentColor:c}}/>
                            <input type="number" value={sp} step={1} min={5} max={120} onChange={e=>setP(s.id,parseFloat(e.target.value))} style={{width:85,background:"#1e293b",color:"#f59e0b",border:"1px solid #374151",borderRadius:5,padding:"6px 10px",fontFamily:"monospace",fontSize:14,textAlign:"right"}}/>
                          </div>
                        </td>
                        <td {...T("vsComp")} style={{padding:"7px 8px",textAlign:"right",color:s.compDelta>=0?"#f87171":"#4ade80",fontWeight:"bold"}}>{s.compDelta>=0?"+":""}{fmt(s.compDelta)}</td>
                        <td {...T("farm")} style={{padding:"7px 8px",textAlign:"right",color:"#ef4444"}}>${fmt(s.fa)}</td>
                        <td {...T("proc")} style={{padding:"7px 8px",textAlign:"right",color:phase==="3P"?"#f97316":"#fbbf24"}}>${fmt(s.pc)}</td>
                        <td {...T("trans")} style={{padding:"7px 8px",textAlign:"right",color:"#0ea5e9"}}>${fmt(freight)}</td>
                        <td {...T("cogs")} style={{padding:"7px 8px",textAlign:"right",color:"#fb923c",fontWeight:"bold"}}>${fmt(s.cogs)}</td>
                        <td {...T("gpLb")} style={{padding:"7px 8px",textAlign:"right",color:s.gpLb>=0?"#4ade80":"#f87171",fontWeight:"bold"}}>${fmt(s.gpLb)}</td>
                        <td {...T("gm")} style={{padding:"7px 8px",textAlign:"right",color:s.gm>=0.6?"#4ade80":s.gm>=0.4?"#f59e0b":"#f87171"}}>{fmt(s.gm*100,1)}%</td>
                        <td style={{padding:"7px 8px",textAlign:"right"}}>${fmt(s.rev,0)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:s.gpDol>=0?"#60a5fa":"#f87171",fontWeight:"bold"}}>${fmt(s.gpDol,0)}</td>
                      </tr>
                    );
                  })}
                  <tr style={{borderTop:"2px solid #334155",background:"#1e293b44"}}>
                    <td colSpan={4} style={{padding:"9px 8px",color:"#94a3b8",fontWeight:"bold"}}>MONTHLY TOTALS / WEIGHTED AVG</td>
                    <td style={{padding:"9px 8px",textAlign:"right",color:"#f59e0b",fontWeight:"bold"}}>${fmt(blendP)}<div style={{fontSize:8,color:"#374151"}}>blended $/lb</div></td>
                    <td colSpan={4}></td>
                    <td style={{padding:"9px 8px",textAlign:"right",color:"#fb923c",fontWeight:"bold"}}>${fmt(blendC)}</td>
                    <td style={{padding:"9px 8px",textAlign:"right",color:"#4ade80",fontWeight:"bold"}}>${fmt(totGP/lbs)}</td>
                    <td style={{padding:"9px 8px",textAlign:"right",color:"#60a5fa",fontWeight:"bold"}}>{fmt(blendGM*100,1)}%</td>
                    <td style={{padding:"9px 8px",textAlign:"right",fontWeight:"bold"}}>${fmt(totRev,0)}/mo</td>
                    <td style={{padding:"9px 8px",textAlign:"right",color:"#60a5fa",fontWeight:"bold"}}>${fmt(totGP,0)}/mo</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
              {[
                {l:"Gross Profit",  b:"M", v:money(totGP),          s:fmt(blendGM*100,1)+"% GM",       c:"#60a5fa", tip:"grossProfitMo"},
                {l:"Variable Fees", b:"M", v:"-"+money(varFees),     s:"2% of revenue · card & misc",    c:"#f87171", tip:"VARIABLE FEES (Monthly)\n2% of total monthly revenue.\nCovers credit card processing and misc fees."},
                {l:"Fixed LA Costs",b:"M", v:"-"+money(fixed),       s:"Rent, staff, utilities, insur.",  c:"#f87171", tip:"LA FIXED MONTHLY COSTS\nPaid every month regardless of sales.\nDefault: $22,000/mo (rent, staff, utilities, insurance)."},
                {l:"Net Profit",    b:"M", v:money(jmcNP),           s:"Retail bottom line",              c:jmcNP>=0?"#4ade80":"#f87171", tip:"jmcNetMo"},
                {l:"Net Profit",    b:"Y", v:money(jmcNP*12),        s:"Monthly × 12, current run rate",  c:jmcNP>=0?"#c084fc":"#f87171", tip:"annualTotal"},
              ].map(k=>(
                <div key={k.l+k.b} {...T(k.tip)} style={{background:"#0c1628",border:"1px solid #1e293b",borderRadius:7,padding:"12px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:3,marginBottom:5}}>
                    <span style={{fontSize:9,color:"#475569",textTransform:"uppercase",fontFamily:"monospace",borderBottom:"1px dashed #374151"}}>{k.l}</span>
                    {k.b==="M"?<MLABEL/>:<YLABEL/>}
                  </div>
                  <div style={{fontSize:19,fontWeight:"bold",color:k.c,fontFamily:"monospace"}}>{k.v}</div>
                  <div style={{fontSize:10,color:"#475569",marginTop:3}}>{k.s}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TAB 2: SCENARIOS ══ */}
        {tab===2&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {[{label:"PHASE 1 — 3rd-Party Processing",color:"#f59e0b",cogsLb:cogs3P,withHub:false},
              {label:`PHASE 2 — ${numLoc} Owned Location${numLoc!==1?"s":""}`,color:"#22c55e",cogsLb:cogsOwn,withHub:true}
            ].map(ph=>(
              <div key={ph.label} style={{background:"#0c1628",border:`1px solid ${ph.withHub?"#166534":"#1e293b"}`,borderRadius:8,padding:"16px 18px"}}>
                <div style={{fontSize:11,color:ph.color,fontFamily:"monospace",fontWeight:"bold",marginBottom:4}}>{ph.label}</div>
                <div style={{fontSize:9,color:"#374151",fontFamily:"monospace",marginBottom:12}}>All figures are MONTHLY. Annual column = Monthly × 12.</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"monospace",fontSize:11}}>
                  <thead><tr style={{borderBottom:"1px solid #1e293b"}}>
                    {["Lbs/Mo","Revenue/Mo","Gross Profit/Mo",ph.withHub?"Hub Net/Mo":"","Fixed+Fees/Mo","Net Profit/Mo","Annual Net"].filter(Boolean).map(h=>(
                      <th key={h} style={{padding:"6px 8px",textAlign:"right",color:"#475569",fontSize:9,textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
                    ))}</tr></thead>
                  <tbody>{[1200,2000,3000,5000,10000].map(v=>{
                    const r=v*blendP, c2=v*ph.cogsLb, gp2=r-c2, fees=r*.02;
                    const np=gp2+(ph.withHub?hub.net:0)-fees-fixed;
                    const cur=v===lbs;
                    return(<tr key={v} style={{borderBottom:"1px solid #1a2740",background:cur?"#1e293b55":"transparent"}}>
                      <td style={{padding:"8px",color:cur?ph.color:"#64748b",fontWeight:cur?"bold":"normal"}}>{v.toLocaleString()}lb{cur?" ◄":""}</td>
                      <td style={{padding:"8px",textAlign:"right"}}>${fmt(r,0)}</td>
                      <td style={{padding:"8px",textAlign:"right",color:"#60a5fa"}}>${fmt(gp2,0)}</td>
                      {ph.withHub&&<td style={{padding:"8px",textAlign:"right",color:hub.net>=0?"#4ade80":"#f87171"}}>{money(hub.net)}</td>}
                      <td style={{padding:"8px",textAlign:"right",color:"#f87171"}}>${fmt(fixed+fees,0)}</td>
                      <td style={{padding:"8px",textAlign:"right",color:np>=0?"#4ade80":"#f87171",fontWeight:"bold"}}>{money(np)}</td>
                      <td style={{padding:"8px",textAlign:"right",color:np>=0?"#c084fc":"#f87171"}}>{money(np*12)}</td>
                    </tr>);
                  })}</tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* ══ TAB 3: COMPETITORS ══ */}
        {tab===3&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {COMPS.map((store,i)=>(
              <div key={i} style={{background:"#0c1628",border:"1px solid #1e293b",borderRadius:8,padding:"14px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:12,color:"#e2e8f0",fontWeight:"bold"}}>{store.store}</span>
                  <span style={{fontSize:9,padding:"2px 7px",borderRadius:10,background:"#1e293b",color:"#64748b",fontFamily:"monospace"}}>{store.tier}</span>
                </div>
                {store.items.map((item,j)=>(
                  <div key={j} style={{display:"flex",justifyContent:"space-between",padding:"4px 6px",background:"#070d18",borderRadius:4,marginBottom:3}}>
                    <span style={{fontSize:10,color:"#94a3b8"}}>{item.n}</span>
                    <span {...T("RETAIL PRICE OBSERVED IN PERSON\nSurveyed April 10, 2026.\nThis is retail price to consumers — not wholesale.\nSource: "+store.store)}
                      style={{fontSize:11,fontWeight:"bold",color:"#4ade80",fontFamily:"monospace"}}>${fmt(item.p)}/lb</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ══ TAB 4: PROCESSING SCALE ══ */}
        {tab===4&&(
          <div>
            <div style={{background:"#0c1628",border:"1px solid #1e293b",borderRadius:8,padding:"16px 18px",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{fontSize:11,color:"#a855f7",fontFamily:"monospace",fontWeight:"bold"}}>LOCATION MATRIX — 1 to 10 Plants</span>
                <span style={{fontSize:9,color:"#374151",fontFamily:"monospace"}}>All figures MONTHLY unless marked ANNUAL · Click location number to switch model</span>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"monospace",fontSize:11}}>
                  <thead><tr style={{borderBottom:"2px solid #1e293b"}}>
                    {[
                      ["Locations","Number of plants you own"],
                      ["Total Cap","Max heads/mo across all plants"],
                      ["Total Fixed/Mo","Monthly plant overhead — paid regardless of utilization"],
                      ["Break-Even Heads","Heads/mo needed just to cover plant fixed costs"],
                      ["At 50% Full — Monthly","Hub net if half capacity filled with ext heads"],
                      ["At 75% Full — Monthly","Hub net at 75% utilization"],
                      ["At 100% Full — Monthly","Hub net at maximum capacity"],
                      ["Annual Max","Best-case annual hub profit at full capacity"],
                    ].map(([h,tip2])=>(
                      <th key={h} style={{padding:"7px 9px",textAlign:"right",color:"#475569",fontSize:9,textTransform:"uppercase",whiteSpace:"nowrap"}}>
                        <span {...T(tip2)} style={{borderBottom:"1px dashed #374151",cursor:"help"}}>{h}</span>
                      </th>
                    ))}</tr></thead>
                  <tbody>{locMatrix.map(row=>(
                    <tr key={row.loc} style={{borderBottom:"1px solid #1a2740",background:row.current?"#1e293b66":"transparent",borderLeft:row.current?"3px solid #fbbf24":"3px solid transparent"}}>
                      <td style={{padding:"8px 9px",textAlign:"right"}}>
                        <button onClick={()=>setNumLoc(row.loc)} style={{background:row.current?"#fbbf24":"#1e293b",color:row.current?"#000":"#94a3b8",border:`1px solid ${row.current?"#fbbf24":"#374151"}`,borderRadius:5,padding:"3px 10px",cursor:"pointer",fontFamily:"monospace",fontSize:11,fontWeight:row.current?"bold":"normal"}}>{row.loc}{row.current?" ◄":""}</button>
                      </td>
                      <td style={{padding:"8px 9px",textAlign:"right",color:"#a855f7"}}>{row.cap} hd</td>
                      <td {...T("hubFixed")} style={{padding:"8px 9px",textAlign:"right",color:"#f87171",cursor:"help"}}>${fmt(row.fix,0)}/mo</td>
                      <td {...T("hubBE")} style={{padding:"8px 9px",textAlign:"right",color:"#fbbf24",cursor:"help"}}>{row.be} hd</td>
                      <td style={{padding:"8px 9px",textAlign:"right",color:row.at50>=0?"#4ade80":"#f87171"}}>{money(row.at50)}/mo</td>
                      <td style={{padding:"8px 9px",textAlign:"right",color:row.at75>=0?"#4ade80":"#f87171"}}>{money(row.at75)}/mo</td>
                      <td style={{padding:"8px 9px",textAlign:"right",color:row.atMax>=0?"#22c55e":"#f87171",fontWeight:"bold"}}>{money(row.atMax)}/mo</td>
                      <td style={{padding:"8px 9px",textAlign:"right",color:row.atMax>=0?"#c084fc":"#f87171"}}>{money(row.atMax*12)}/yr</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>

            <div style={{background:"#0c1628",border:"1px solid #1e293b",borderRadius:8,padding:"16px 18px"}}>
              <div style={{fontSize:11,color:"#22c55e",fontFamily:"monospace",fontWeight:"bold",marginBottom:4}}>
                HEAD-BY-HEAD — {numLoc} Location{numLoc!==1?"s":" ("+hub.cap+" head cap)"} · All figures MONTHLY
              </div>
              <div style={{overflowX:"auto",maxHeight:380}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"monospace",fontSize:11}}>
                  <thead><tr style={{borderBottom:"2px solid #1e293b",position:"sticky",top:0,background:"#0c1628"}}>
                    {[["Ext Heads","External heads processed this month"],
                      ["Utilization %","% of total plant capacity being used"],
                      ["Gross Rev/Mo","Monthly revenue from processing ext heads"],
                      ["Var Cost/Mo","Monthly variable processing cost"],
                      ["Plant Fixed/Mo","Monthly plant overhead — does NOT change with heads"],
                      ["Hub Net/Mo","Hub gross profit this month (rev − var cost − fixed)"],
                      ["JMC Net/Mo","Your retail shop monthly net profit"],
                      ["Combined NP/Mo","Hub + JMC retail net — monthly total"],
                      ["Annual Combined","Monthly combined × 12"],
                    ].map(([h,t])=>(
                      <th key={h} style={{padding:"6px 8px",textAlign:"right",color:"#475569",fontSize:8,textTransform:"uppercase",whiteSpace:"nowrap"}}>
                        <span {...T(t)} style={{borderBottom:"1px dashed #374151",cursor:"help"}}>{h}</span>
                      </th>
                    ))}</tr></thead>
                  <tbody>{headRows.map((h2,i)=>{
                    const hh=hubCalc(numLoc,capPerPlant,fixedPerPlant,h2,lbPerHead,rLb,rHead,varCPH);
                    const combined=jmcNP+hh.net;
                    const isCur=h2===hub.h;
                    return(
                      <tr key={i} style={{borderBottom:"1px solid #1a2740",background:isCur?"#14532d55":"transparent",borderLeft:isCur?"3px solid #4ade80":"3px solid transparent"}}>
                        <td style={{padding:"7px 8px",textAlign:"right"}}>
                          <button onClick={()=>setExtH(h2)} style={{background:isCur?"#4ade80":"#1e293b",color:isCur?"#000":"#94a3b8",border:`1px solid ${isCur?"#4ade80":"#374151"}`,borderRadius:4,padding:"2px 8px",cursor:"pointer",fontFamily:"monospace",fontSize:11}}>{h2}{isCur?" ◄":""}</button>
                        </td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:"#64748b"}}>{Math.round(hh.util*100)}%</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:"#4ade80"}}>{money(hh.gross)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:"#f87171"}}>{money(hh.varC)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:"#f87171"}}>{money(hh.fixed)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:hh.net>=0?"#22c55e":"#f87171",fontWeight:"bold"}}>{money(hh.net)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:jmcNP>=0?"#60a5fa":"#f87171"}}>{money(jmcNP)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:combined>=0?"#4ade80":"#f87171",fontWeight:"bold"}}>{money(combined)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:combined>=0?"#c084fc":"#f87171"}}>{money(combined*12)}</td>
                      </tr>
                    );
                  })}</tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB 5: WHOLESALE ══ */}
        {tab===5&&(
          <div>
            {/* Controls */}
            <div style={{background:"#1a1000",border:"1px solid #92400e",borderRadius:8,padding:"14px 20px",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10,flexWrap:"wrap"}}>
                <span style={{fontSize:11,color:"#fbbf24",fontFamily:"monospace",fontWeight:"bold"}}>⑤ WHOLESALE CHANNEL — Sell Bulk to LA Restaurants</span>
                <span {...T("WHOLESALE CHANNEL\nSell beef in bulk directly to restaurants at lower prices.\nThis is ADDITIONAL revenue on top of your retail shop.\nKey differences vs retail:\n• Lower price/lb (40–60% below retail)\n• Lower shrink (3% vs 8%) — bulk delivery, less display waste\n• Lower card fee (1% — invoiced accounts)\n• No separate fixed cost allocation")} style={{fontSize:10,color:"#f59e0b",borderBottom:"1px dashed #92400e",cursor:"help"}}>what is this?</span>
                <button onClick={()=>setWsOn(v=>!v)} style={{
                  padding:"5px 14px",borderRadius:6,cursor:"pointer",fontFamily:"monospace",fontSize:11,fontWeight:"bold",
                  border:`2px solid ${wsOn?"#f59e0b":"#374151"}`,
                  background:wsOn?"#f59e0b22":"#1e293b",
                  color:wsOn?"#fbbf24":"#475569",
                  marginLeft:"auto",
                }}>{wsOn?"✓ Channel ACTIVE":"✗ Channel OFF — click to activate"}</button>
                {!wsOn&&<span style={{fontSize:10,color:"#92400e",fontFamily:"monospace"}}>Not included in combined totals until activated</span>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:20}}>
                {S("WS Volume/Month (lb)",wsLbs,setWsLbs,0,20000,50,v=>v.toLocaleString()+"lb","#fbbf24","wsGPMo")}
                {S("WS Shrink %",wsShrink,setWsShrink,0.01,0.08,0.005,v=>Math.round(v*100)+"%","#f59e0b","WHOLESALE SHRINK %\nLower than retail (3% default vs 8%).\nBulk delivery = no display sitting out.\nLower shrink = better margins.")}
                <div style={{background:"#0c1628",border:"1px solid #92400e",borderRadius:7,padding:"10px 14px"}}>
                  <div style={{fontSize:9,color:"#fbbf24",fontFamily:"monospace",marginBottom:6}}>WHOLESALE P&L <MLABEL/></div>
                  {[
                    ["Volume",wsLbs.toLocaleString()+" lb","#e2e8f0","Total monthly lbs sold wholesale"],
                    ["Blended WS Price","$"+fmt(wsBlendP)+"/lb","#fbbf24","Average sell price across all cuts"],
                    ["Revenue/Mo",money(wsTotRev),"#4ade80","wsGPMo"],
                    ["Gross Profit/Mo",money(wsTotGP),"#60a5fa","wsGPMo"],
                    ["Gross Margin",fmt(wsBlendGM*100,1)+"%","#60a5fa","Wholesale gross margin — lower than retail but no fixed cost required"],
                  ].map(([k,v,c,tK])=>(
                    <div key={k} {...T(tK)} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",borderBottom:"1px solid #1a2740"}}>
                      <span style={{fontSize:9,color:"#475569",fontFamily:"monospace",borderBottom:"1px dashed #374151"}}>{k}</span>
                      <span style={{fontSize:10,fontWeight:"bold",color:c,fontFamily:"monospace"}}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{background:"#0c1628",border:"1px solid #1e293b",borderRadius:7,padding:"10px 14px"}}>
                  <div style={{fontSize:9,color:"#4ade80",fontFamily:"monospace",marginBottom:6}}>ALL CHANNELS — <MLABEL/> & <YLABEL/></div>
                  {[
                    ["Retail NP/mo",money(jmcNP),jmcNP>=0?"#4ade80":"#f87171","jmcNetMo","M"],
                    ["WS GP/mo",wsOn?money(wsTotGP):"(channel off)","#fbbf24","wsGPMo","M"],
                    ["Hub net/mo",phase==="Own"?money(hub.net):"—",phase==="Own"?(hub.net>=0?"#22c55e":"#f87171"):"#374151","hubNetMo","M"],
                    ["TOTAL/mo",money(totalMo),totalMo>=0?"#4ade80":"#f87171","totalMo","M"],
                    ["ANNUAL TOTAL",money(totalMo*12),totalMo>=0?"#c084fc":"#f87171","annualTotal","Y"],
                  ].map(([k,v,c,tK,badge])=>(
                    <div key={k} {...T(tK)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"2px 0",borderBottom:"1px solid #1a2740"}}>
                      <div>
                        <span style={{fontSize:9,color:"#475569",fontFamily:"monospace",borderBottom:"1px dashed #374151"}}>{k}</span>
                        {badge==="M"?<MLABEL/>:<YLABEL/>}
                      </div>
                      <span style={{fontSize:10,fontWeight:"bold",color:c,fontFamily:"monospace"}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Wholesale Price Sheet */}
            <div style={{background:"#0c1628",border:"1px solid #1e293b",borderRadius:8,padding:"16px 18px",marginBottom:14}}>
              <div style={{fontSize:11,color:"#fbbf24",fontFamily:"monospace",fontWeight:"bold",marginBottom:4}}>WHOLESALE PRICE SHEET — Set Your B2B Price Per Cut <span style={{fontSize:9,color:"#374151",fontWeight:"normal"}}>All figures MONTHLY</span></div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"monospace",fontSize:11}}>
                  <thead><tr style={{borderBottom:"2px solid #1e293b"}}>
                    {[["SKU","Product"],
                      ["USDA WS Low","usdaWS"],["USDA WS High","usdaWS"],
                      ["Your WS Price","wsPrice"],["vs USDA Mid","VS USDA WHOLESALE MIDPOINT\nNegative = you're below market (room to raise).\nPositive = you're above market (may face resistance)."],
                      ["vs Retail","vsRetail→Your WS discount vs retail price. Restaurants expect 40–60% off retail."],
                      ["WS COGS/lb","wsPrice→Your cost per lb in the wholesale channel (lower shrink than retail)"],
                      ["WS GP/lb","wsPrice→Gross profit per lb in wholesale channel"],
                      ["WS GM%","wsPrice→Wholesale gross margin %"],
                      ["WS Rev/Mo","Monthly wholesale revenue from this cut"],
                      ["WS GP/Mo","Monthly wholesale gross profit from this cut — adds to your combined total"],
                    ].map(([h,tK])=>(
                      <th key={h} style={{padding:"7px 8px",textAlign:h==="SKU"?"left":"right",color:"#475569",fontSize:9,textTransform:"uppercase",whiteSpace:"nowrap"}}>
                        <span {...T(tK)} style={{borderBottom:tK?"1px dashed #374151":"none",cursor:tK?"help":"default"}}>{h}</span>
                      </th>
                    ))}</tr></thead>
                  <tbody>{wsRows.map((s,i)=>{
                    const inRange=s.uLo!=null&&s.wsP>=s.uLo&&s.wsP<=s.uHi;
                    const c=CAT_C[s.cat]||"#64748b";
                    return(
                      <tr key={s.id} style={{borderBottom:"1px solid #1a2740",background:i%2===0?"#0c162833":"transparent"}}>
                        <td style={{padding:"7px 8px"}}>
                          <div style={{fontWeight:"bold",color:"#e2e8f0"}}>{s.label}</div>
                          <span style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:c+"22",color:c,border:`1px solid ${c}44`}}>{s.cat}</span>
                        </td>
                        <td {...T("usdaWS")} style={{padding:"7px 8px",textAlign:"right",color:"#22c55e",cursor:"help"}}>{s.uLo?"$"+fmt(s.uLo):"—"}</td>
                        <td {...T("usdaWS")} style={{padding:"7px 8px",textAlign:"right",color:"#22c55e",cursor:"help"}}>{s.uHi?"$"+fmt(s.uHi):"—"}</td>
                        <td style={{padding:"10px 16px",textAlign:"right",minWidth:230}}>
                          <div style={{display:"flex",alignItems:"center",gap:12,justifyContent:"flex-end"}}>
                            <div style={{position:"relative",width:90}}>
                              <input type="range" min={2} max={70} step={1} value={s.wsP} onChange={e=>setWP(s.id,parseFloat(e.target.value))} style={{width:"100%",accentColor:inRange?"#fbbf24":"#94a3b8"}}/>
                              {s.uLo&&<div style={{position:"absolute",top:7,height:3,borderRadius:2,background:"#22c55e55",pointerEvents:"none",left:`${(s.uLo/70)*100}%`,width:`${((s.uHi-s.uLo)/70)*100}%`}}/>}
                            </div>
                            <input type="number" value={s.wsP} step={1} min={2} max={70} onChange={e=>setWP(s.id,parseFloat(e.target.value))} style={{width:85,background:"#1a1000",color:"#fbbf24",border:`1px solid ${inRange?"#92400e":"#374151"}`,borderRadius:5,padding:"6px 10px",fontFamily:"monospace",fontSize:14,textAlign:"right"}}/>
                          </div>
                          <div style={{fontSize:8,textAlign:"right",color:inRange?"#22c55e":"#64748b",fontFamily:"monospace",marginTop:1}}>{inRange?"✓ in USDA range":s.wsP<(s.uLo||0)?"↓ below market":"↑ above market"}</div>
                        </td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:s.vsMid!=null?(Math.abs(s.vsMid)<10?"#f59e0b":s.vsMid>0?"#f87171":"#4ade80"):"#64748b",fontWeight:"bold"}}>
                          {s.vsMid!=null?(s.vsMid>0?"+":"")+fmt(s.vsMid,1)+"%":"—"}
                        </td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:"#f87171"}}>{fmt(s.vsRetail,1)}%</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:"#fb923c"}}>${fmt(s.cogsWS)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:s.gpLb>=0?"#4ade80":"#f87171",fontWeight:"bold"}}>${fmt(s.gpLb)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:s.gm>=0.25?"#4ade80":s.gm>=0.10?"#f59e0b":"#f87171"}}>{fmt(s.gm*100,1)}%</td>
                        <td style={{padding:"7px 8px",textAlign:"right"}}>${fmt(s.rev,0)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:s.gp>=0?"#60a5fa":"#f87171",fontWeight:"bold"}}>${fmt(s.gp,0)}</td>
                      </tr>
                    );
                  })}
                  <tr style={{borderTop:"2px solid #334155",background:"#1e293b44"}}>
                    <td colSpan={3} style={{padding:"9px 8px",color:"#94a3b8",fontWeight:"bold"}}>MONTHLY WS TOTALS</td>
                    <td style={{padding:"9px 8px",textAlign:"right",color:"#fbbf24",fontWeight:"bold"}}>${fmt(wsBlendP)}</td>
                    <td colSpan={3}></td>
                    <td style={{padding:"9px 8px",textAlign:"right",color:"#4ade80",fontWeight:"bold"}}>${fmt(wsTotGP/wsLbs)}</td>
                    <td style={{padding:"9px 8px",textAlign:"right",color:"#60a5fa",fontWeight:"bold"}}>{fmt(wsBlendGM*100,1)}%</td>
                    <td style={{padding:"9px 8px",textAlign:"right",fontWeight:"bold"}}>${fmt(wsTotRev,0)}/mo</td>
                    <td style={{padding:"9px 8px",textAlign:"right",color:"#60a5fa",fontWeight:"bold"}}>${fmt(wsTotGP,0)}/mo</td>
                  </tr></tbody>
                </table>
              </div>
            </div>

            {/* Restaurant Buyers */}
            <div style={{background:"#0c1628",border:"1px solid #1e293b",borderRadius:8,padding:"16px 18px"}}>
              <div style={{fontSize:11,color:"#60a5fa",fontFamily:"monospace",fontWeight:"bold",marginBottom:4}}>RESTAURANT BUYER — MAX WHOLESALE PRICE THEY CAN AFFORD
                <span {...T("maxWS")} style={{fontSize:10,color:"#60a5fa",marginLeft:8,borderBottom:"1px dashed #3b82f6",cursor:"help"}}>how is this calculated?</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                {REST_BUYERS.map((buyer,bi)=>(
                  <div key={bi} style={{background:"#070d18",border:"1px solid #1e293b",borderRadius:8,padding:"14px 16px"}}>
                    <div style={{marginBottom:10}}>
                      <div style={{fontSize:12,color:"#e2e8f0",fontWeight:"bold"}}>{buyer.name}</div>
                      <div style={{fontSize:9,color:"#475569",fontFamily:"monospace"}}>{buyer.ex}</div>
                    </div>
                    {buyer.items.map((item,ii)=>{
                      const mw=maxWS(item.menu,item.oz,item.loss,item.fc);
                      const myP=wsPrices[item.cut]||SKUS.find(s=>s.id===item.cut)?.ws||0;
                      const fits=mw>=myP, hdroom=mw-myP;
                      const sku=SKUS.find(s=>s.id===item.cut);
                      return(
                        <div key={ii} {...T("MAX WHOLESALE PRICE — "+buyer.name+"\n"+sku?.label+" ("+item.oz+"oz served)\n\nMenu price: $"+fmt(item.menu)+"\nFood cost target: "+Math.round(item.fc*100)+"% = $"+fmt(item.menu*item.fc)+" ingredient budget\nCooking loss: "+Math.round(item.loss*100)+"% → raw weight: "+fmt((item.oz/(1-item.loss))/16,2)+"lb needed\n\nMax WS price: $"+fmt(mw)+"/lb\nYour WS price: $"+fmt(myP)+"/lb\n"+(fits?"✓ Fits — $"+fmt(hdroom)+"/lb room to spare":"✗ Over budget by $"+fmt(Math.abs(hdroom))+"/lb"))}
                          style={{background:fits?"#14532d22":"#1c0a0a22",border:`1px solid ${fits?"#166534":"#7f1d1d"}`,borderRadius:6,padding:"8px 10px",marginBottom:8,cursor:"help"}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                            <div>
                              <div style={{fontSize:11,color:"#e2e8f0",fontWeight:"bold"}}>{sku?.label} {item.oz}oz</div>
                              <div style={{fontSize:9,color:"#475569"}}>Menu ${fmt(item.menu)} · FC {Math.round(item.fc*100)}% · Loss {Math.round(item.loss*100)}%</div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontSize:9,color:"#94a3b8"}}>max WS</div>
                              <div style={{fontSize:15,fontWeight:"bold",color:"#fbbf24",fontFamily:"monospace"}}>${fmt(mw)}/lb</div>
                            </div>
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between"}}>
                            <span style={{fontSize:10,color:"#64748b",fontFamily:"monospace"}}>Your WS: <span style={{color:"#fbbf24",fontWeight:"bold"}}>${fmt(myP)}</span></span>
                            <span style={{fontSize:10,fontWeight:"bold",color:fits?"#4ade80":"#f87171",fontFamily:"monospace"}}>{fits?`✓ +$${fmt(hdroom)} room`:`✗ $${fmt(Math.abs(hdroom))} over`}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB 6: CUT REFERENCE ══ */}
        {tab===6&&(
          <div>
            {/* --- Yield vs Target --- */}
            <div style={{background:"#0c1628",border:"1px solid #1e293b",borderRadius:8,padding:"16px 18px",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,flexWrap:"wrap"}}>
                <span style={{fontSize:11,color:"#c084fc",fontFamily:"monospace",fontWeight:"bold"}}>YIELD vs TARGET — At Current Volume</span>
                <span style={{fontSize:10,color:"#374151",fontFamily:"monospace"}}>
                  {Math.round(lbs/lbPerHead*10)/10} head/mo at {lbs.toLocaleString()} lbs ÷ {lbPerHead} lbs/head · Green = you have enough from cow · Red = you need more cows or less of that cut
                </span>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"monospace",fontSize:11}}>
                  <thead><tr style={{borderBottom:"2px solid #1e293b"}}>
                    {[
                      ["SKU","Your model cut"],
                      ["Target Lbs/Mo","Your monthly sales mix × total volume"],
                      ["Yield/Cow (lbs)","Natural lbs from one whole cow — your actual raw supply"],
                      ["Yield at "+Math.round(lbs/lbPerHead)+" head","Total lbs from your monthly head count (mid-range yield)"],
                      ["Over / Short","Yield at current heads minus monthly target — green=surplus, red=need more head"],
                      ["Heads Just for This","How many extra cows you'd need if this was your only cut"],
                      ["Retail Pack","How it leaves the butcher counter"],
                      ["WS Pack","How it ships wholesale"],
                      ["Fridge (retail)","Days refrigerated in butcher paper or foam tray"],
                      ["Fridge (cryovac)","Days refrigerated in vacuum seal — for wholesale orders"],
                    ].map(([h,t])=>(
                      <th key={h} style={{padding:"6px 8px",textAlign:"right",color:"#475569",fontSize:9,textTransform:"uppercase",whiteSpace:"nowrap"}}>
                        <span {...T(t)} style={{borderBottom:"1px dashed #374151",cursor:"help"}}>{h}</span>
                      </th>
                    ))}</tr></thead>
                  <tbody>
                    {skuRows.map((s,i)=>{
                      const cutId = SKU_CUT_MAP[s.id];
                      const cut = JMC_CUTS.find(c=>c.id===cutId);
                      if(!cut) return null;
                      const headsThisMonth = lbs / lbPerHead;
                      const yieldMid = (cut.yLo + cut.yHi) / 2 * headsThisMonth;
                      const target = s.spLbs;
                      const delta = yieldMid - target;
                      const headsForCut = target / ((cut.yLo + cut.yHi) / 2);
                      const isAlert = cut.id === "hanger-steak";
                      return(
                        <tr key={s.id} style={{borderBottom:"1px solid #1a2740",background:isAlert?"#1c0a0a33":i%2===0?"#0c162833":"transparent"}}>
                          <td style={{padding:"7px 8px",textAlign:"right"}}>
                            <div style={{fontWeight:"bold",color:isAlert?"#f87171":"#e2e8f0"}}>{s.label}</div>
                            {isAlert&&<div style={{fontSize:9,color:"#f87171"}}>⚠ only 1/animal</div>}
                          </td>
                          <td style={{padding:"7px 8px",textAlign:"right",color:"#c084fc"}}>{fmt(target,0)} lb</td>
                          <td style={{padding:"7px 8px",textAlign:"right"}}>
                            <span style={{color:"#64748b"}}>{cut.yLo}–{cut.yHi} lbs</span>
                            <div style={{fontSize:9,color:"#374151"}}>{cut.wholeCowQty} {cut.unit}/cow</div>
                          </td>
                          <td {...T("YIELD AT CURRENT HEADS\n"+fmt(headsThisMonth,1)+" heads × "+fmt((cut.yLo+cut.yHi)/2,1)+" avg lbs/head = "+fmt(yieldMid,0)+" lbs available")} style={{padding:"7px 8px",textAlign:"right",color:"#fbbf24",cursor:"help"}}>{fmt(yieldMid,0)} lb</td>
                          <td style={{padding:"7px 8px",textAlign:"right",color:delta>=0?"#4ade80":"#f87171",fontWeight:"bold"}}>
                            {delta>=0?"+":""}{fmt(delta,0)} lb
                            <div style={{fontSize:9,color:delta>=0?"#166534":"#7f1d1d"}}>{delta>=0?"surplus":"SHORT"}</div>
                          </td>
                          <td style={{padding:"7px 8px",textAlign:"right",color:"#64748b"}}>{fmt(headsForCut,1)} hd</td>
                          <td style={{padding:"7px 8px",textAlign:"right",fontSize:10,color:"#94a3b8",maxWidth:140}}>{cut.butcher.split("·")[0].trim()}</td>
                          <td style={{padding:"7px 8px",textAlign:"right",fontSize:10,color:"#4ade80",maxWidth:140}}>{cut.ws.split("·")[0].trim()}</td>
                          <td style={{padding:"7px 8px",textAlign:"right",color:cut.rfRef<=5?"#f59e0b":"#64748b"}}>{cut.rfRef}d</td>
                          <td style={{padding:"7px 8px",textAlign:"right",color:"#22c55e"}}>{cut.rfVac}d</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{marginTop:10,background:"#070d18",borderRadius:5,padding:"8px 12px",fontSize:9,color:"#374151",fontFamily:"monospace",lineHeight:1.8}}>
                ⚠ <b style={{color:"#f87171"}}>Hanger steak:</b> Only 1 per animal (0.75–1 lb). At {Math.round(lbs/lbPerHead)} head/mo you have ~{fmt(Math.round(lbs/lbPerHead)*0.875,0)} lbs available — but your SKU mix targets {fmt(skuRows.find(s=>s.id==="hanger")?.spLbs||0,0)} lbs. Consider reducing hanger mix % or sourcing from additional animals.
              </div>
            </div>

            {/* --- Full Cut Reference --- */}
            {PRIMALS.map(primal=>{
              const cuts = JMC_CUTS.filter(c=>c.primal===primal);
              return(
                <div key={primal} style={{background:"#0c1628",border:"1px solid #1e293b",borderRadius:8,padding:"14px 18px",marginBottom:12}}>
                  <div style={{fontSize:11,color:"#f59e0b",fontFamily:"monospace",fontWeight:"bold",marginBottom:10,borderBottom:"1px solid #1e293b",paddingBottom:6}}>
                    {primal.toUpperCase()}
                    <span style={{fontSize:9,color:"#475569",marginLeft:8,fontWeight:"normal"}}>{cuts.length} cut{cuts.length!==1?"s":""} from this primal</span>
                  </div>
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"monospace",fontSize:10}}>
                      <thead><tr style={{borderBottom:"1px solid #1e293b"}}>
                        {["Cut","Unit Weight","Yield / Whole Cow","Qty/Cow","Retail Packaging","Wholesale Packaging","Fridge Retail","Fridge Vac","Frozen","Notes"].map(h=>(
                          <th key={h} style={{padding:"5px 8px",textAlign:"left",color:"#475569",fontSize:8,textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
                        ))}</tr></thead>
                      <tbody>
                        {cuts.map((cut,i)=>(
                          <tr key={cut.id} style={{borderBottom:"1px solid #1a2740",background:i%2===0?"#0c162833":"transparent",borderLeft:cut.note?"3px solid #f87171":"3px solid transparent"}}>
                            <td style={{padding:"6px 8px",color:cut.note?"#f87171":"#e2e8f0",fontWeight:"bold",whiteSpace:"nowrap"}}>{cut.name}</td>
                            <td style={{padding:"6px 8px",color:"#64748b",whiteSpace:"nowrap"}}>{cut.unitWeight}</td>
                            <td style={{padding:"6px 8px",color:"#fbbf24",whiteSpace:"nowrap"}}>{cut.yLo}–{cut.yHi} lbs</td>
                            <td style={{padding:"6px 8px",color:"#94a3b8",whiteSpace:"nowrap"}}>{cut.wholeCowQty} {cut.unit}</td>
                            <td style={{padding:"6px 8px",color:"#60a5fa",maxWidth:180,fontSize:9}}>{cut.butcher}</td>
                            <td style={{padding:"6px 8px",color:"#4ade80",maxWidth:180,fontSize:9}}>{cut.ws}</td>
                            <td style={{padding:"6px 8px",color:cut.rfRef<=5?"#f59e0b":"#64748b",whiteSpace:"nowrap"}}>{cut.rfRef}d</td>
                            <td style={{padding:"6px 8px",color:"#22c55e",whiteSpace:"nowrap"}}>{cut.rfVac}d</td>
                            <td style={{padding:"6px 8px",color:"#475569",whiteSpace:"nowrap"}}>{cut.frVac}d</td>
                            <td style={{padding:"6px 8px",fontSize:9,color:"#f87171",maxWidth:200}}>{cut.note||""}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            <div style={{background:"#0c1628",border:"1px solid #1e293b",borderRadius:7,padding:"10px 14px",fontSize:9,color:"#475569",fontFamily:"monospace",lineHeight:1.8}}>
              <b style={{color:"#f59e0b"}}>SHELF LIFE KEY</b> · Fridge Retail = butcher paper or foam tray (open case) · Fridge Vac = cryovac/vacuum seal (wholesale ready) · Frozen = frozen in any packaging ·
              <b style={{color:"#f87171",marginLeft:4}}>Red-bordered rows have special handling requirements</b> · All shelf life in days · Source: jmc_cuts_data.js · USDA FSIS guidelines
            </div>
          </div>
        )}

        {/* ══ TAB 7: STARTUP COSTS ══ */}
        {tab===7&&(
          <div>
            {/* KPI Cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
              {[
                {label:"Total Startup Cost",val:money(suStartupCost),color:"#f59e0b",sub:"One-time launch expenses"},
                {label:"Monthly Burn",val:money(suMonthlyBurn),color:"#60a5fa",sub:"Recurring operating costs"},
                {label:"12-Month Carry",val:money(suMonthlyBurn*12),color:"#c084fc",sub:"Annual operating cost projection"},
              ].map(k=>(
                <div key={k.label} style={{background:"#0c1628",border:"1px solid #1e293b",borderRadius:10,padding:"18px 20px"}}>
                  <div style={{fontSize:9,color:"#475569",textTransform:"uppercase",fontFamily:"monospace",letterSpacing:"0.05em"}}>{k.label}</div>
                  <div style={{fontSize:24,fontWeight:"bold",color:k.color,fontFamily:"monospace",marginTop:6}}>{k.val}</div>
                  <div style={{fontSize:10,color:"#374151",marginTop:4}}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Reset Button */}
            <div style={{marginBottom:14,textAlign:"right"}}>
              <button onClick={()=>setSuData(buildStartupState())} style={{padding:"7px 16px",borderRadius:6,cursor:"pointer",fontFamily:"monospace",fontSize:11,border:"1px solid #374151",background:"#1e293b",color:"#94a3b8"}}>
                Reset All Fields
              </button>
            </div>

            {/* Section Cards */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {STARTUP_SECTIONS.map(sec=>(
                <div key={sec.key} style={{background:"#0c1628",border:`1px solid ${sec.monthly?"#1e3a5f":"#1e293b"}`,borderRadius:10,padding:"18px 20px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,borderBottom:"1px solid #1e293b",paddingBottom:10}}>
                    <div>
                      <div style={{fontSize:12,fontWeight:"bold",color:"#e2e8f0"}}>{sec.title}</div>
                      <div style={{fontSize:9,color:sec.monthly?"#60a5fa":"#475569",fontFamily:"monospace",marginTop:2}}>
                        {sec.monthly?"Monthly operating cost":"One-time startup cost"}
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:8,color:"#475569",textTransform:"uppercase",fontFamily:"monospace",letterSpacing:"0.05em"}}>Section Total</div>
                      <div style={{fontSize:16,fontWeight:"bold",color:sec.monthly?"#60a5fa":"#f59e0b",fontFamily:"monospace"}}>{money(suTotals[sec.key])}</div>
                    </div>
                  </div>
                  {sec.fields.map(([fieldKey,label])=>(
                    <div key={fieldKey} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid #1a2740"}}>
                      <label style={{fontSize:11,color:"#94a3b8",fontFamily:"monospace"}}>{label}</label>
                      <input type="number" inputMode="decimal" min="0" step="any" placeholder="0"
                        value={suData[sec.key][fieldKey]}
                        onChange={e=>updateSuField(sec.key,fieldKey,e.target.value)}
                        style={{width:110,background:"#070d18",color:"#e2e8f0",border:"1px solid #374151",borderRadius:5,padding:"5px 10px",fontFamily:"monospace",fontSize:12,textAlign:"right",outline:"none"}}/>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Notes */}
            <div style={{marginTop:16,background:"#0c1628",border:"1px solid #1e293b",borderRadius:10,padding:"16px 20px"}}>
              <div style={{fontSize:11,color:"#e2e8f0",fontWeight:"bold",marginBottom:10}}>Notes</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div style={{background:"#070d18",borderRadius:7,padding:"12px 14px",fontSize:10,color:"#64748b",fontFamily:"monospace",lineHeight:1.6}}>
                  <b style={{color:"#f59e0b"}}>Startup costs</b> are your one-time launch expenses like buildout, equipment, permits, and inventory.
                </div>
                <div style={{background:"#070d18",borderRadius:7,padding:"12px 14px",fontSize:10,color:"#64748b",fontFamily:"monospace",lineHeight:1.6}}>
                  <b style={{color:"#60a5fa"}}>Monthly burn</b> is what it costs you to keep the shop open each month before product margin is added.
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
