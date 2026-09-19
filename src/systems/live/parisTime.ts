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
    let minute = 0;
    let second = 0;
    for (const p of parts) {
      if (p.type === 'hour') hour = parseInt(p.value, 10);
      if (p.type === 'minute') minute = parseInt(p.value, 10);
      if (p.type === 'second') second = parseInt(p.value, 10);
    }
    return hour + minute / 60 + second / 3600;
  } catch {
    const utcHour = date.getUTCHours() + 2; // Approximate Paris CET/CEST fallback
    return (utcHour % 24) + date.getUTCMinutes() / 60;
  }
}

export function getParisLighting(hour: number): ParisLighting {
  // Continuous smooth interpolation across Paris hours
  let skyTopHex = '#16233A';
  let skyBottomHex = '#2C3A51';
  let fogHex = '#1A273F';
  let sunColorHex = '#E3B25C';
  let sunIntensity = 1.4;
  let ambientColorHex = '#8FB8D8';
  let ambientIntensity = 0.45;
  let fogDensity = 0.025;
  let isNight = false;

  // Elevation angle from hour
  // Sunrise ~ 06:30, Noon ~ 13:30, Sunset ~ 19:30
  const rad = ((hour - 6) / 18) * Math.PI;
  const sunX = Math.cos(rad) * 14;
  const sunY = Math.sin(rad) * 10;
  const sunZ = -10;

  if (hour >= 5 && hour < 8) {
    // Blue hour into first gold
    skyTopHex = '#16233A';
    skyBottomHex = '#5A6F8B';
    fogHex = '#25354F';
    sunColorHex = '#E3B25C';
    sunIntensity = 1.1;
    ambientColorHex = '#8FB8D8';
    ambientIntensity = 0.4;
  } else if (hour >= 8 && hour < 16) {
    // Flat daylight, rain silver
    skyTopHex = '#3D4D66';
    skyBottomHex = '#70839E';
    fogHex = '#4A5B74';
    sunColorHex = '#D1D9E0';
    sunIntensity = 1.2;
    ambientColorHex = '#98AEC3';
    ambientIntensity = 0.6;
  } else if (hour >= 16 && hour < 20) {
    // Signature Golden Hour: low warm key, cool sky fill, backlit rain
    skyTopHex = '#1B263B';
    skyBottomHex = '#B87B51';
    fogHex = '#2D2833';
    sunColorHex = '#E3B25C';
    sunIntensity = 2.2;
    ambientColorHex = '#8FB8D8';
    ambientIntensity = 0.45;
  } else if (hour >= 20 && hour < 23) {
    // Warm windows against navy, tower lit
    skyTopHex = '#0E1726';
    skyBottomHex = '#1A263D';
    fogHex = '#121C2B';
    sunColorHex = '#E3B25C';
    sunIntensity = 0.3;
    ambientColorHex = '#2C3A51';
    ambientIntensity = 0.25;
    isNight = true;
  } else {
    // 23 - 05 Deep night terrace
    skyTopHex = '#080D15';
    skyBottomHex = '#0E1726';
    fogHex = '#090E17';
    sunColorHex = '#8FB8D8'; // moonlight
    sunIntensity = 0.15;
    ambientColorHex = '#16233A';
    ambientIntensity = 0.18;
    isNight = true;
  }

  return {
    hourFraction: hour,
    skyTop: new THREE.Color(skyTopHex),
    skyBottom: new THREE.Color(skyBottomHex),
    fogColor: new THREE.Color(fogHex),
    fogDensity,
    sunPosition: [sunX, Math.max(0.5, sunY), sunZ],
    sunColor: new THREE.Color(sunColorHex),
    sunIntensity,
    ambientColor: new THREE.Color(ambientColorHex),
    ambientIntensity,
    isNight,
  };
}
