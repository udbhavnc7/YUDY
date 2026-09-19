import * as THREE from 'three';

export type ParisLighting = {
  hourFraction: number;
  skyTop: THREE.Color;
  skyBottom: THREE.Color;
  fogColor: THREE.Color;
  fogDensity: number;
  sunPosition: [number, number, number];
  sunColor: THREE.Color;
  sunIntensity: number;
  ambientColor: THREE.Color;
  ambientIntensity: number;
  isNight: boolean;
};

export function getParisHourFraction(date: Date = new Date()): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Paris',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    let hour = 18;
    let minute = 45;
    let second = 0;
    for (const p of parts) {
      if (p.type === 'hour') hour = parseInt(p.value, 10);
      if (p.type === 'minute') minute = parseInt(p.value, 10);
      if (p.type === 'second') second = parseInt(p.value, 10);
    }
    return hour + minute / 60 + second / 3600;
  } catch {
    const utcHour = date.getUTCHours() + 2;
    return (utcHour % 24) + date.getUTCMinutes() / 60;
  }
}

export function getParisLighting(hour: number, forceSunset: boolean = true): ParisLighting {
  // If forceSunset is active, render the signature golden-hour house light
  const effectiveHour = forceSunset ? 18.7 : hour;

  let skyTopHex = '#16233A';
  let skyBottomHex = '#D47A46';
  let fogHex = '#272535';
  let sunColorHex = '#E3B25C';
  let sunIntensity = 2.8;
  let ambientColorHex = '#8FB8D8';
  let ambientIntensity = 0.55;
  let fogDensity = 0.018;
  let isNight = false;

  // Sun position for golden hour sunset
  const sunX = -6.0;
  const sunY = 3.5;
  const sunZ = -18.0;

  if (effectiveHour >= 16 && effectiveHour < 20) {
    // Signature Golden Hour Sunset: low warm key backlighting rain over wet rooftops
    skyTopHex = '#152136';
    skyBottomHex = '#E88B4D'; // Glowing radiant horizon
    fogHex = '#2D2838';
    sunColorHex = '#FFB057';
    sunIntensity = 3.2;
    ambientColorHex = '#7CAAD0';
    ambientIntensity = 0.6;
    fogDensity = 0.015;
  } else if (effectiveHour >= 5 && effectiveHour < 8) {
    // Dawn blue hour
    skyTopHex = '#16233A';
    skyBottomHex = '#5A6F8B';
    fogHex = '#25354F';
    sunColorHex = '#E3B25C';
    sunIntensity = 1.2;
  } else if (effectiveHour >= 8 && effectiveHour < 16) {
    // Daylight
    skyTopHex = '#3D4D66';
    skyBottomHex = '#70839E';
    fogHex = '#4A5B74';
    sunColorHex = '#D1D9E0';
    sunIntensity = 1.5;
  } else {
    // Night
    skyTopHex = '#080D15';
    skyBottomHex = '#101827';
    fogHex = '#0B111A';
    sunColorHex = '#8FB8D8';
    sunIntensity = 0.3;
    isNight = true;
  }

  return {
    hourFraction: effectiveHour,
    skyTop: new THREE.Color(skyTopHex),
    skyBottom: new THREE.Color(skyBottomHex),
    fogColor: new THREE.Color(fogHex),
    fogDensity,
    sunPosition: [sunX, sunY, sunZ],
    sunColor: new THREE.Color(sunColorHex),
    sunIntensity,
    ambientColor: new THREE.Color(ambientColorHex),
    ambientIntensity,
    isNight,
  };
}
