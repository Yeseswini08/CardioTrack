export interface RawSpan {
  text: string;
  fontName: string;
  fontSize: number;
  isBold: boolean;
  pageNumber: number;
  isTable?: boolean;
}

export interface RawTable {
  pageNumber: number;
  sectionNumber: string;
  headers: string[];
  rows: string[][];
  bbox: [number, number, number, number]; // [x0, top, x1, bottom]
}

export interface DocumentRawData {
  version: number;
  title: string;
  totalPages: number;
  spans: RawSpan[];
  tables: RawTable[];
}

export const V1_RAW_DATA: DocumentRawData = {
  version: 1,
  title: 'CardioTrack CT-200 Home Blood Pressure Monitor — Technical & User Manual',
  totalPages: 6,
  tables: [
    {
      pageNumber: 2,
      sectionNumber: '2.1',
      headers: ['Parameter', 'Value'],
      rows: [
        ['Measurement method', 'Oscillometric'],
        ['Pressure range', '0–299 mmHg'],
        ['Pulse range', '40–199 bpm'],
        ['Accuracy (pressure)', '±3 mmHg'],
        ['Accuracy (pulse)', '±5%'],
        ['Power source', '4x AA batteries or 6V DC adapter'],
        ['Display', 'Backlit LCD'],
      ],
      bbox: [50, 120, 500, 320],
    },
    {
      pageNumber: 4,
      sectionNumber: '4.2',
      headers: ['Code', 'Meaning', 'Device Behavior'],
      rows: [
        ['E1', 'Cuff not connected or leak detected', 'Aborts measurement, displays E1'],
        ['E2', 'Motion artifact detected during measurement', 'Aborts measurement, displays E2, prompts retry'],
        ['E3', 'Overpressure condition', 'Auto-deflates within 2 seconds, displays E3'],
        ['E4', 'Low battery during measurement', 'Aborts measurement, displays E4'],
        ['E5', 'Internal sensor fault', 'Device disables measurement function, displays E5 until serviced'],
      ],
      bbox: [50, 240, 520, 520],
    },
  ],
  spans: [
    // Page 1
    { text: 'CardioTrack CT-200 Home Blood', fontName: 'NimbusSans-Bold', fontSize: 22.0, isBold: true, pageNumber: 1 },
    { text: 'Pressure Monitor — Technical &', fontName: 'NimbusSans-Bold', fontSize: 22.0, isBold: true, pageNumber: 1 },
    { text: 'User Manual', fontName: 'NimbusSans-Bold', fontSize: 22.0, isBold: true, pageNumber: 1 },
    { text: '1. Device Overview', fontName: 'NimbusSans-Bold', fontSize: 16.0, isBold: true, pageNumber: 1 },
    { text: 'The CardioTrack CT\u2011200 is an oscillometric, upper-arm blood pressure monitor intended for home use by adult users. It measures systolic pressure, diastolic pressure, and pulse rate, and stores up to 200 readings across two user profiles.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 1 },
    { text: '1.1 Intended Use', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 1 },
    { text: 'The CT-200 is intended to non-invasively measure blood pressure and pulse rate in adults with an arm circumference of 22–42 cm. It is not intended for use on neonates, infants, or pregnant users, and is not a diagnostic device — readings should be interpreted by a qualified clinician.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 1 },
    { text: '1.2 Indications and Contraindications', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 1 },
    { text: 'The device should not be used on the arm ipsilateral to a mastectomy, on limbs with an active intravenous line, or on users with severe arrhythmia without clinician guidance, since oscillometric measurement can be unreliable in these cases.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 1 },
    { text: '2. Physical and Electrical Specifications', fontName: 'NimbusSans-Bold', fontSize: 16.0, isBold: true, pageNumber: 1 },

    // Page 2
    { text: '2.1 General Specifications', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 2 },
    // Skipped level 2.1.1! Direct jump to 2.1.1.1
    { text: '2.1.1.1 Battery Life Under Typical Use', fontName: 'NimbusSans-Bold', fontSize: 11.0, isBold: true, pageNumber: 2 },
    { text: 'Under typical use (three measurements per day), four AA alkaline batteries provide approximately 300 measurement cycles before requiring replacement. The device displays a low\u2011battery icon once remaining capacity falls below 15%.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 2 },
    { text: '2.2 Cuff Specifications', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 2 },
    { text: 'The standard cuff supplied with the CT\u2011200 fits arm circumferences of 22–32 cm. A separate large cuff (part number CT200\u2011LC) is available for 32–42 cm and must be ordered separately; using the standard cuff outside its rated range will produce inaccurate readings.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 2 },
    { text: '3. Device Operation', fontName: 'NimbusSans-Bold', fontSize: 16.0, isBold: true, pageNumber: 2 },
    { text: '3.1 Powering On and Profile Selection', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 2 },
    // Cross-page split start
    { text: 'Press and hold the power button for one second to power on the device.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 2 },

    // Page 3
    // Cross-page split continuation
    { text: 'Use the profile button to select User 1 or User 2 before beginning a measurement; readings are stored against whichever profile is active at the time of measurement.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },
    // Inconsistent font size: 11.0pt Bold instead of 12.9pt Bold!
    { text: '3.2 Cuff Inflation Sequence', fontName: 'NimbusSans-Bold', fontSize: 11.0, isBold: true, pageNumber: 3 },
    { text: "On starting a measurement, the device inflates the cuff to an initial target of 180 mmHg. If the user's pulse is not detected by 180 mmHg, the device inflates in 40 mmHg increments up to a maximum of 299 mmHg before aborting with an error. Deflation occurs in controlled steps of approximately 3 mmHg to capture oscillometric pulse data.", fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },
    // Out-of-order section numbering: 3.4 appears before 3.3 physically!
    { text: '3.4 Auto Shutoff', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 3 },
    { text: 'To conserve battery, the CT\u2011200 automatically powers off after 60 seconds of inactivity on the home screen, and after 3 minutes of inactivity if a measurement screen is left open without starting a reading.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },
    { text: '3.3 Result Display and Classification', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 3 },
    { text: 'After a completed measurement, the device displays systolic pressure, diastolic pressure, and pulse rate simultaneously, along with a classification indicator (see 2.1, 4.3 for related specifications and alarm thresholds) based on the most recent joint clinical guidance available at time of manufacture.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },
    // Numbered list items (isBold == false) -> Must NOT be treated as top-level headings!
    { text: '1. Normal: systolic < 120 and diastolic < 80', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },
    { text: '2. Elevated: systolic 120–129 and diastolic < 80', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },
    { text: '3. Hypertension Stage 1: systolic 130–139 or diastolic 80–89', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },
    { text: '4. Hypertension Stage 2: systolic ≥ 140 or diastolic ≥ 90', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },
    { text: '5. Hypertensive Crisis: systolic > 180 or diastolic > 120 — device recommends seeking immediate medical attention', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },
    { text: '4. Alarms and Safety Behavior', fontName: 'NimbusSans-Bold', fontSize: 16.0, isBold: true, pageNumber: 3 },

    // Page 4
    { text: '4.1 Overpressure Protection', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 4 },
    { text: 'If cuff pressure exceeds 299 mmHg at any point, or exceeds 300 mmHg for longer than 3 seconds due to sensor fault, the device immediately triggers an emergency deflation valve, halting inflation and venting the cuff within 2 seconds, independent of the main firmware control loop.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 4 },
    // Duplicate title: 'Error Codes' under parent 4
    { text: '4.2 Error Codes', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 4 },
    { text: '4.3 Alarm Thresholds', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 4 },
    { text: 'The device does not sound an audible alarm for elevated readings by default; audible alarms are limited to the E1–E5 error conditions above and are user\u2011configurable in the settings menu, except for E3 (overpressure), which cannot be silenced for safety reasons.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 4 },
    { text: '5. Data Management', fontName: 'NimbusSans-Bold', fontSize: 16.0, isBold: true, pageNumber: 4 },

    // Page 5
    { text: '5.1 Local Storage', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 5 },
    { text: 'The CT\u2011200 stores up to 100 readings per user profile in non\u2011volatile memory. When storage is full, the oldest reading for that profile is overwritten automatically; there is no user\u2011facing warning before this occurs.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 5 },
    { text: '5.2 Bluetooth Sync', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 5 },
    { text: 'The device can pair with the CardioTrack companion app via Bluetooth Low Energy. Readings sync automatically when the app is open and the device is within range; there is no manual "sync now" trigger in firmware version 1.x.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 5 },
    { text: '6. Maintenance and Cleaning', fontName: 'NimbusSans-Bold', fontSize: 16.0, isBold: true, pageNumber: 5 },
    { text: '6.1 Cleaning Instructions', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 5 },
    // Split across page 5 and 6
    { text: 'Wipe the device body and cuff exterior with a soft, dry cloth or one lightly dampened with water. Do not submerge the device or cuff, and do not', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 5 },

    // Page 6
    // Continuation of 6.1
    { text: 'use alcohol, solvents, or abrasive cleaners on the display.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 6 },
    { text: '6.2 Calibration', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 6 },
    { text: 'Anthropic recommends professional recalibration every 2 years or after any drop or significant impact. The device does not perform self\u2011calibration; there is no field calibration procedure available to end users.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 6 },
    { text: '7. Troubleshooting', fontName: 'NimbusSans-Bold', fontSize: 16.0, isBold: true, pageNumber: 6 },
    // Duplicate title: 'Error Codes' under parent 7!
    { text: '7.1 Error Codes', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 6 },
    { text: 'If a code from Section 4.2 appears and persists after following the on\u2011screen retry prompt twice, users should discontinue use and contact CardioTrack support rather than attempting further self\u2011diagnosis, particularly for E5, which indicates an internal sensor fault.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 6 },
    { text: '7.2 Inconsistent Readings', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 6 },
    { text: 'Inconsistent readings between measurements are most commonly caused by cuff mispositioning, talking or moving during measurement, or measuring within 30 minutes of exercise, caffeine, or smoking; the manual recommends resting quietly for 5 minutes before remeasuring.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 6 },
    { text: '8. Regulatory Information', fontName: 'NimbusSans-Bold', fontSize: 16.0, isBold: true, pageNumber: 6 },
    { text: '8.1 Classification', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 6 },
    { text: 'The CT\u2011200 is classified as a Class II medical device under applicable regulations for non\u2011invasive blood pressure monitors and has been validated against relevant clinical accuracy standards for oscillometric devices.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 6 },
  ],
};

export const V2_RAW_DATA: DocumentRawData = {
  version: 2,
  title: 'CardioTrack CT-200 Home Blood Pressure Monitor — Technical & User Manual',
  totalPages: 7,
  tables: [
    {
      pageNumber: 2,
      sectionNumber: '2.1',
      headers: ['Parameter', 'Value'],
      rows: [
        ['Measurement method', 'Oscillometric'],
        ['Pressure range', '0–299 mmHg'],
        ['Pulse range', '40–199 bpm'],
        ['Accuracy (pressure)', '±3 mmHg'],
        ['Accuracy (pulse)', '±5%'],
        ['Power source', '4x AA batteries or 6V DC adapter'],
        ['Display', 'Backlit LCD'],
      ],
      bbox: [50, 120, 500, 320],
    },
    {
      pageNumber: 4,
      sectionNumber: '4.2',
      headers: ['Code', 'Meaning', 'Device Behavior'],
      rows: [
        ['E1', 'Cuff not connected or leak detected', 'Aborts measurement, displays E1'],
        ['E2', 'Motion artifact detected during measurement', 'Aborts measurement, displays E2, prompts retry'],
        // Modified from 2 seconds to 1.5 seconds!
        ['E3', 'Overpressure condition', 'Auto-deflates within 1.5 seconds, displays E3'],
        ['E4', 'Low battery during measurement', 'Aborts measurement, displays E4'],
        ['E5', 'Internal sensor fault', 'Device disables measurement function, displays E5 until serviced'],
        // Added row E6!
        ['E6', 'Bluetooth sync failure', 'Displays E6 on next sync attempt; does not affect measurement'],
      ],
      bbox: [50, 240, 520, 560],
    },
  ],
  spans: [
    // Page 1
    { text: 'CardioTrack CT-200 Home Blood', fontName: 'NimbusSans-Bold', fontSize: 22.0, isBold: true, pageNumber: 1 },
    { text: 'Pressure Monitor — Technical &', fontName: 'NimbusSans-Bold', fontSize: 22.0, isBold: true, pageNumber: 1 },
    { text: 'User Manual', fontName: 'NimbusSans-Bold', fontSize: 22.0, isBold: true, pageNumber: 1 },
    { text: '1. Device Overview', fontName: 'NimbusSans-Bold', fontSize: 16.0, isBold: true, pageNumber: 1 },
    { text: 'The CardioTrack CT\u2011200 is an oscillometric, upper-arm blood pressure monitor intended for home use by adult users. It measures systolic pressure, diastolic pressure, and pulse rate, and stores up to 200 readings across two user profiles.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 1 },
    { text: '1.1 Intended Use', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 1 },
    { text: 'The CT-200 is intended to non-invasively measure blood pressure and pulse rate in adults with an arm circumference of 22–42 cm. It is not intended for use on neonates, infants, or pregnant users, and is not a diagnostic device — readings should be interpreted by a qualified clinician.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 1 },
    { text: '1.2 Indications and Contraindications', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 1 },
    { text: 'The device should not be used on the arm ipsilateral to a mastectomy, on limbs with an active intravenous line, or on users with severe arrhythmia without clinician guidance, since oscillometric measurement can be unreliable in these cases.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 1 },
    { text: '2. Physical and Electrical Specifications', fontName: 'NimbusSans-Bold', fontSize: 16.0, isBold: true, pageNumber: 1 },

    // Page 2
    { text: '2.1 General Specifications', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 2 },
    // Critical threshold change: 300 -> 250 cycles, 15% -> 10%
    { text: '2.1.1.1 Battery Life Under Typical Use', fontName: 'NimbusSans-Bold', fontSize: 11.0, isBold: true, pageNumber: 2 },
    { text: 'Under typical use (three measurements per day), four AA alkaline batteries provide approximately 250 measurement cycles before requiring replacement — revised downward from earlier estimates after extended field testing. The device displays a low\u2011battery icon once remaining capacity falls below 10%.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 2 },
    { text: '2.2 Cuff Specifications', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 2 },
    { text: 'The standard cuff supplied with the CT\u2011200 fits arm circumferences of 22–32 cm. A separate large cuff (part number CT200\u2011LC) is available for 32–42 cm and must be ordered separately; using the standard cuff outside its rated range will produce inaccurate readings.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 2 },
    { text: '3. Device Operation', fontName: 'NimbusSans-Bold', fontSize: 16.0, isBold: true, pageNumber: 2 },
    { text: '3.1 Powering On and Profile Selection', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 2 },

    // Page 3
    { text: 'Press and hold the power button for one second to power on the device.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },
    { text: 'Use the profile button to select User 1 or User 2 before beginning a measurement; readings are stored against whichever profile is active at the time of measurement.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },
    // Critical threshold change: 40 mmHg -> 30 mmHg increments!
    { text: '3.2 Cuff Inflation Sequence', fontName: 'NimbusSans-Bold', fontSize: 11.0, isBold: true, pageNumber: 3 },
    { text: "On starting a measurement, the device inflates the cuff to an initial target of 180 mmHg. If the user's pulse is not detected by 180 mmHg, the device inflates in 30 mmHg increments up to a maximum of 299 mmHg before aborting with an error. Deflation occurs in controlled steps of approximately 3 mmHg to capture oscillometric pulse data. Increment size was reduced from the original 40 mmHg to improve pulse-detection reliability in field testing.", fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },
    { text: '3.4 Auto Shutoff', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 3 },
    { text: 'To conserve battery, the CT\u2011200 automatically powers off after 60 seconds of inactivity on the home screen, and after 3 minutes of inactivity if a measurement screen is left open without starting a reading.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },
    { text: '3.3 Result Display and Classification', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 3 },
    { text: 'After a completed measurement, the device displays systolic pressure, diastolic pressure, and pulse rate simultaneously, along with a classification indicator (see 2.1, 4.3 for related specifications and alarm thresholds) based on the most recent joint clinical guidance available at time of manufacture.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },
    { text: '1. Normal: systolic < 120 and diastolic < 80', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },
    { text: '2. Elevated: systolic 120–129 and diastolic < 80', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },
    { text: '3. Hypertension Stage 1: systolic 130–139 or diastolic 80–89', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },
    { text: '4. Hypertension Stage 2: systolic ≥ 140 or diastolic ≥ 90', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },
    { text: '5. Hypertensive Crisis: systolic > 180 or diastolic > 120 — device recommends seeking immediate medical attention', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 3 },

    // Page 4
    { text: '4. Alarms and Safety Behavior', fontName: 'NimbusSans-Bold', fontSize: 16.0, isBold: true, pageNumber: 4 },
    // Notice: Section 4.1 STILL says "within 2 seconds", while 4.2 E3 says "1.5 seconds"!
    { text: '4.1 Overpressure Protection', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 4 },
    { text: 'If cuff pressure exceeds 299 mmHg at any point, or exceeds 300 mmHg for longer than 3 seconds due to sensor fault, the device immediately triggers an emergency deflation valve, halting inflation and venting the cuff within 2 seconds, independent of the main firmware control loop.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 4 },
    { text: '4.2 Error Codes', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 4 },
    // Critical change: audible alarms limited to E1-E6 (was E1-E5)
    { text: '4.3 Alarm Thresholds', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 4 },
    { text: 'The device does not sound an audible alarm for elevated readings by default; audible alarms are limited to the E1–E6 error conditions above and are user\u2011configurable in the settings menu, except for E3', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 4 },

    // Page 5
    { text: '(overpressure), which cannot be silenced for safety reasons.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 5 },
    { text: '5. Data Management', fontName: 'NimbusSans-Bold', fontSize: 16.0, isBold: true, pageNumber: 5 },
    { text: '5.1 Local Storage', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 5 },
    { text: 'The CT\u2011200 stores up to 100 readings per user profile in non\u2011volatile memory. When storage is full, the oldest reading for that profile is overwritten automatically; there is no user\u2011facing warning before this occurs.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 5 },
    { text: '5.2 Bluetooth Sync', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 5 },
    { text: 'The device can pair with the CardioTrack companion app via Bluetooth Low Energy. Readings sync automatically when the app is open and the device is within range; there is no manual "sync now" trigger in firmware version 1.x.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 5 },
    // NEW SECTION 5.3 ADDED IN V2!
    { text: '5.3 Data Export', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 5 },
    { text: 'Starting with firmware 1.4, the companion app supports exporting stored readings as a CSV file containing timestamp, profile, systolic, diastolic, pulse, and classification columns. Export requires the device to have completed at least one successful Bluetooth sync in the current session.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 5 },
    { text: '6. Maintenance and Cleaning', fontName: 'NimbusSans-Bold', fontSize: 16.0, isBold: true, pageNumber: 5 },
    { text: '6.1 Cleaning Instructions', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 5 },
    { text: 'Wipe the device body and cuff exterior with a soft, dry cloth or one lightly dampened with water. Do not submerge the device or cuff, and do not', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 5 },

    // Page 6
    { text: 'use alcohol, solvents, or abrasive cleaners on the display.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 6 },
    { text: '6.2 Calibration', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 6 },
    { text: 'Anthropic recommends professional recalibration every 2 years or after any drop or significant impact. The device does not perform self\u2011calibration; there is no field calibration procedure available to end users.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 6 },
    { text: '7. Troubleshooting', fontName: 'NimbusSans-Bold', fontSize: 16.0, isBold: true, pageNumber: 6 },
    // Unchanged text, but Section 4.2 referenced here changed -> Transitive Stale!
    { text: '7.1 Error Codes', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 6 },
    { text: 'If a code from Section 4.2 appears and persists after following the on\u2011screen retry prompt twice, users should discontinue use and contact CardioTrack support rather than attempting further self\u2011diagnosis, particularly for E5, which indicates an internal sensor fault.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 6 },
    { text: '7.2 Inconsistent Readings', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 6 },
    { text: 'Inconsistent readings between measurements are most commonly caused by cuff mispositioning, talking or moving during measurement, or measuring within 30 minutes of exercise, caffeine, or smoking; the manual recommends resting quietly for 5 minutes before remeasuring.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 6 },
    { text: '8. Regulatory Information', fontName: 'NimbusSans-Bold', fontSize: 16.0, isBold: true, pageNumber: 6 },
    { text: '8.1 Classification', fontName: 'NimbusSans-Bold', fontSize: 12.9, isBold: true, pageNumber: 6 },
    { text: 'The CT\u2011200 is classified as a Class II medical device under applicable regulations for non\u2011invasive blood pressure monitors and has been', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 6 },

    // Page 7
    { text: 'validated against relevant clinical accuracy standards for oscillometric devices.', fontName: 'NimbusSans-Regular', fontSize: 11.0, isBold: false, pageNumber: 7 },
  ],
};
