# DEEPTRAIN - Training Management Application

## Overview
DEEPTRAIN is a high-performance training management application specifically designed for free-divers and swimmers, contextualized for the unique coastal environment of **Bou Zadjar** and **Oran**, Algeria. The application prioritizes privacy and security through a Zero-Knowledge Architecture, ensuring that all sensitive training data remains under the user's total control.

## Key Features
- **Zero-Knowledge Encryption**: All training logs, notes, and personal data are encrypted client-side using the Web Crypto API (AES-256-GCM). Encryption keys are derived via PBKDF2 with 100,000 iterations from a user-provided passcode.
- **Multi-User Partitioning**: Implements user-specific vaults in `localStorage` using SHA-256 hashing of passcodes, ensuring that data is isolated and invisible to other users on the same device.
- **Interactive Apnea Trainer**: Includes CO2 and O2 tables with real-time feedback, haptic alerts (Web Vibration API), and a custom SVG Lung Simulator.
- **Real-Time Marine Weather (v4.0)**: Integration with live meteorological data via **Open-Meteo APIs** (Forecast & Marine) providing:
  - Air Temperature & Humidity
  - Wind Speed
  - Wave Height (Sea State)
  - Visibility
  - Sea Surface Temperature
  - Dynamic Fish Activity Status (Ecological-based logic for the Mediterranean).
- **Regional Oran Focus**:
  - Dropdown selection for popular beaches: **Bou Zadjar, Madagh, Les Andalouses, Bousfer, Ain El Turk, Cap Falcon, and Kristel**.
  - Dynamic **Google Maps** integration for each selected spot.
  - Quick social media search links (Facebook, TikTok) for live sea condition reports.
- **Multi-Language**: Full support for English, French, and Arabic with optimized RTL/LTR logical property layouts.

## Technical Details
- **Frontend**: Vite + React.js
- **Styling**: Tailwind CSS v3 (using logical properties for RTL support)
- **Cryptography**: Web Crypto API (AES-256-GCM, PBKDF2, SHA-256)
- **APIs**:
  - [Open-Meteo Forecast](https://open-meteo.com/en/docs/forecast-api)
  - [Open-Meteo Marine](https://open-meteo.com/en/docs/marine-weather-api)
  - Google Maps (Embed API)

## Development
```bash
npm install
npm run dev
```

---
*Developed for the diving community of Bou Zadjar and Oran, Algeria.*
