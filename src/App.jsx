import { useState, useMemo, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar } from "recharts";
import { TrendingUp, DollarSign, Percent, Scale, Beef, Store, Factory, Truck } from "lucide-react";

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

const COMPS_DEFAULT = [
  {store:"Cream Co./Cookbook",tier:"Premium Butcher",items:[{n:"Ribeye",p:66.00},{n:"NY Strip",p:57.38},{n:"Hanger",p:42.90},{n:"Ground",p:14.50}]},
  {store:"McCall's/Atwater",  tier:"Premium Butcher",items:[{n:"Ribeye DA",p:59.99},{n:"Ribeye",p:47.00},{n:"NY Strip",p:42.00},{n:"Filet",p:69.99},{n:"Flat Iron",p:28.99},{n:"Short Ribs",p:27.50},{n:"Ground GF",p:14.99}]},
  {store:"Sprouts/Eagle Rock", tier:"Natural Market", items:[{n:"Ribeye GF",p:27.99},{n:"NY Strip GF",p:24.99},{n:"Filet GF",p:34.99},{n:"Stew GF",p:12.99},{n:"Ground GF",p:9.49}]},
  {store:"Vons/Eagle Rock",    tier:"Mass Market",    items:[{n:"Ribeye Prime",p:38.99},{n:"NY Strip Prime",p:29.99},{n:"Ground 90/10",p:6.99}]},
  {store:"Trader Joe's/ER",    tier:"Mass Market",    items:[{n:"Ribeye Choice",p:21.99},{n:"Filet Choice",p:35.99},{n:"Ground 80/20",p:6.49}]},
];
const TIER_OPTIONS = ["Premium Butcher","Natural Market","Mass Market","Specialty","Online"];

const CAT_C = {Premium:"#b45309",Core:"#3b82f6",Traffic:"#15803d",Everyday:"var(--text-muted)"};

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
  "Foam tray":"#3b82f6","Butcher paper":"#b45309",
  "Cryovac":"#15803d","Mixed":"#7c3aed"
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
  <span style={{fontSize:9,padding:"2px 6px",borderRadius:4,marginLeft:4,background:"#dbeafe",color:"#1d4ed8",border:"1px solid #93c5fd",fontWeight:600,letterSpacing:"0.03em"}}>MONTHLY</span>
);
const YLABEL = () => (
  <span style={{fontSize:9,padding:"2px 6px",borderRadius:4,marginLeft:4,background:"#ede9fe",color:"#6d28d9",border:"1px solid #c4b5fd",fontWeight:600,letterSpacing:"0.03em"}}>ANNUAL</span>
);

