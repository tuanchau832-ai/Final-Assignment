# Hanoi WaterWatch — Design and Cost Comparison

## Evaluation Scope

Three alternative solutions are compared across three high-risk wastewater outfalls in Hanoi over a three-year evaluation period. The objective is to detect unusual water-quality changes promptly, identify the affected outfall and communicate preliminary findings to authorities and nearby communities.

The target beneficiaries are riverside residents, downstream farmers and environmental authorities, particularly around the Nhue and To Lich rivers. Exact station locations remain subject to site selection and permission.

## 1. Community-Based Monitoring

Residents and trained volunteers use portable water-testing kits and report suspected pollution through a mobile application. This approach is affordable and encourages participation but provides periodic rather than continuous monitoring, with variable data reliability.

| Cost component (3 locations) | Estimated cost (USD) |
|---|---:|
| Testing kits and protective equipment | $180.00 |
| Training and initial setup | $120.00 |
| Annual testing, transport and coordination | $480.00 |
| **First-year total** | **$780.00** |
| **Three-year total** | **$1,740.00** |

## 2. Hanoi WaterWatch (HWW)

HWW combines solar-powered IoT monitoring stations with a public monitoring application. It provides continuous, rule-based monitoring at individual wastewater outfalls rather than relying solely on periodic manual sampling. Community photo reports supplement sensor observations.

### 2.1 System workflow

**Sense → Check → Send → Alert → Confirm**

1. Sensors collect water-quality readings every two seconds.
2. Three consecutive abnormal readings trigger an anomaly alert; an isolated spike does not.
3. Readings are transmitted with timestamps and station identifiers via 4G and MQTT. Offline buffering preserves readings during connectivity failures.
4. The public map displays station status using green, yellow and red indicators. Residents and environmental authorities receive preliminary alerts.
5. Inspectors collect samples at the affected outfall for accredited laboratory confirmation before enforcement.

### 2.2 Monitoring and detection rules

| Parameter | Proposed alert rule |
|---|---|
| pH | Outside 6.0–8.5 |
| Dissolved oxygen (DO) | Below 4 mg/L |
| Turbidity | Increase of 50% above the station baseline |
| Temperature | Recorded for measurement compensation |

Each station establishes its initial baseline during the first two weeks. The pH and DO screening rules are drawn from the team's interpretation of QCVN 08:2023/BTNMT; turbidity uses a project-defined rule. These are screening indicators, not proof of unlawful discharge or safe water. Alerts identify an affected outfall, not necessarily an individual polluter.

### 2.3 Station configuration and BOM

| Component | Qty per station | Unit cost (USD) |
|---|---:|---:|
| LILYGO ESP32 with integrated 4G and solar charging | 1 | $49.78 |
| DFRobot industrial pH probe | 1 | $64.90 |
| DFRobot dissolved oxygen probe | 1 | $169.00 |
| DFRobot turbidity sensor | 1 | $9.90 |
| DFRobot waterproof temperature sensor | 1 | $7.50 |
| 20 W solar panel and charging kit | 1 | $46.99 |
| Battery, enclosure, steel cage, anti-fouling wiper and cables | 1 set | $80.00 |
| Installation labour | 1 | $40.00 |
| **Installed cost per station** | | **$468.07** |

The station uses a lockable enclosure mounted above anticipated flood levels, a protected probe cage and a station identification number with QR access. The proposed power supply is a 20 W solar panel and rechargeable battery. Exact modem, carrier, antenna, battery capacity and storage implementation have not yet been specified.

### 2.4 Application and community features

- Public monitoring map with colour-coded station status, readings and observation timestamps.
- Community photo reporting and preliminary pollution notifications.
- Proposed bilingual Vietnamese–English interface and large-text mode.
- SMS and ward loudspeaker announcements as proposed alternatives for residents without smartphones.
- Sensor fault flags, offline data buffering, signed readings and tamper alerts as proposed reliability safeguards.
- Public viewing without a required account; proposed location privacy protections.

AI prediction, additional chemical sensors and automatic wastewater treatment are outside the current HWW scope.

### 2.5 Prototype and implementation

| Prototype | Purpose |
|---|---|
| ESP32/Wokwi simulator | Test sampling, consecutive-reading detection, MQTT and alert logic. |
| Mobile web app | Demonstrate public map, alert handling and community accessibility. |
| 3D station model | Explain physical layout, probe protection and installation. |

The prototypes use simulated data. Field accuracy, power autonomy and test outcomes have not yet been established.