export default function App(){
  // read-only investor mode via ?view=investor
  const [investorMode] = useState(()=>new URLSearchParams(window.location.search).get("view")==="investor");
  const printRef = useRef(null);

  // dark mode
  const [dark,setDark]=useState(()=>{
    const saved=localStorage.getItem("jmc-dark");
    if(saved!==null) return saved==="true";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches||false;
  });
  const [companyName,setCompanyName]=useState(()=>localStorage.getItem("jmc-company-name")||"Joseph Meat Company");
  const [companyDesc,setCompanyDesc]=useState(()=>localStorage.getItem("jmc-company-desc")||"Vertically-integrated beef operation — Nebraska-sourced, LA-retail. Premium whole-animal butcher shop with wholesale channel and owned processing hub expansion path.");
  useEffect(()=>{localStorage.setItem("jmc-company-name",companyName);},[companyName]);
  useEffect(()=>{localStorage.setItem("jmc-company-desc",companyDesc);},[companyDesc]);
  useEffect(()=>{
    document.documentElement.classList.toggle("dark",dark);
    localStorage.setItem("jmc-dark",dark);
  },[dark]);

  // startup calculator
  const [suData,setSuData]=useState(buildStartupState);
  const updateSuField=(secKey,fieldKey,value)=>setSuData(p=>({...p,[secKey]:{...p[secKey],[fieldKey]:value}}));
  const suTotals=useMemo(()=>{const t={};STARTUP_SECTIONS.forEach(sec=>{t[sec.key]=sec.fields.reduce((s,[k])=>s+parseAmt(suData[sec.key][k]),0);});return t;},[suData]);
  const suStartupCost=useMemo(()=>STARTUP_SECTIONS.filter(s=>!s.monthly).reduce((s,sec)=>s+suTotals[sec.key],0),[suTotals]);
  const suMonthlyBurn=useMemo(()=>STARTUP_SECTIONS.filter(s=>s.monthly).reduce((s,sec)=>s+suTotals[sec.key],0),[suTotals]);

  // tooltip — global mousemove approach so it never sticks
  const [tip, setTip] = useState({show:false,text:"",x:0,y:0});
  const [tipsOn, setTipsOn] = useState(!investorMode);
  const T = (text) => tipsOn ? {
    "data-tip": text,
    style:{cursor:"help"},
  } : {style:{cursor:"default"}};

  useEffect(()=>{
    if(!tipsOn) return;
    const onMove=(e)=>{
      const el=e.target.closest("[data-tip]");
      if(el){
        const key=el.getAttribute("data-tip");
        setTip({show:true,text:TIPS[key]||key,x:e.clientX,y:e.clientY});
      } else {
        setTip(t=>t.show?{...t,show:false}:t);
      }
    };
    const dismiss=()=>setTip(t=>t.show?{...t,show:false}:t);
    window.addEventListener("mousemove",onMove,true);
    window.addEventListener("scroll",dismiss,true);
    window.addEventListener("click",dismiss,true);
    return ()=>{window.removeEventListener("mousemove",onMove,true);window.removeEventListener("scroll",dismiss,true);window.removeEventListener("click",dismiss,true);};
  },[tipsOn]);

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

  // competitors
  const [compData,setCompData]=useState(()=>COMPS_DEFAULT.map(s=>({...s,items:s.items.map(it=>({...it}))})));
  const updateComp=(si,field,val)=>setCompData(d=>d.map((s,i)=>i===si?{...s,[field]:val}:s));
  const updateCompItem=(si,ii,field,val)=>setCompData(d=>d.map((s,i)=>i===si?{...s,items:s.items.map((it,j)=>j===ii?{...it,[field]:field==="p"?parseFloat(val)||0:val}:it)}:s));
  const addCompItem=(si)=>setCompData(d=>d.map((s,i)=>i===si?{...s,items:[...s.items,{n:"New Cut",p:0}]}:s));
  const removeCompItem=(si,ii)=>setCompData(d=>d.map((s,i)=>i===si?{...s,items:s.items.filter((_,j)=>j!==ii)}:s));
  const addCompStore=()=>setCompData(d=>[...d,{store:"New Store",tier:"Mass Market",items:[{n:"Cut",p:0}]}]);
  const removeCompStore=(si)=>setCompData(d=>d.filter((_,i)=>i!==si));

  // compute average comp price per SKU label from editable comp data
  const compAvg=useMemo(()=>{
    const map={};
    const SKU_MATCH={"Ribeye":["ribeye"],"NY Strip":["nystrip"],"Filet":["filet"],"Flat Iron":["flatIron"],"Hanger":["hanger"],"Skirt":["skirt"],"Ground":["ground"],"Stew":["stew"],"Brisket":["brisket"],"Short Ribs":["shortRibs"],"Roasts":["roasts"],"T-Bone":["tbone"]};
    Object.keys(SKU_MATCH).forEach(label=>{
      const prices=[];
      compData.forEach(store=>{
        store.items.forEach(item=>{
          if(item.n.toLowerCase().includes(label.toLowerCase()) && item.p>0) prices.push(item.p);
        });
      });
      if(prices.length>0){
        const avg=prices.reduce((s,v)=>s+v,0)/prices.length;
        SKU_MATCH[label].forEach(id=>{map[id]=avg;});
      }
    });
    return map;
  },[compData]);

  const freight = (tripCost*trips)/lbs;
  const cardFee = 0.02;

  const skuRows = useMemo(()=>SKUS.map(s=>{
    const fa=farmBase+(s.farm-6.54), pc=phase==="3P"?s.p3:s.pO;
    const spLbs=lbs*s.mix, cogs=(fa+pc+freight)*(1+shrink), sp=prices[s.id];
    const gpLb=sp-cogs;
    const compP=compAvg[s.id]||s.comp;
    return{...s,fa,pc,spLbs,cogs,gpLb,gm:gpLb/sp,rev:spLbs*sp,gpDol:spLbs*gpLb,compDelta:sp-compP,compP};
  }),[prices,lbs,farmBase,phase,freight,shrink,compAvg]);

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

  // brighten dark accent colors in dark mode
  const dc=(c)=>{
    if(!dark) return c;
    const map={"#0369a1":"#38bdf8","#c2410c":"#fb923c","#ea580c":"#fb923c","#ef4444":"#f87171","#dc2626":"#f87171","#15803d":"#4ade80","#16a34a":"#4ade80","#92400e":"#fbbf24","#9333ea":"#c084fc","#2563eb":"#60a5fa","#d97706":"#fbbf24","#b45309":"#f59e0b"};
    return map[c]||c;
  };

  const S=(l,v,setV,min,max,step2,fmt2,c,tipKey)=>(
    <div key={l} style={{flex:1,minWidth:130,padding:"2px 4px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span {...(tipKey?T(tipKey):{})} style={{fontSize:10,color:"var(--text-sec)",textTransform:"uppercase",
          borderBottom:tipKey?"1px dashed var(--border-dashed)":"none",cursor:tipKey?"help":"default"}}>{l}</span>
        <span style={{fontSize:11,fontWeight:"bold",color:dc(c)}}>{fmt2(v)}</span>
      </div>
      <input type="range" min={min} max={max} step={step2} value={v}
        onChange={e=>setV(parseFloat(e.target.value))} style={{width:"100%",accentColor:dc(c),height:6}}/>
    </div>
  );

  const KPI=({label,val,sub,color,border,tipKey,badge})=>(
    <div {...T(tipKey)} style={{background:"var(--bg-card)",border:`1px solid ${border||"var(--border)"}`,borderRadius:7,padding:"10px 12px"}}>
      <div style={{display:"flex",alignItems:"center",gap:3,marginBottom:4,flexWrap:"wrap"}}>
        <span style={{fontSize:10,color:"var(--text-sec)",textTransform:"uppercase",letterSpacing:"0.05em",borderBottom:"1px dashed var(--border-dashed)"}}>{label}</span>
        {badge==="M"&&<MLABEL/>}{badge==="Y"&&<YLABEL/>}
      </div>
      <div style={{fontSize:18,fontWeight:"bold",color}}>{val}</div>
      {sub&&<div style={{fontSize:10,color:"var(--text-sec)",marginTop:3}}>{sub}</div>}
    </div>
  );

  return(
    <div style={{background:"var(--bg)",minHeight:"100vh",color:"var(--text)",fontFamily:"'Inter',sans-serif",fontVariantNumeric:"tabular-nums",position:"relative"}}>

      {/* FLOATING TOOLTIP */}
      {tipsOn&&tip.show&&tip.text&&(
        <div className="floating-tip" style={{left:Math.min(tip.x+12,window.innerWidth-260),top:Math.max(tip.y-6,8),
          transition:"opacity 0.15s ease",opacity:tip.show?1:0}}>
          {tip.text.split("\n").map((line,i)=>(
            <div key={i} style={{color:i===0?"#fbbf24":"#94a3b8",fontWeight:i===0?"bold":"normal",marginBottom:i===0?4:0,fontSize:i===0?11:9}}>{line}</div>
          ))}
        </div>
      )}

      {/* MOBILE NOTICE */}
      <div className="mobile-notice" style={{display:"none",background:"#fef3c7",color:"#92400e",padding:"12px 22px",textAlign:"center",fontSize:12,fontWeight:"bold",borderBottom:"1px solid #fbbf24"}}>
        Best viewed on desktop — rotate your device or open on a computer for the full experience.
      </div>

      {/* HEADER */}
      <div className="border-b px-6 py-3" style={{background:"var(--bg-card)",borderColor:"var(--border)"}}>
        <div className="max-w-[1300px] mx-auto flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-base font-bold text-black shrink-0 shadow-lg shadow-brand-500/20" style={{fontFamily:"Georgia,serif"}}>J</div>
            <div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 tracking-[0.18em] uppercase font-mono">
                {companyName} · Financial Model v10
              </div>
              <div className="text-base font-bold flex items-center gap-3 flex-wrap" style={{color:"var(--text)"}}>
                JMC Full Model
                {investorMode&&<span className="badge bg-brand-400/10 text-brand-400 border border-brand-400/20">INVESTOR VIEW</span>}
                {!investorMode&&tipsOn&&<span className="text-[10px] text-emerald-400 italic font-normal">
                  Hover <span className="border-b border-dashed border-emerald-400">dashed labels</span> for explanations · <MLABEL/> = monthly · <YLABEL/> = annual
                </span>}
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <button onClick={()=>setDark(d=>!d)} className="btn-ghost flex items-center gap-1.5" title={dark?"Switch to light mode":"Switch to dark mode"}>
              {dark?"☀ Light":"◑ Dark"}
            </button>
            <button onClick={()=>window.print()} className="btn-ghost flex items-center gap-1.5">
              Export PDF
            </button>
            {!investorMode&&<button onClick={()=>{navigator.clipboard.writeText(window.location.origin+"?view=investor");alert("Investor link copied to clipboard!");}} className="btn flex items-center gap-1.5 bg-violet-500/10 text-violet-400 border-violet-600 hover:bg-violet-500/20">
              Copy Investor Link
            </button>}
            {!investorMode&&<button onClick={()=>{setTipsOn(v=>!v);setTip(t=>({...t,show:false}));}} className={tipsOn?"btn-success flex items-center gap-1.5":"btn-ghost flex items-center gap-1.5"}>
              {tipsOn?"Hints ON":"Hints OFF"}
            </button>}
            {!investorMode&&["3P","Own"].map(p=>(
              <button key={p} onClick={()=>setPhase(p)} className={phase===p?"phase-active border-brand-500 bg-brand-500/10 text-brand-400 shadow-brand-500/10":"phase-btn border-surface-border bg-surface-raised text-slate-500 dark:text-slate-400 hover:text-stone-700 dark:text-slate-200 hover:border-surface-border-light"}>
                {p==="3P"?"Phase 1 · 3rd-Party":"Phase 2 · Owned Plant"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RETAIL SLIDERS */}
      <div style={{background:"var(--bg-card)",borderBottom:"1px solid var(--border-light)",padding:"10px 22px",display:investorMode?"none":undefined}}>
        <div style={{maxWidth:1300,margin:"0 auto",display:"flex",gap:16,flexWrap:"wrap",alignItems:"flex-end"}}>
          {S("Retail Lbs/Month",lbs,setLbs,500,12000,250,v=>v.toLocaleString()+"lb","#9333ea","retailRevMo")}
          {S("Trip Cost $",tripCost,setTripCost,1000,5000,200,v=>"$"+v.toLocaleString(),"#0369a1","trans")}
          {S("Trips/Month",trips,setTrips,1,4,1,v=>v+"×","#0369a1","trans")}
          {S("Shrink %",shrink,setShrink,0.03,0.15,0.01,v=>Math.round(v*100)+"%","#c2410c","cogs")}
          {S("Farm Base/lb",farmBase,setFarmBase,4.5,9.0,0.10,v=>"$"+fmt(v),"#ef4444","farm")}
          {S("LA Fixed/Month $",fixed,setFixed,15000,40000,1000,v=>"$"+v.toLocaleString(),"#dc2626","jmcNetMo")}
          <div {...T("trans")} style={{background:"var(--bg)",borderRadius:5,padding:"5px 10px",fontSize:10,color:"var(--text-muted)",border:"1px solid var(--border)",flexShrink:0}}>
            <div>Freight: <b style={{color:dc("#0369a1")}}>${fmt(freight)}/lb</b></div>
            <div style={{fontSize:10}}>${(tripCost*trips).toLocaleString()}/mo ÷ {lbs.toLocaleString()}lb</div>
          </div>
        </div>
      </div>

      {/* HUB CONTROLS */}
      {!investorMode&&phase==="Own"&&(
        <div style={{background:dark?"var(--bg-surface)":"#f0fdf4",borderBottom:`1px solid ${dark?"var(--border)":"#86efac"}`,padding:"12px 22px"}}>
          <div style={{maxWidth:1300,margin:"0 auto"}}>
            <div style={{fontSize:10,color:dc("#15803d"),fontWeight:"bold",marginBottom:10}}>⚙ PHASE 2 — OWNED PROCESSING HUB CONTROLS
              <span {...T("hubFixed")} style={{fontSize:10,color:dc("#16a34a"),marginLeft:10,borderBottom:`1px dashed ${dark?"var(--border-dashed)":"#86efac"}`,cursor:"help"}}>Fixed costs = locations you OWN, not heads processed</span>
            </div>
            <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"flex-end"}}>

              {/* Locations — prominent */}
              <div style={{background:dark?"var(--bg-card)":"#ffffff",border:`2px solid ${dc("#15803d")}`,borderRadius:10,padding:"12px 16px",minWidth:155,flexShrink:0}}>
                <div {...T("hubFixed")} style={{fontSize:10,color:dc("#15803d"),textTransform:"uppercase",marginBottom:4,borderBottom:`1px dashed ${dark?"var(--border-dashed)":"#86efac"}`,cursor:"help"}}>Owned Locations</div>
                <div style={{fontSize:32,fontWeight:"bold",color:dc("#16a34a"),textAlign:"center"}}>{numLoc}</div>
                <input type="range" min={1} max={20} step={1} value={numLoc}
                  onChange={e=>{const v=parseInt(e.target.value);setNumLoc(v);if(extH>v*capPerPlant)setExtH(v*capPerPlant);}}
                  style={{width:"100%",accentColor:"#15803d",marginTop:6}}/>
                <div style={{marginTop:6,fontSize:10,color:"var(--text-muted)",lineHeight:1.8}}>
                  <div>Capacity: <b style={{color:dc("#16a34a")}}>{hub.cap} hd/mo</b></div>
                  <div>Fixed: <b style={{color:dc("#dc2626")}}>${(numLoc*fixedPerPlant).toLocaleString()}/mo</b></div>
                </div>
              </div>

              {S("Cap/Plant (hd)",capPerPlant,setCapPerPlant,10,300,5,v=>v+" hd","#7c3aed","hubBE")}
              {S("Fixed/Plant/Mo",fixedPerPlant,setFixedPerPlant,8000,50000,1000,v=>"$"+v.toLocaleString(),"#7c3aed","hubFixed")}

              <div style={{flex:1,minWidth:130,padding:"2px 4px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span {...T("netPerHead")} style={{fontSize:10,color:"var(--text-sec)",textTransform:"uppercase",borderBottom:"1px dashed var(--border-dashed)",cursor:"help"}}>Ext Heads/Mo</span>
                  <span style={{fontSize:11,fontWeight:"bold",color:dc("#16a34a")}}>{hub.h} / {hub.cap}</span>
                </div>
                <input type="range" min={0} max={Math.max(hub.cap,1)} step={1} value={extH}
                  onChange={e=>setExtH(parseInt(e.target.value))} style={{width:"100%",accentColor:dc("#16a34a"),height:6}}/>
                <div style={{height:4,background:"var(--border)",borderRadius:3,overflow:"hidden",marginTop:3}}>
                  <div style={{height:"100%",width:`${hub.util*100}%`,background:hub.util>0.7?dc("#16a34a"):dc("#b45309"),borderRadius:3}}/>
                </div>
                <div {...T("hubBE")} style={{fontSize:10,color:"var(--text-sec)",marginTop:2,cursor:"help",whiteSpace:"nowrap"}}>{Math.round(hub.util*100)}% util · BE: {Math.ceil(hub.be)} hd</div>
              </div>

              {S("Rate $/lb retail",rLb,setRLb,0.5,3.0,0.05,v=>"$"+fmt(v),"#d97706","netPerHead")}
              {S("Rate $/head",rHead,setRHead,50,600,10,v=>"$"+v,"#d97706","netPerHead")}
              {S("Retail Lbs/Head",lbPerHead,setLbPerHead,300,700,5,v=>v+"lb","#34d399","netPerHead")}
              {S("Var Cost/Head",varCPH,setVarCPH,20,200,2.5,v=>"$"+fmt(v),"#c2410c","netPerHead")}

              {/* Hub snapshot */}
              <div style={{background:"var(--bg-card)",border:`1px solid ${dark?"var(--border)":"#86efac"}`,borderRadius:8,padding:"8px 12px",minWidth:165,flexShrink:0}}>
                <div style={{fontSize:10,color:dc("#16a34a"),marginBottom:5}}>HUB P&L — MONTHLY</div>
                {[
                  ["Gross ext rev",money(hub.gross),dc("#16a34a"),"MONTHLY GROSS EXTERNAL REVENUE\nHeads × ($1.00/lb × 491 lbs + $200) per head"],
                  ["Variable cost","-"+money(hub.varC),dc("#dc2626"),"Monthly variable cost to process external heads"],
                  ["Plant fixed","-"+money(hub.fixed),dc("#dc2626"),"hubFixed"],
                  ["Hub net / mo",money(hub.net),hub.net>=0?dc("#15803d"):dc("#dc2626"),"hubNetMo"],
                ].map(([k,v,c,tipK])=>(
                  <div key={k} {...T(tipK)} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",borderBottom:"1px solid var(--border-light)"}}>
                    <span style={{fontSize:10,color:"var(--text-sec)",borderBottom:"1px dashed var(--border-dashed)"}}>{k}</span>
                    <span style={{fontSize:10,fontWeight:"bold",color:c}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI BAR */}
      <div className="border-b px-6 py-3" style={{background:"var(--bg-alt)",borderColor:"var(--border-light)"}}>
        <div className="max-w-[1300px] mx-auto">
          {/* Monthly */}
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
            <MLABEL/>
            <span style={{fontSize:9,color:"var(--text-label)",letterSpacing:"0.1em",textTransform:"uppercase"}}>Monthly</span>
          </div>
          <div className="grid grid-cols-5 gap-2 mb-3">
            <KPI label="Revenue" val={money(totRev)} sub={"$"+fmt(blendP)+"/lb · "+lbs.toLocaleString()+"lb"} color={dc("#16a34a")} tipKey="retailRevMo"/>
            <KPI label="Gross Profit" val={money(totGP)} sub={fmt(blendGM*100,1)+"% GM — before fixed costs"} color={dc("#2563eb")} tipKey="grossProfitMo"/>
            <KPI label="JMC Net Profit" val={money(jmcNP)} sub="After $22K fixed + 2% fees" color={jmcNP>=0?dc("#16a34a"):dc("#dc2626")} border={jmcNP>=0?"#86efac":"#fca5a5"} tipKey="jmcNetMo"/>
            {phase==="Own"&&<KPI label="Hub Net" val={money(hub.net)} sub={hub.h+" ext heads · "+Math.round(hub.util*100)+"% util"} color={hub.net>=0?dc("#15803d"):dc("#dc2626")} border={hub.net>=0?"#86efac":"#fca5a5"} tipKey="hubNetMo"/>}
            <KPI label="Wholesale GP"
              val={wsOn?money(wsTotGP):"OFF"}
              sub={wsOn?"$"+fmt(wsBlendP)+"/lb · "+wsLbs.toLocaleString()+"lb":"Enable in ⑤ Wholesale tab"}
              color={wsOn?dc("#d97706"):"var(--text-label)"} border={wsOn?"#fbbf24":"var(--border)"} tipKey="wsGPMo"/>
            <KPI label="Total All Channels" val={money(totalMo)} sub={wsOn?"Retail NP + WS GP + Hub":"Retail NP + Hub (WS off)"} color={totalMo>=0?dc("#16a34a"):dc("#dc2626")} border={totalMo>=0?"#86efac":"#fca5a5"} tipKey="totalMo"/>
          </div>
          {/* Annual */}
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
            <YLABEL/>
            <span style={{fontSize:9,color:"var(--text-label)",letterSpacing:"0.1em",textTransform:"uppercase"}}>Annual (projected)</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            <KPI label="Revenue" val={money(totRev*12)} sub={lbs.toLocaleString()+"lb/mo × 12"} color={dc("#16a34a")} tipKey="annualTotal"/>
            <KPI label="Gross Profit" val={money(totGP*12)} sub={fmt(blendGM*100,1)+"% GM"} color={dc("#2563eb")} tipKey="annualTotal"/>
            <KPI label="JMC Net Profit" val={money(jmcNP*12)} sub="After all fixed costs" color={jmcNP>=0?dc("#9333ea"):dc("#dc2626")} tipKey="annualTotal"/>
            <KPI label="Wholesale GP" val={wsOn?money(wsTotGP*12):"OFF"} sub={wsOn?"Annual WS channel":"Not active"} color={wsOn?dc("#d97706"):"var(--text-label)"} tipKey="annualTotal"/>
            <KPI label="Total All Channels" val={money(totalMo*12)} sub="Current run rate × 12" color={totalMo>=0?dc("#9333ea"):dc("#dc2626")} border={totalMo>=0?"#c4b5fd":"#fca5a5"} tipKey="annualTotal"/>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="border-b" style={{background:"var(--bg-card)",borderColor:"var(--border)"}}>
        <div className="max-w-[1300px] mx-auto flex gap-1 px-4 py-2">
          {TABS.map((t,i)=>(
            <button key={i} onClick={()=>setTab(i)} className={tab===i?"tab-active":"tab"}>{t}</button>
          ))}
        </div>
      </div>

      <div ref={printRef} style={{maxWidth:1300,margin:"0 auto",padding:"16px 22px"}}>

        {/* ══ TAB 0: EXECUTIVE SUMMARY ══ */}
        {tab===0&&(
          <div>
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl mb-4" style={{background:dark?"linear-gradient(135deg, #0f1624 0%, #1a2540 50%, #0f1624 100%)":"linear-gradient(135deg, #1a1207 0%, #3d2a0a 50%, #1a1207 100%)",border:"1px solid "+(dark?"#2a3555":"#5a4420")}}>
              <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse at 70% 20%, "+(dark?"rgba(180,83,9,0.12)":"rgba(255,200,100,0.08)")+" 0%, transparent 60%)"}}/>
              <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse at 20% 80%, "+(dark?"rgba(147,51,234,0.08)":"rgba(180,140,60,0.06)")+" 0%, transparent 50%)"}}/>
              <div className="relative px-10 py-10">
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/30">
                        <Beef size={20} className="text-white"/>
                      </div>
                      <div className="h-px flex-1 max-w-[80px]" style={{background:dark?"linear-gradient(to right, #b45309, transparent)":"linear-gradient(to right, #c8962a, transparent)"}}/>
                    </div>
                    <input type="text" value={companyName} onChange={e=>setCompanyName(e.target.value)}
                      className="text-3xl font-bold mb-3 font-sans w-full rounded px-1 -ml-1 transition-colors"
                      style={{color:"#ffffff",background:"transparent",border:"none",outline:"none",letterSpacing:"-0.02em"}}/>
                    <textarea value={companyDesc} onChange={e=>setCompanyDesc(e.target.value)} rows={2}
                      className="text-sm max-w-2xl w-full leading-relaxed resize-none rounded px-1 -ml-1 transition-colors"
                      style={{color:"rgba(255,255,255,0.6)",background:"transparent",border:"none",outline:"none"}}/>
                    <div className="flex items-center gap-3 mt-5">
                      {[
                        phase==="3P"?"3rd-Party Processing":"Owned Processing",
                        lbs.toLocaleString()+" lbs/mo",
                        wsOn?"Wholesale Active":"Retail Only",
                      ].map(tag=>(
                        <span key={tag} style={{fontSize:9,padding:"3px 10px",borderRadius:20,border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.5)",letterSpacing:"0.05em"}}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="hidden lg:flex flex-col items-end gap-2 pt-2">
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.15em"}}>Financial Model v10</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                {label:"Annual Revenue (Projected)",val:money(totRev*12),sub:lbs.toLocaleString()+" lbs/mo retail",color:"#16a34a",Icon:DollarSign,glow:"glow-green"},
                {label:"Annual Net Profit",val:money(totalMo*12),sub:(totalMo>=0?"Profitable":"Pre-profit")+" at current volume",color:totalMo>=0?"#9333ea":"#dc2626",Icon:TrendingUp,glow:totalMo>=0?"glow-purple":""},
                {label:"Gross Margin",val:fmt(blendGM*100,1)+"%",sub:"Blended across all SKUs",color:blendGM>=0.5?"#16a34a":"#b45309",Icon:Percent,glow:blendGM>=0.5?"glow-green":"glow-amber"},
                {label:"Break-Even Volume",val:fmt(beVol,0)+" lbs/mo",sub:beVol<=lbs?"Above break-even":"Below — need "+fmt(beVol-lbs,0)+" more lbs",color:beVol<=lbs?"#16a34a":"#dc2626",Icon:Scale,glow:beVol<=lbs?"glow-green":""},
              ].map(k=>(
                <div key={k.label} className={`kpi-card ${k.glow}`}>
                  <k.Icon size={20} className="absolute top-4 right-4 opacity-15" style={{color:k.color}}/>
                  <div className="text-[10px] text-stone-500 dark:text-slate-400 uppercase tracking-wider font-semibold mb-2">{k.label}</div>
                  <div className="text-2xl font-bold" style={{color:k.color}}>{k.val}</div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 mt-2">{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Two Column: Unit Economics + Revenue Channels */}
            <div className="grid grid-cols-2 gap-3.5 mb-4">
              {/* Unit Economics */}
              <div className="card p-5">
                <div className="section-header">UNIT ECONOMICS (per lb)</div>
                {[
                  ["Blended Sell Price","$"+fmt(blendP),"#16a34a"],
                  ["All-In COGS","$"+fmt(blendC),"#ea580c"],
                  ["Gross Profit / lb","$"+fmt(totGP/lbs),"#2563eb"],
                  ["Processing ("+( phase==="3P"?"3rd-Party":"Owned")+")","$"+fmt(phase==="3P"?cogs3P-cogsOwn+SKUS.reduce((s,sk)=>s+sk.mix*sk.pO,0):SKUS.reduce((s,sk)=>s+sk.mix*sk.pO,0)),"#9333ea"],
                  ["Freight / lb","$"+fmt(freight),"#0369a1"],
                ].map(([k,v,c])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid var(--border-light)"}}>
                    <span style={{fontSize:11,color:"var(--text-sec)"}}>{k}</span>
                    <span style={{fontSize:12,fontWeight:"bold",color:dc(c)}}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Revenue Channels */}
              <div className="card p-5">
                <div className="section-header">REVENUE CHANNELS (Monthly)</div>
                {[
                  {k:"Retail Shop ("+lbs.toLocaleString()+" lbs/mo)",v:money(jmcNP),c:jmcNP>=0?"#16a34a":"#dc2626",s:"Net after $"+fmt(fixed,0)+" fixed",Icon:Store},
                  {k:"Wholesale "+(wsOn?"ACTIVE":"OFF"),v:wsOn?money(wsTotGP):"—",c:wsOn?"#d97706":"var(--text-label)",s:wsOn?wsLbs.toLocaleString()+" lbs/mo":"Not yet activated",Icon:Truck},
                  {k:"Processing Hub "+(phase==="Own"?"ACTIVE":"PLANNED"),v:phase==="Own"?money(hub.net):"—",c:phase==="Own"?(hub.net>=0?"#15803d":"#dc2626"):"var(--text-label)",s:phase==="Own"?hub.h+" heads/mo, "+Math.round(hub.util*100)+"% util":"Phase 2 — owned plant",Icon:Factory},
                  {k:"div",v:"",c:"",s:""},
                  {k:"TOTAL Monthly",v:money(totalMo),c:totalMo>=0?"#16a34a":"#dc2626",s:"All active channels",Icon:DollarSign},
                  {k:"TOTAL Annual",v:money(totalMo*12),c:totalMo>=0?"#9333ea":"#dc2626",s:"Projected run rate",Icon:TrendingUp},
                ].map((row)=>row.k==="div"?(
                  <div key="div" style={{borderBottom:"1px solid var(--border)",margin:"4px 0"}}/>
                ):(
                  <div key={row.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid var(--border-light)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      {row.Icon&&<row.Icon size={14} style={{color:row.c,opacity:0.6,flexShrink:0}}/>}
                      <div>
                        <span style={{fontSize:11,color:row.k.startsWith("TOTAL")?"var(--text)":"var(--text-sec)",fontWeight:row.k.startsWith("TOTAL")?"bold":"normal"}}>{row.k}</span>
                        {row.s&&<div style={{fontSize:10,color:"var(--text-label)"}}>{row.s}</div>}
                      </div>
                    </div>
                    <span style={{fontSize:row.k.startsWith("TOTAL")?14:12,fontWeight:"bold",color:row.c}}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase Comparison */}
            <div className="card p-5 mb-4">
              <div className="section-header">PHASE COMPARISON — Processing Cost Impact</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
                {[
                  {label:"Phase 1: 3rd-Party",desc:"Midwest Meat Co., Minden NE",cogsVal:cogs3P,color:"#b45309"},
                  {label:"Phase 2: Owned Plant",desc:"MBMC plant, labor only",cogsVal:cogsOwn,color:"#15803d"},
                  {label:"Savings per lb",desc:"Processing cost reduction",cogsVal:cogs3P-cogsOwn,color:"#9333ea"},
                ].map(p=>{
                  const annualSavings=p.label.includes("Savings")?(cogs3P-cogsOwn)*lbs*12:null;
                  return(
                    <div key={p.label} style={{background:"var(--bg)",borderRadius:8,padding:"16px",border:"1px solid var(--border)"}}>
                      <div style={{fontSize:10,color:p.color,fontWeight:"bold",marginBottom:4}}>{p.label}</div>
                      <div style={{fontSize:10,color:"var(--text-label)",marginBottom:8}}>{p.desc}</div>
                      <div style={{fontSize:22,fontWeight:"bold",color:p.color}}>${fmt(p.cogsVal)}/lb</div>
                      {annualSavings!=null&&<div style={{fontSize:10,color:"#16a34a",marginTop:6}}>{money(annualSavings)}/yr savings at current volume</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Charts Row: SKU Profit Bar + Revenue Mix Pie */}
            <div className="grid gap-3.5 mb-4" style={{gridTemplateColumns:"2fr 1fr"}}>
              {/* SKU Gross Profit Bar Chart */}
              <div className="card p-5">
                <div className="section-header">SKU GROSS PROFIT (Monthly)</div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={[...skuRows].sort((a,b)=>b.gpDol-a.gpDol)} margin={{top:5,right:10,left:10,bottom:5}}>
                    <XAxis dataKey="label" tick={{fontSize:10,fill:"var(--text-muted)"}} angle={-35} textAnchor="end" height={60} axisLine={{stroke:"var(--border)"}} tickLine={false}/>
                    <YAxis tick={{fontSize:10,fill:"var(--text-muted)"}} axisLine={{stroke:"var(--border)"}} tickLine={false} tickFormatter={v=>"$"+v.toLocaleString()}/>
                    <RTooltip contentStyle={{background:"var(--bg-surface)",border:"1px solid var(--border-accent)",borderRadius:8,fontSize:11}} formatter={(v)=>["$"+v.toLocaleString(),"Gross Profit"]} labelStyle={{color:"#b45309",fontWeight:"bold"}}/>
                    <Bar dataKey="gpDol" radius={[4,4,0,0]}>
                      {[...skuRows].sort((a,b)=>b.gpDol-a.gpDol).map((s,i)=>(
                        <Cell key={s.id} fill={CAT_C[s.cat]||"#555555"}/>
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Mix Pie Chart */}
              <div className="card p-5">
                <div className="section-header">REVENUE MIX</div>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={[
                        {name:"Retail",value:Math.max(0,jmcNP)},
                        ...(wsOn?[{name:"Wholesale",value:Math.max(0,wsTotGP)}]:[]),
                        ...(phase==="Own"?[{name:"Processing Hub",value:Math.max(0,hub.net)}]:[]),
                      ].filter(d=>d.value>0)}
                      cx="50%" cy="45%" innerRadius={50} outerRadius={80} paddingAngle={3}
                      dataKey="value"
                    >
                      {[{c:"#16a34a"},{c:"#d97706"},{c:"#9333ea"}].map((e,i)=>(
                        <Cell key={i} fill={e.c} stroke="none"/>
                      ))}
                    </Pie>
                    <RTooltip contentStyle={{background:"var(--bg-surface)",border:"1px solid var(--border-accent)",borderRadius:8,fontSize:11}} formatter={(v)=>"$"+v.toLocaleString()}/>
                    <Legend iconType="circle" wrapperStyle={{fontSize:10,color:"var(--text-sec)"}}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Competitive Position */}
            <div className="card p-5">
              <div className="section-header">COMPETITIVE POSITIONING — LA Market</div>
              <div style={{fontSize:11,color:"var(--text-sec)",lineHeight:1.7}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
                  <div>
                    <div style={{color:"#b45309",fontWeight:"bold",marginBottom:6}}>Sourcing Advantage</div>
                    <div style={{fontSize:10,color:"var(--text-muted)"}}>Direct Nebraska ranch partnerships. No middleman markup. Full traceability from pasture to counter.</div>
                  </div>
                  <div>
                    <div style={{color:"#b45309",fontWeight:"bold",marginBottom:6}}>Price Position</div>
                    <div style={{fontSize:10,color:"var(--text-muted)"}}>Premium tier pricing — positioned between mass-market (Vons, TJ's) and ultra-premium (Cream Co., McCall's). Avg {skuRows.filter(s=>s.compDelta<0).length}/{skuRows.length} SKUs priced below comparable competitors.</div>
                  </div>
                  <div>
                    <div style={{color:"#b45309",fontWeight:"bold",marginBottom:6}}>Growth Path</div>
                    <div style={{fontSize:10,color:"var(--text-muted)"}}>Phase 1: Retail + Wholesale. Phase 2: Owned processing hub — $1.29/lb cost reduction, external rancher revenue, vertical integration moat.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB 1: SKU P&L ══ */}
        {tab===1&&(
          <div>
            <div className="card px-4 py-2.5 mb-3 text-[10px] text-stone-500 dark:text-slate-400">
              All SKU figures are <MLABEL/> — multiply by 12 for annual. Hover column headers for explanations. Adjust retail prices with sliders.
            </div>
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-[11px]" style={{borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{borderBottom:"2px solid var(--border)"}}>
                    {[["SKU","Product name"],["Cat","Category type"],["Mix%","% of monthly volume"],["Lbs/Mo","Lbs sold per month — monthly"],
                      ["Retail Price","Your sell price per lb — adjust with slider + number"],
                      ["vs Comp","vsComp"],["Farm","farm"],["Proc","proc"],["Trans","trans"],["COGS","cogs"],
                      ["GP/lb","gpLb"],["GM%","gm"],
                      ["Revenue/Mo","Monthly sales from this SKU"],["GP/Mo","Monthly gross profit from this SKU"]
                    ].map(([h,tipK])=>(
                      <th key={h} style={{padding:"7px 8px",textAlign:["SKU","Cat"].includes(h)?"left":"right",color:"var(--text-sec)",fontSize:10,textTransform:"uppercase",whiteSpace:"nowrap"}}>
                        <span {...(TIPS[tipK]||tipK?.length>10?T(tipK):{})} style={{borderBottom:TIPS[tipK]?"1px dashed var(--border-dashed)":"none",cursor:TIPS[tipK]?"help":"default"}}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {skuRows.map((s,i)=>{
                    const c=CAT_C[s.cat]||"#555555";
                    const sp=prices[s.id];
                    return(
                      <tr key={s.id} style={{borderBottom:"1px solid var(--border-light)",background:i%2===0?"var(--bg-row)":"transparent"}}>
                        <td style={{padding:"7px 8px",color:"var(--text)",fontWeight:"bold"}}>{s.label}</td>
                        <td style={{padding:"7px 8px"}}><span style={{fontSize:10,padding:"1px 5px",borderRadius:3,background:c+"22",color:c,border:`1px solid ${c}44`}}>{s.cat}</span></td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:"var(--text-muted)"}}>{Math.round(s.mix*100)}%</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:"var(--text-muted)"}}>{Math.round(s.spLbs)}</td>
                        <td style={{padding:"12px 18px",textAlign:"right",minWidth:250}}>
                          <div style={{display:"flex",alignItems:"center",gap:14,justifyContent:"flex-end"}}>
                            <input type="range" min={5} max={120} step={1} value={sp} onChange={e=>setP(s.id,parseFloat(e.target.value))} style={{width:100,accentColor:c}}/>
                            <input type="number" value={sp} step={1} min={5} max={120} onChange={e=>setP(s.id,parseFloat(e.target.value))} style={{width:100,background:"var(--border)",color:"#b45309",border:"1px solid var(--border-dashed)",borderRadius:5,padding:"6px 22px 6px 10px",fontSize:14,textAlign:"right"}}/>
                          </div>
                        </td>
                        <td {...T("vsComp")} style={{padding:"7px 8px",textAlign:"right",color:s.compDelta>=0?"#dc2626":"#16a34a",fontWeight:"bold"}}>{s.compDelta>=0?"+":""}{fmt(s.compDelta)}</td>
                        <td {...T("farm")} style={{padding:"7px 8px",textAlign:"right",color:dark?"#f87171":"#ef4444"}}>${fmt(s.fa)}</td>
                        <td {...T("proc")} style={{padding:"7px 8px",textAlign:"right",color:phase==="3P"?(dark?"#fb923c":"#c2410c"):(dark?"#fbbf24":"#d97706")}}>${fmt(s.pc)}</td>
                        <td {...T("trans")} style={{padding:"7px 8px",textAlign:"right",color:dark?"#38bdf8":"#0369a1"}}>${fmt(freight)}</td>
                        <td {...T("cogs")} style={{padding:"7px 8px",textAlign:"right",color:dark?"#fb923c":"#ea580c",fontWeight:"bold"}}>${fmt(s.cogs)}</td>
                        <td {...T("gpLb")} style={{padding:"7px 8px",textAlign:"right",color:s.gpLb>=0?"#16a34a":"#dc2626",fontWeight:"bold"}}>${fmt(s.gpLb)}</td>
                        <td {...T("gm")} style={{padding:"7px 8px",textAlign:"right",color:s.gm>=0.6?"#16a34a":s.gm>=0.4?"#b45309":"#dc2626"}}>{fmt(s.gm*100,1)}%</td>
                        <td style={{padding:"7px 8px",textAlign:"right"}}>${fmt(s.rev,0)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:s.gpDol>=0?"#2563eb":"#dc2626",fontWeight:"bold"}}>${fmt(s.gpDol,0)}</td>
                      </tr>
                    );
                  })}
                  <tr style={{borderTop:"2px solid var(--border-accent)",background:"var(--bg-row)"}}>
                    <td colSpan={4} style={{padding:"9px 8px",color:"var(--text-sec)",fontWeight:"bold"}}>MONTHLY TOTALS / WEIGHTED AVG</td>
                    <td style={{padding:"9px 8px",textAlign:"right",color:"#b45309",fontWeight:"bold"}}>${fmt(blendP)}<div style={{fontSize:8,color:"var(--text-label)"}}>blended $/lb</div></td>
                    <td colSpan={4}></td>
                    <td style={{padding:"9px 8px",textAlign:"right",color:dc("#ea580c"),fontWeight:"bold"}}>${fmt(blendC)}</td>
                    <td style={{padding:"9px 8px",textAlign:"right",color:"#16a34a",fontWeight:"bold"}}>${fmt(totGP/lbs)}</td>
                    <td style={{padding:"9px 8px",textAlign:"right",color:"#2563eb",fontWeight:"bold"}}>{fmt(blendGM*100,1)}%</td>
                    <td style={{padding:"9px 8px",textAlign:"right",fontWeight:"bold"}}>${fmt(totRev,0)}/mo</td>
                    <td style={{padding:"9px 8px",textAlign:"right",color:"#2563eb",fontWeight:"bold"}}>${fmt(totGP,0)}/mo</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-5 gap-2.5">
              {[
                {l:"Gross Profit",  b:"M", v:money(totGP),          s:fmt(blendGM*100,1)+"% GM",       c:"#2563eb", tip:"grossProfitMo"},
                {l:"Variable Fees", b:"M", v:"-"+money(varFees),     s:"2% of revenue · card & misc",    c:"#dc2626", tip:"VARIABLE FEES (Monthly)\n2% of total monthly revenue.\nCovers credit card processing and misc fees."},
                {l:"Fixed LA Costs",b:"M", v:"-"+money(fixed),       s:"Rent, staff, utilities, insur.",  c:"#dc2626", tip:"LA FIXED MONTHLY COSTS\nPaid every month regardless of sales.\nDefault: $22,000/mo (rent, staff, utilities, insurance)."},
                {l:"Net Profit",    b:"M", v:money(jmcNP),           s:"Retail bottom line",              c:jmcNP>=0?"#16a34a":"#dc2626", tip:"jmcNetMo"},
                {l:"Net Profit",    b:"Y", v:money(jmcNP*12),        s:"Monthly × 12, current run rate",  c:jmcNP>=0?"#9333ea":"#dc2626", tip:"annualTotal"},
              ].map(k=>(
                <div key={k.l+k.b} {...T(k.tip)} className="card-hover p-3.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10px] text-stone-500 dark:text-slate-400 uppercase border-b border-dashed border-stone-300 dark:border-slate-600">{k.l}</span>
                    {k.b==="M"?<MLABEL/>:<YLABEL/>}
                  </div>
                  <div className="text-lg font-bold" style={{color:k.c}}>{k.v}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{k.s}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TAB 2: SCENARIOS ══ */}
        {tab===2&&(
          <div className="grid grid-cols-1 gap-4">
            {[{label:"PHASE 1 — 3rd-Party Processing",color:"#b45309",cogsLb:cogs3P,withHub:false},
              {label:`PHASE 2 — ${numLoc} Owned Location${numLoc!==1?"s":""}`,color:"#15803d",cogsLb:cogsOwn,withHub:true}
            ].map(ph=>(
              <div key={ph.label} className="card p-5" style={{borderColor:ph.withHub?(dark?"var(--border-accent)":"#86efac"):undefined}}>
                <div className="text-[11px] font-bold mb-1" style={{color:dc(ph.color)}}>{ph.label}</div>
                <div className="text-[10px] text-stone-500 dark:text-slate-400 mb-3">All figures are MONTHLY. Annual column = Monthly × 12.</div>
                <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:ph.withHub?10:11}}>
                  <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
                    {["Lbs/Mo","Revenue/Mo","Gross Profit/Mo",ph.withHub?"Hub Net/Mo":"","Fixed+Fees/Mo","Net Profit/Mo","Annual Net"].filter(Boolean).map(h=>(
                      <th key={h} style={{padding:"6px 6px",textAlign:"right",color:"var(--text-sec)",fontSize:9,textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
                    ))}</tr></thead>
                  <tbody>{[1200,2000,3000,5000,10000].map(v=>{
                    const r=v*blendP, c2=v*ph.cogsLb, gp2=r-c2, fees=r*.02;
                    const np=gp2+(ph.withHub?hub.net:0)-fees-fixed;
                    const cur=v===lbs;
                    return(<tr key={v} style={{borderBottom:"1px solid var(--border-light)",background:cur?"var(--bg-alt)":"transparent"}}>
                      <td style={{padding:"6px",color:cur?dc(ph.color):"var(--text-muted)",fontWeight:cur?"bold":"normal",whiteSpace:"nowrap"}}>{v.toLocaleString()}lb{cur?" ◄":""}</td>
                      <td style={{padding:"6px",textAlign:"right",color:"var(--text)"}}>${fmt(r,0)}</td>
                      <td style={{padding:"6px",textAlign:"right",color:dc("#2563eb")}}>${fmt(gp2,0)}</td>
                      {ph.withHub&&<td style={{padding:"6px",textAlign:"right",color:hub.net>=0?dc("#16a34a"):dc("#dc2626")}}>{money(hub.net)}</td>}
                      <td style={{padding:"6px",textAlign:"right",color:dc("#dc2626")}}>${fmt(fixed+fees,0)}</td>
                      <td style={{padding:"6px",textAlign:"right",color:np>=0?dc("#16a34a"):dc("#dc2626"),fontWeight:"bold"}}>{money(np)}</td>
                      <td style={{padding:"6px",textAlign:"right",color:np>=0?dc("#9333ea"):dc("#dc2626")}}>{money(np*12)}</td>
                    </tr>);
                  })}</tbody>
                </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ TAB 3: COMPETITORS ══ */}
        {tab===3&&(
          <div>
            <div className="flex justify-between items-center mb-3">
              <div style={{fontSize:11,color:"var(--text-sec)",fontWeight:"bold"}}>COMPETITOR PRICE SURVEY — Editable <span style={{fontSize:10,color:"var(--text-muted)",fontWeight:"normal"}}>Click any field to edit · Changes reflect in SKU P&L "vs Comp" column</span></div>
              <button onClick={addCompStore} className="btn-primary text-[10px]">+ Add Store</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {compData.map((store,i)=>(
                <div key={i} className="card p-4">
                  <div className="flex justify-between items-center mb-3 pb-2" style={{borderBottom:"1px solid var(--border)"}}>
                    <input type="text" value={store.store} onChange={e=>updateComp(i,"store",e.target.value)}
                      style={{fontSize:13,fontWeight:700,color:"var(--text)",background:"transparent",border:"none",outline:"none",width:"55%",padding:"2px 0"}}
                      className="hover:bg-stone-100 dark:hover:bg-slate-800 focus:bg-stone-50 dark:focus:bg-slate-700 rounded px-1 -ml-1 transition-colors"/>
                    <div className="flex items-center gap-2">
                      <select value={store.tier} onChange={e=>updateComp(i,"tier",e.target.value)}
                        style={{fontSize:10,background:"var(--bg-surface)",color:"var(--text-muted)",border:"1px solid var(--border)",borderRadius:4,padding:"2px 6px",cursor:"pointer",outline:"none"}}>
                        {TIER_OPTIONS.map(t=><option key={t} value={t}>{t}</option>)}
                      </select>
                      {compData.length>1&&<button onClick={()=>removeCompStore(i)} style={{fontSize:10,color:"#dc2626",cursor:"pointer",background:"none",border:"none",padding:"2px 4px"}} title="Remove store">✕</button>}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    {store.items.map((item,j)=>(
                      <div key={j} className="flex justify-between items-center px-2 py-1.5 rounded-md" style={{background:"var(--bg-surface)"}}>
                        <input type="text" value={item.n} onChange={e=>updateCompItem(i,j,"n",e.target.value)}
                          style={{fontSize:11,color:"var(--text-sec)",background:"transparent",border:"none",outline:"none",width:"50%",padding:"2px 0"}}
                          className="hover:bg-stone-200 dark:hover:bg-slate-700 focus:bg-stone-100 dark:focus:bg-slate-600 rounded px-1 -ml-1 transition-colors"/>
                        <div className="flex items-center gap-2">
                          <span style={{fontSize:11,color:"var(--text-sec)"}}>$</span>
                          <input type="number" value={item.p} step={0.01} min={0} onChange={e=>updateCompItem(i,j,"p",e.target.value)}
                            style={{width:70,fontSize:12,fontWeight:700,color:"#16a34a",background:"transparent",border:"1px solid var(--border)",borderRadius:4,padding:"3px 6px",textAlign:"right",outline:"none"}}/>
                          <span style={{fontSize:10,color:"var(--text-muted)"}}>/lb</span>
                          <button onClick={()=>removeCompItem(i,j)} style={{fontSize:9,color:"#dc2626",cursor:"pointer",background:"none",border:"none",padding:"1px 3px",opacity:0.5}} title="Remove item">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>addCompItem(i)} style={{fontSize:10,color:"var(--text-muted)",cursor:"pointer",background:"none",border:"1px dashed var(--border-dashed)",borderRadius:4,padding:"4px 10px",marginTop:6,width:"100%"}}
                    className="hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors">+ Add Cut</button>
                </div>
              ))}
            </div>
            <div style={{marginTop:10,padding:"10px 14px",background:"var(--bg-surface)",border:"1px solid var(--border)",borderRadius:6,fontSize:10,color:"var(--text-muted)",lineHeight:1.7}}>
              <b>Source:</b> In-person retail price survey, Los Angeles area, April 10, 2026. Prices are shelf price to consumers (not wholesale). Edit any field above — changes automatically update the "vs Comp" column in the SKU P&L tab. The comparison uses the average price across all stores for each matching cut.
            </div>
          </div>
        )}

        {/* ══ TAB 4: PROCESSING SCALE ══ */}
        {tab===4&&(
          <div>
            <div className="card p-5 mb-3.5">
              <div className="flex items-center gap-2 mb-2">
                <Factory size={14} className="text-violet-400"/>
                <span className="text-[11px] text-violet-600 font-bold">LOCATION MATRIX — 1 to 10 Plants</span>
                <span className="text-[10px] text-stone-500 dark:text-slate-400">All figures MONTHLY unless marked ANNUAL · Click location number to switch model</span>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{borderBottom:"2px solid var(--border)"}}>
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
                      <th key={h} style={{padding:"7px 9px",textAlign:"right",color:"var(--text-sec)",fontSize:10,textTransform:"uppercase",whiteSpace:"nowrap"}}>
                        <span {...T(tip2)} style={{borderBottom:"1px dashed var(--border-dashed)",cursor:"help"}}>{h}</span>
                      </th>
                    ))}</tr></thead>
                  <tbody>{locMatrix.map(row=>(
                    <tr key={row.loc} style={{borderBottom:"1px solid var(--border-light)",background:row.current?"var(--bg-row)":"transparent",borderLeft:row.current?"3px solid #d97706":"3px solid transparent"}}>
                      <td style={{padding:"8px 9px",textAlign:"right"}}>
                        <button onClick={()=>setNumLoc(row.loc)} style={{background:row.current?"#d97706":"var(--border)",color:row.current?"#000":"var(--text-sec)",border:`1px solid ${row.current?"#d97706":"var(--text-label)"}`,borderRadius:5,padding:"3px 10px",cursor:"pointer",fontSize:11,fontWeight:row.current?"bold":"normal"}}>{row.loc}{row.current?" ◄":""}</button>
                      </td>
                      <td style={{padding:"8px 9px",textAlign:"right",color:"#7c3aed"}}>{row.cap} hd</td>
                      <td {...T("hubFixed")} style={{padding:"8px 9px",textAlign:"right",color:"#dc2626",cursor:"help"}}>${fmt(row.fix,0)}/mo</td>
                      <td {...T("hubBE")} style={{padding:"8px 9px",textAlign:"right",color:"#d97706",cursor:"help"}}>{row.be} hd</td>
                      <td style={{padding:"8px 9px",textAlign:"right",color:row.at50>=0?"#16a34a":"#dc2626"}}>{money(row.at50)}/mo</td>
                      <td style={{padding:"8px 9px",textAlign:"right",color:row.at75>=0?"#16a34a":"#dc2626"}}>{money(row.at75)}/mo</td>
                      <td style={{padding:"8px 9px",textAlign:"right",color:row.atMax>=0?"#15803d":"#dc2626",fontWeight:"bold"}}>{money(row.atMax)}/mo</td>
                      <td style={{padding:"8px 9px",textAlign:"right",color:row.atMax>=0?"#9333ea":"#dc2626"}}>{money(row.atMax*12)}/yr</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>

            <div className="card p-5">
              <div className="text-[11px] text-emerald-600 font-bold mb-2">
                HEAD-BY-HEAD — {numLoc} Location{numLoc!==1?"s":" ("+hub.cap+" head cap)"} · All figures MONTHLY
              </div>
              <div style={{overflowX:"auto",maxHeight:380}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{borderBottom:"2px solid var(--border)",position:"sticky",top:0,background:"var(--bg-card)"}}>
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
                      <th key={h} style={{padding:"6px 8px",textAlign:"right",color:"var(--text-sec)",fontSize:8,textTransform:"uppercase",whiteSpace:"nowrap"}}>
                        <span {...T(t)} style={{borderBottom:"1px dashed var(--border-dashed)",cursor:"help"}}>{h}</span>
                      </th>
                    ))}</tr></thead>
                  <tbody>{headRows.map((h2,i)=>{
                    const hh=hubCalc(numLoc,capPerPlant,fixedPerPlant,h2,lbPerHead,rLb,rHead,varCPH);
                    const combined=jmcNP+hh.net;
                    const isCur=h2===hub.h;
                    return(
                      <tr key={i} style={{borderBottom:"1px solid var(--border-light)",background:isCur?"#dcfce755":"transparent",borderLeft:isCur?"3px solid #16a34a":"3px solid transparent"}}>
                        <td style={{padding:"7px 8px",textAlign:"right"}}>
                          <button onClick={()=>setExtH(h2)} style={{background:isCur?"#16a34a":"var(--border)",color:isCur?"#000":"var(--text-sec)",border:`1px solid ${isCur?"#16a34a":"var(--text-label)"}`,borderRadius:4,padding:"2px 8px",cursor:"pointer",fontSize:11}}>{h2}{isCur?" ◄":""}</button>
                        </td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:"var(--text-muted)"}}>{Math.round(hh.util*100)}%</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:"#16a34a"}}>{money(hh.gross)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:"#dc2626"}}>{money(hh.varC)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:"#dc2626"}}>{money(hh.fixed)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:hh.net>=0?"#15803d":"#dc2626",fontWeight:"bold"}}>{money(hh.net)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:jmcNP>=0?"#2563eb":"#dc2626"}}>{money(jmcNP)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:combined>=0?"#16a34a":"#dc2626",fontWeight:"bold"}}>{money(combined)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:combined>=0?"#9333ea":"#dc2626"}}>{money(combined*12)}</td>
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
            <div className="rounded-xl border border-yellow-800 p-5 mb-3.5" style={{background:"var(--bg-input)"}}>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <Truck size={14} className="text-amber-400"/>
                <span className="text-[11px] text-amber-700 font-bold">⑤ WHOLESALE CHANNEL — Sell Bulk to LA Restaurants</span>
                <span {...T("WHOLESALE CHANNEL\nSell beef in bulk directly to restaurants at lower prices.\nThis is ADDITIONAL revenue on top of your retail shop.\nKey differences vs retail:\n• Lower price/lb (40–60% below retail)\n• Lower shrink (3% vs 8%) — bulk delivery, less display waste\n• Lower card fee (1% — invoiced accounts)\n• No separate fixed cost allocation")} style={{fontSize:10,color:"#b45309",borderBottom:"1px dashed #fbbf24",cursor:"help"}}>what is this?</span>
                <button onClick={()=>setWsOn(v=>!v)} style={{
                  padding:"5px 14px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:"bold",
                  border:`2px solid ${wsOn?"#b45309":"var(--text-label)"}`,
                  background:wsOn?"#b4530922":"var(--border)",
                  color:wsOn?"#d97706":"var(--text-sec)",
                  marginLeft:"auto",
                }}>{wsOn?"✓ Channel ACTIVE":"✗ Channel OFF — click to activate"}</button>
                {!wsOn&&<span style={{fontSize:10,color:"#fbbf24"}}>Not included in combined totals until activated</span>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:20}}>
                {S("WS Volume/Month (lb)",wsLbs,setWsLbs,0,20000,50,v=>v.toLocaleString()+"lb","#d97706","wsGPMo")}
                {S("WS Shrink %",wsShrink,setWsShrink,0.01,0.08,0.005,v=>Math.round(v*100)+"%","#b45309","WHOLESALE SHRINK %\nLower than retail (3% default vs 8%).\nBulk delivery = no display sitting out.\nLower shrink = better margins.")}
                <div style={{background:"var(--bg-card)",border:"1px solid #fbbf24",borderRadius:7,padding:"10px 14px"}}>
                  <div style={{fontSize:10,color:"#d97706",marginBottom:6}}>WHOLESALE P&L <MLABEL/></div>
                  {[
                    ["Volume",wsLbs.toLocaleString()+" lb","var(--text)","Total monthly lbs sold wholesale"],
                    ["Blended WS Price","$"+fmt(wsBlendP)+"/lb","#d97706","Average sell price across all cuts"],
                    ["Revenue/Mo",money(wsTotRev),"#16a34a","wsGPMo"],
                    ["Gross Profit/Mo",money(wsTotGP),"#2563eb","wsGPMo"],
                    ["Gross Margin",fmt(wsBlendGM*100,1)+"%","#2563eb","Wholesale gross margin — lower than retail but no fixed cost required"],
                  ].map(([k,v,c,tK])=>(
                    <div key={k} {...T(tK)} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",borderBottom:"1px solid var(--border-light)"}}>
                      <span style={{fontSize:10,color:"var(--text-sec)",borderBottom:"1px dashed var(--border-dashed)"}}>{k}</span>
                      <span style={{fontSize:10,fontWeight:"bold",color:c}}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:7,padding:"10px 14px"}}>
                  <div style={{fontSize:10,color:"#16a34a",marginBottom:6}}>ALL CHANNELS — <MLABEL/> & <YLABEL/></div>
                  {[
                    ["Retail NP/mo",money(jmcNP),jmcNP>=0?"#16a34a":"#dc2626","jmcNetMo","M"],
                    ["WS GP/mo",wsOn?money(wsTotGP):"(channel off)","#d97706","wsGPMo","M"],
                    ["Hub net/mo",phase==="Own"?money(hub.net):"—",phase==="Own"?(hub.net>=0?"#15803d":"#dc2626"):"var(--text-label)","hubNetMo","M"],
                    ["TOTAL/mo",money(totalMo),totalMo>=0?"#16a34a":"#dc2626","totalMo","M"],
                    ["ANNUAL TOTAL",money(totalMo*12),totalMo>=0?"#9333ea":"#dc2626","annualTotal","Y"],
                  ].map(([k,v,c,tK,badge])=>(
                    <div key={k} {...T(tK)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"2px 0",borderBottom:"1px solid var(--border-light)"}}>
                      <div>
                        <span style={{fontSize:10,color:"var(--text-sec)",borderBottom:"1px dashed var(--border-dashed)"}}>{k}</span>
                        {badge==="M"?<MLABEL/>:<YLABEL/>}
                      </div>
                      <span style={{fontSize:10,fontWeight:"bold",color:c}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Wholesale Price Sheet */}
            <div style={{background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:8,padding:"16px 18px",marginBottom:14}}>
              <div style={{fontSize:11,color:"#d97706",fontWeight:"bold",marginBottom:4}}>WHOLESALE PRICE SHEET — Set Your B2B Price Per Cut <span style={{fontSize:10,color:"var(--text-label)",fontWeight:"normal"}}>All figures MONTHLY</span></div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{borderBottom:"2px solid var(--border)"}}>
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
                      <th key={h} style={{padding:"7px 8px",textAlign:h==="SKU"?"left":"right",color:"var(--text-sec)",fontSize:10,textTransform:"uppercase",whiteSpace:"nowrap"}}>
                        <span {...T(tK)} style={{borderBottom:tK?"1px dashed var(--border-dashed)":"none",cursor:tK?"help":"default"}}>{h}</span>
                      </th>
                    ))}</tr></thead>
                  <tbody>{wsRows.map((s,i)=>{
                    const inRange=s.uLo!=null&&s.wsP>=s.uLo&&s.wsP<=s.uHi;
                    const c=CAT_C[s.cat]||"#555555";
                    return(
                      <tr key={s.id} style={{borderBottom:"1px solid var(--border-light)",background:i%2===0?"var(--bg-row)":"transparent"}}>
                        <td style={{padding:"7px 8px"}}>
                          <div style={{fontWeight:"bold",color:"var(--text)"}}>{s.label}</div>
                          <span style={{fontSize:10,padding:"1px 5px",borderRadius:3,background:c+"22",color:c,border:`1px solid ${c}44`}}>{s.cat}</span>
                        </td>
                        <td {...T("usdaWS")} style={{padding:"7px 8px",textAlign:"right",color:"#15803d",cursor:"help"}}>{s.uLo?"$"+fmt(s.uLo):"—"}</td>
                        <td {...T("usdaWS")} style={{padding:"7px 8px",textAlign:"right",color:"#15803d",cursor:"help"}}>{s.uHi?"$"+fmt(s.uHi):"—"}</td>
                        <td style={{padding:"10px 16px",textAlign:"right",minWidth:230}}>
                          <div style={{display:"flex",alignItems:"center",gap:12,justifyContent:"flex-end"}}>
                            <div style={{position:"relative",width:90}}>
                              <input type="range" min={2} max={70} step={1} value={s.wsP} onChange={e=>setWP(s.id,parseFloat(e.target.value))} style={{width:"100%",accentColor:inRange?"#d97706":"var(--text-sec)"}}/>
                              {s.uLo&&<div style={{position:"absolute",top:4,height:8,borderRadius:4,background:"#16a34a",opacity:0.35,pointerEvents:"none",left:`${(s.uLo/70)*100}%`,width:`${((s.uHi-s.uLo)/70)*100}%`,border:"1px solid #16a34a"}}/>}
                            </div>
                            <input type="number" value={s.wsP} step={1} min={2} max={70} onChange={e=>setWP(s.id,parseFloat(e.target.value))} style={{width:100,background:"var(--bg-input)",color:"#d97706",border:`1px solid ${inRange?"#fbbf24":"var(--text-label)"}`,borderRadius:5,padding:"6px 22px 6px 10px",fontSize:14,textAlign:"right"}}/>
                          </div>
                          <div style={{fontSize:9,textAlign:"right",color:inRange?"#15803d":"#b45309",fontWeight:inRange?"600":"normal",marginTop:2}}>{inRange?"✓ In USDA range":s.wsP<(s.uLo||0)?"↓ Below market":"↑ Above market"}</div>
                        </td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:s.vsMid!=null?(Math.abs(s.vsMid)<10?"#b45309":s.vsMid>0?"#dc2626":"#16a34a"):"var(--text-muted)",fontWeight:"bold"}}>
                          {s.vsMid!=null?(s.vsMid>0?"+":"")+fmt(s.vsMid,1)+"%":"—"}
                        </td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:"#dc2626"}}>{fmt(s.vsRetail,1)}%</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:dc("#ea580c")}}>${fmt(s.cogsWS)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:s.gpLb>=0?"#16a34a":"#dc2626",fontWeight:"bold"}}>${fmt(s.gpLb)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:s.gm>=0.25?"#16a34a":s.gm>=0.10?"#b45309":"#dc2626"}}>{fmt(s.gm*100,1)}%</td>
                        <td style={{padding:"7px 8px",textAlign:"right"}}>${fmt(s.rev,0)}</td>
                        <td style={{padding:"7px 8px",textAlign:"right",color:s.gp>=0?"#2563eb":"#dc2626",fontWeight:"bold"}}>${fmt(s.gp,0)}</td>
                      </tr>
                    );
                  })}
                  <tr style={{borderTop:"2px solid var(--border-accent)",background:"var(--bg-row)"}}>
                    <td colSpan={3} style={{padding:"9px 8px",color:"var(--text-sec)",fontWeight:"bold"}}>MONTHLY WS TOTALS</td>
                    <td style={{padding:"9px 8px",textAlign:"right",color:"#d97706",fontWeight:"bold"}}>${fmt(wsBlendP)}</td>
                    <td colSpan={3}></td>
                    <td style={{padding:"9px 8px",textAlign:"right",color:"#16a34a",fontWeight:"bold"}}>${fmt(wsTotGP/wsLbs)}</td>
                    <td style={{padding:"9px 8px",textAlign:"right",color:"#2563eb",fontWeight:"bold"}}>{fmt(wsBlendGM*100,1)}%</td>
                    <td style={{padding:"9px 8px",textAlign:"right",fontWeight:"bold"}}>${fmt(wsTotRev,0)}/mo</td>
                    <td style={{padding:"9px 8px",textAlign:"right",color:"#2563eb",fontWeight:"bold"}}>${fmt(wsTotGP,0)}/mo</td>
                  </tr></tbody>
                </table>
              </div>
              <div style={{marginTop:10,padding:"10px 14px",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:6,fontSize:10,color:"#15803d",lineHeight:1.7}}>
                <span style={{fontWeight:700}}>USDA Range Source:</span> USDA Agricultural Marketing Service (AMS) — Report <b>nw_ls110</b>, "National Monthly Grass-Fed Beef Wholesale Report." These are <b>actual negotiated B2B transaction prices</b> between producers and wholesale buyers, not estimates. The green bar on each slider shows where the current USDA negotiated range falls. Pricing your wholesale inside this range signals market-rate competitiveness to restaurant buyers. Data pulled April 2026.
              </div>
            </div>

            {/* Restaurant Buyers */}
            <div style={{background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:8,padding:"16px 18px"}}>
              <div style={{fontSize:11,color:"#2563eb",fontWeight:"bold",marginBottom:4}}>RESTAURANT BUYER — MAX WHOLESALE PRICE THEY CAN AFFORD
                <span {...T("maxWS")} style={{fontSize:10,color:"#2563eb",marginLeft:8,borderBottom:"1px dashed #3b82f6",cursor:"help"}}>how is this calculated?</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                {REST_BUYERS.map((buyer,bi)=>(
                  <div key={bi} style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:8,padding:"14px 16px"}}>
                    <div style={{marginBottom:10}}>
                      <div style={{fontSize:12,color:"var(--text)",fontWeight:"bold"}}>{buyer.name}</div>
                      <div style={{fontSize:10,color:"var(--text-sec)"}}>{buyer.ex}</div>
                    </div>
                    {buyer.items.map((item,ii)=>{
                      const mw=maxWS(item.menu,item.oz,item.loss,item.fc);
                      const myP=wsPrices[item.cut]||SKUS.find(s=>s.id===item.cut)?.ws||0;
                      const fits=mw>=myP, hdroom=mw-myP;
                      const sku=SKUS.find(s=>s.id===item.cut);
                      return(
                        <div key={ii} {...T("MAX WHOLESALE PRICE — "+buyer.name+"\n"+sku?.label+" ("+item.oz+"oz served)\n\nMenu price: $"+fmt(item.menu)+"\nFood cost target: "+Math.round(item.fc*100)+"% = $"+fmt(item.menu*item.fc)+" ingredient budget\nCooking loss: "+Math.round(item.loss*100)+"% → raw weight: "+fmt((item.oz/(1-item.loss))/16,2)+"lb needed\n\nMax WS price: $"+fmt(mw)+"/lb\nYour WS price: $"+fmt(myP)+"/lb\n"+(fits?"✓ Fits — $"+fmt(hdroom)+"/lb room to spare":"✗ Over budget by $"+fmt(Math.abs(hdroom))+"/lb"))}
                          style={{background:fits?"#dcfce722":"#1c0a0a22",border:`1px solid ${fits?"#86efac":"#fca5a5"}`,borderRadius:6,padding:"8px 10px",marginBottom:8,cursor:"help"}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                            <div>
                              <div style={{fontSize:11,color:"var(--text)",fontWeight:"bold"}}>{sku?.label} {item.oz}oz</div>
                              <div style={{fontSize:10,color:"var(--text-sec)"}}>Menu ${fmt(item.menu)} · FC {Math.round(item.fc*100)}% · Loss {Math.round(item.loss*100)}%</div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontSize:10,color:"var(--text-sec)"}}>max WS</div>
                              <div style={{fontSize:15,fontWeight:"bold",color:"#d97706"}}>${fmt(mw)}/lb</div>
                            </div>
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between"}}>
                            <span style={{fontSize:10,color:"var(--text-muted)"}}>Your WS: <span style={{color:"#d97706",fontWeight:"bold"}}>${fmt(myP)}</span></span>
                            <span style={{fontSize:10,fontWeight:"bold",color:fits?"#16a34a":"#dc2626"}}>{fits?`✓ +$${fmt(hdroom)} room`:`✗ $${fmt(Math.abs(hdroom))} over`}</span>
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
            <div className="card p-5 mb-3.5">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <Beef size={14} className="text-violet-400"/>
                <span className="text-[11px] text-violet-600 font-bold">YIELD vs TARGET — At Current Volume</span>
                <span className="text-[10px] text-stone-500 dark:text-slate-400">
                  {Math.round(lbs/lbPerHead*10)/10} head/mo at {lbs.toLocaleString()} lbs ÷ {lbPerHead} lbs/head · Green = you have enough from cow · Red = you need more cows or less of that cut
                </span>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{borderBottom:"2px solid var(--border)"}}>
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
                      <th key={h} style={{padding:"6px 8px",textAlign:"right",color:"var(--text-sec)",fontSize:10,textTransform:"uppercase",whiteSpace:"nowrap"}}>
                        <span {...T(t)} style={{borderBottom:"1px dashed var(--border-dashed)",cursor:"help"}}>{h}</span>
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
                        <tr key={s.id} style={{borderBottom:"1px solid var(--border-light)",background:isAlert?"#fef2f233":i%2===0?"var(--bg-row)":"transparent"}}>
                          <td style={{padding:"7px 8px",textAlign:"right"}}>
                            <div style={{fontWeight:"bold",color:isAlert?"#dc2626":"var(--text)"}}>{s.label}</div>
                            {isAlert&&<div style={{fontSize:10,color:"#dc2626"}}>⚠ only 1/animal</div>}
                          </td>
                          <td style={{padding:"7px 8px",textAlign:"right",color:dc("#9333ea")}}>{fmt(target,0)} lb</td>
                          <td style={{padding:"7px 8px",textAlign:"right"}}>
                            <span style={{color:"var(--text)"}}>{cut.yLo}–{cut.yHi} lbs</span>
                            <div style={{fontSize:10,color:"var(--text-sec)"}}>{cut.wholeCowQty} {cut.unit}/cow</div>
                          </td>
                          <td {...T("YIELD AT CURRENT HEADS\n"+fmt(headsThisMonth,1)+" heads × "+fmt((cut.yLo+cut.yHi)/2,1)+" avg lbs/head = "+fmt(yieldMid,0)+" lbs available")} style={{padding:"7px 8px",textAlign:"right",color:dc("#d97706"),cursor:"help"}}>{fmt(yieldMid,0)} lb</td>
                          <td style={{padding:"7px 8px",textAlign:"right",color:delta>=0?dc("#16a34a"):dc("#dc2626"),fontWeight:"bold"}}>
                            {delta>=0?"+":""}{fmt(delta,0)} lb
                            <div style={{fontSize:10,color:delta>=0?"#86efac":"#fca5a5"}}>{delta>=0?"surplus":"SHORT"}</div>
                          </td>
                          <td style={{padding:"7px 8px",textAlign:"right",color:"var(--text)"}}>{fmt(headsForCut,1)} hd</td>
                          <td style={{padding:"7px 8px",textAlign:"right",fontSize:10,color:"var(--text)",maxWidth:140}}>{cut.butcher.split("·")[0].trim()}</td>
                          <td style={{padding:"7px 8px",textAlign:"right",fontSize:10,color:dc("#16a34a"),maxWidth:140}}>{cut.ws.split("·")[0].trim()}</td>
                          <td style={{padding:"7px 8px",textAlign:"right",color:cut.rfRef<=5?dc("#b45309"):"var(--text)"}}>{cut.rfRef}d</td>
                          <td style={{padding:"7px 8px",textAlign:"right",color:dc("#15803d")}}>{cut.rfVac}d</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{marginTop:10,background:"var(--bg)",borderRadius:5,padding:"8px 12px",fontSize:10,color:"var(--text-label)",lineHeight:1.8}}>
                ⚠ <b style={{color:"#dc2626"}}>Hanger steak:</b> Only 1 per animal (0.75–1 lb). At {Math.round(lbs/lbPerHead)} head/mo you have ~{fmt(Math.round(lbs/lbPerHead)*0.875,0)} lbs available — but your SKU mix targets {fmt(skuRows.find(s=>s.id==="hanger")?.spLbs||0,0)} lbs. Consider reducing hanger mix % or sourcing from additional animals.
              </div>
            </div>

            {/* --- Full Cut Reference --- */}
            {PRIMALS.map(primal=>{
              const cuts = JMC_CUTS.filter(c=>c.primal===primal);
              return(
                <div key={primal} className="card p-4 mb-3">
                  <div className="section-header">
                    {primal.toUpperCase()}
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 ml-2 font-normal">{cuts.length} cut{cuts.length!==1?"s":""} from this primal</span>
                  </div>
                  <div style={{overflowX:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
                      <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
                        {["Cut","Unit Weight","Yield / Whole Cow","Qty/Cow","Retail Packaging","Wholesale Packaging","Fridge Retail","Fridge Vac","Frozen","Notes"].map(h=>(
                          <th key={h} style={{padding:"5px 8px",textAlign:"left",color:"var(--text-sec)",fontSize:8,textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
                        ))}</tr></thead>
                      <tbody>
                        {cuts.map((cut,i)=>(
                          <tr key={cut.id} style={{borderBottom:"1px solid var(--border-light)",background:i%2===0?"var(--bg-row)":"transparent",borderLeft:cut.note?"3px solid #dc2626":"3px solid transparent"}}>
                            <td style={{padding:"6px 8px",color:cut.note?"#dc2626":"var(--text)",fontWeight:"bold",whiteSpace:"nowrap"}}>{cut.name}</td>
                            <td style={{padding:"6px 8px",color:"var(--text)",whiteSpace:"nowrap"}}>{cut.unitWeight}</td>
                            <td style={{padding:"6px 8px",color:dc("#d97706"),whiteSpace:"nowrap"}}>{cut.yLo}–{cut.yHi} lbs</td>
                            <td style={{padding:"6px 8px",color:"var(--text)",whiteSpace:"nowrap"}}>{cut.wholeCowQty} {cut.unit}</td>
                            <td style={{padding:"6px 8px",color:dc("#2563eb"),maxWidth:180,fontSize:10}}>{cut.butcher}</td>
                            <td style={{padding:"6px 8px",color:dc("#16a34a"),maxWidth:180,fontSize:10}}>{cut.ws}</td>
                            <td style={{padding:"6px 8px",color:cut.rfRef<=5?dc("#b45309"):"var(--text)",whiteSpace:"nowrap"}}>{cut.rfRef}d</td>
                            <td style={{padding:"6px 8px",color:dc("#15803d"),whiteSpace:"nowrap"}}>{cut.rfVac}d</td>
                            <td style={{padding:"6px 8px",color:"var(--text)",whiteSpace:"nowrap"}}>{cut.frVac}d</td>
                            <td style={{padding:"6px 8px",fontSize:10,color:"#dc2626",maxWidth:200}}>{cut.note||""}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            <div style={{background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:7,padding:"10px 14px",fontSize:10,color:"var(--text-sec)",lineHeight:1.8}}>
              <b style={{color:"#b45309"}}>SHELF LIFE KEY</b> · Fridge Retail = butcher paper or foam tray (open case) · Fridge Vac = cryovac/vacuum seal (wholesale ready) · Frozen = frozen in any packaging ·
              <b style={{color:"#dc2626",marginLeft:4}}>Red-bordered rows have special handling requirements</b> · All shelf life in days · Source: jmc_cuts_data.js · USDA FSIS guidelines
            </div>
          </div>
        )}

        {/* ══ TAB 7: STARTUP COSTS ══ */}
        {tab===7&&(
          <div>
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                {label:"Total Startup Cost",val:money(suStartupCost),color:"#b45309",sub:"One-time launch expenses",glow:"glow-amber",Icon:DollarSign},
                {label:"Monthly Burn",val:money(suMonthlyBurn),color:"#2563eb",sub:"Recurring operating costs",glow:"glow-blue",Icon:TrendingUp},
                {label:"12-Month Carry",val:money(suMonthlyBurn*12),color:"#9333ea",sub:"Annual operating cost projection",glow:"glow-purple",Icon:Percent},
              ].map(k=>(
                <div key={k.label} className={`kpi-card ${k.glow}`}>
                  <k.Icon size={20} className="absolute top-4 right-4 opacity-15" style={{color:k.color}}/>
                  <div className="text-[10px] text-stone-500 dark:text-slate-400 uppercase tracking-wider font-semibold">{k.label}</div>
                  <div className="text-2xl font-bold mt-1.5" style={{color:k.color}}>{k.val}</div>
                  <div className="text-[10px] text-slate-700 dark:text-slate-300 mt-1">{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Reset Button */}
            <div className="mb-3.5 text-right">
              <button onClick={()=>setSuData(buildStartupState())} className="btn-ghost">
                Reset All Fields
              </button>
            </div>

            {/* Section Cards */}
            <div className="grid grid-cols-2 gap-3.5">
              {STARTUP_SECTIONS.map(sec=>(
                <div key={sec.key} className="card p-5" style={{borderColor:sec.monthly?"#bfdbfe":undefined}}>
                  <div className="flex justify-between items-start mb-3.5 pb-2.5 border-b border-surface-border">
                    <div>
                      <div className="text-sm font-semibold text-stone-700 dark:text-slate-200">{sec.title}</div>
                      <div className="text-[10px] mt-0.5" style={{color:sec.monthly?"#2563eb":"#666666"}}>
                        {sec.monthly?"Monthly operating cost":"One-time startup cost"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-stone-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Section Total</div>
                      <div className="text-base font-bold" style={{color:sec.monthly?"#2563eb":"#b45309"}}>{money(suTotals[sec.key])}</div>
                    </div>
                  </div>
                  {sec.fields.map(([fieldKey,label])=>(
                    <div key={fieldKey} className="data-row">
                      <label className="text-[11px] text-stone-600 dark:text-slate-300">{label}</label>
                      <input type="number" inputMode="decimal" min="0" step="any" placeholder="0"
                        value={suData[sec.key][fieldKey]}
                        onChange={e=>updateSuField(sec.key,fieldKey,e.target.value)}
                        className="input-field w-28 text-xs"/>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="card p-5 mt-4">
              <div className="text-xs text-stone-700 dark:text-slate-200 font-semibold mb-2.5">Notes</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg p-3.5 text-[11px] text-stone-600 dark:text-slate-300 leading-relaxed" style={{background:"var(--bg-surface)"}}>
                  <b className="text-brand-500">Startup costs</b> are your one-time launch expenses like buildout, equipment, permits, and inventory.
                </div>
                <div className="rounded-lg p-3.5 text-[11px] text-stone-600 dark:text-slate-300 leading-relaxed" style={{background:"var(--bg-surface)"}}>
                  <b className="text-blue-600">Monthly burn</b> is what it costs you to keep the shop open each month before product margin is added.
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