| Phase | Proposed activity |
|---|---|
| Months 0–3 | Agree on three sites, permissions, alert responsibilities and training. |
| Months 3–9 | Install three stations, establish baselines and introduce the application. |
| Months 9–12 | Evaluate alert timeliness, false alarms, laboratory agreement and user adoption. |
| Years 2–3 | Continue operation, maintenance and evaluation before deciding on expansion. |

The proposed environmental authority owns the stations and data; the project team installs and maintains the system; accredited laboratories verify samples; ward authorities help communicate alerts. Maintenance includes probe cleaning every two weeks, monthly calibration and a proposed 48-hour repair target.

### 2.6 HWW cost analysis

| Annual operating expense | Per station (USD) |
|---|---:|
| Replacement pH electrode | $49.50 |
| Probe cleaning (24 visits budgeted) | $60.00 |
| 4G subscription | $18.00 |
| Calibration solutions | $10.00 |
| Cloud hosting allocation | $5.00 |
| **Annual total** | **$142.50** |

| Cost component | Per station (USD) | Three stations (USD) |
|---|---:|---:|
| Equipment and materials | $428.07 | $1,284.21 |
| Installation | $40.00 | $120.00 |
| **Initial investment** | **$468.07** | **$1,404.21** |
| Annual operation and maintenance | $142.50 | $427.50 |
| **First-year total** | **$610.57** | **$1,831.71** |
| **Three-year total** | **$895.57** | **$2,686.71** |


## 3. AI + IoT Monitoring

This alternative uses equivalent IoT infrastructure with machine learning to identify abnormal water-quality patterns and potentially predict pollution events. It requires additional training data, model development, computing resources and ongoing validation.

| Cost component (3 stations) | Estimated cost (USD) |
|---|---:|
| IoT infrastructure and installation | $1,404.21 |
| AI model development and training | $600.00 |
| Annual station operation | $427.50 |
| Annual AI hosting and maintenance | $240.00 |
| **First-year total** | **$2,671.71** |
| **Three-year total** | **$4,006.71** |

## Overall Cost Comparison

| Cost (USD) | Community-Based | HWW | AI + IoT |
|---|---:|---:|---:|
| Initial investment | $300.00 | $1,404.21 | $2,004.21 |
| Annual operating cost | $480.00 | $427.50 | $667.50 |
| First-year total | $780.00 | $1,831.71 | $2,671.71 |
| **Three-year total** | **$1,740.00** | **$2,686.71** | **$4,006.71** |

| Criterion | Community-Based | HWW | AI + IoT |
|---|---|---|---|
| Monitoring | Periodic | Continuous | Continuous |
| Detection | Manual | Rule-based | Machine learning |
| Predictive capability | None | None | Potential |
| Technical complexity | Low | Medium | High |
| Community accessibility | High | High | Depends on interface |
| Estimated lifecycle cost | Low | Medium | High |

## Recommendation

HWW is the preferred option for further pilot evaluation because it offers continuous monitoring and automated alerts without the additional data and computational requirements of AI. Community reporting complements its sensor network, while laboratory verification supports reliable investigation.

## Costing Assumptions and Limitations

- All alternatives cover three locations and three years, with constant annual operating costs.
- HWW costs are derived from the team's provisional BOM ($468.07 installed per station; $142.50 annual operation per station). Community and AI costs are illustrative assumptions, not supplier quotations.
- Community monitoring assumes monthly volunteer sampling; AI assumes shared cloud-based processing with the same sensing infrastructure as HWW.
- Additional laboratory testing, SMS charges, unpriced software development and unexpected equipment replacement are not separately budgeted. These should be checked before a funding decision.
- HWW's exact modem, carrier, antenna and battery capacity remain unconfirmed. Solar capacity and sensor durability require field validation. AI performance and community sampling reliability also require testing.

## Source and Internal Verification Notes

HWW specifications and provisional prices are taken from the teammate-provided Hanoi WaterWatch website summary. The original ten-station rollout is scaled to three stations at the user's request; the proposed year-two expansion is excluded from this comparison. Keep the detailed BOM and operating-cost breakdown in an appendix if the main website needs to remain concise.

Before publication, verify supplier models and pricing, modem/carrier/antenna compatibility, battery and solar sizing, possible duplicate charging equipment, continuous-immersion suitability, and unbudgeted software, SMS, laboratory and replacement expenses. The cleaning budget uses 24 visits per year as provided, which is slightly different from a strict fortnightly schedule. The original decision matrix must be updated and re-scored with AI + IoT as the third option; no new scores or test results have been assumed.
