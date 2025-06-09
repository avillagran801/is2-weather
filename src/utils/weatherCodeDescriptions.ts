export function getWeatherCodeDescriptions(weatheCode: number, isDay: number = 0): string {

  let description = "";

  switch (weatheCode) {
  case 0: {
    if (isDay)
      description = "Soleado";
    else
      description = "Despejado";
    break;
  }
  case 1: {
    if (isDay)
      description = "Mayormente soleado";
    else
      description = "Mayormente despejado";
    break;
  }
  case 2: {
    description = "Parcialmente nublado";
    break;
  }
  case 3: {
    description = "Nublado";
    break;
  }
  case 45: {
    description = "Neblina";
    break;
  }
  case 48: {
    description = "Neblina con escarcha";
    break;
  }
  case 51: {
    description = "Llovizna ligera";
    break;
  }
  case 53: {
    description = "Llovizna";
    break;
  }
  case 55: {
    description = "Llovizna intensa";
    break;
  }
  case 56: {
    description = "Llovizna helada ligera";
    break;
  }
  case 57: {
    description = "Llovizna helada";
    break;
  }
  case 61: {
    description = "Lluvia ligera";
    break;
  }
  case 63: {
    description = "Lluvia";
    break;
  }
  case 65: {
    description = "Lluvia intensa";
    break;
  }
  case 66: {
    description = "Lluvia helada ligera";
    break;
  }
  case 67: {
    description = "Lluvia helada";
    break;
  }
  case 71: {
    description = "Nieve ligera";
    break;
  }
  case 73: {
    description = "Nieve";
    break;
  }
  case 75: {
    description = "Nieve intensa";
    break;
  }
  case 77: {
    description = "Granos de nieve";
    break;
  }
  case 80: {
    description = "Chubascos ligeros";
    break;
  }
  case 81: {
    description = "Chubascos";
    break;
  }
  case 82: {
    description = "Chubascos intensos";
    break;
  }
  case 85: {
    description = "Chubascos de nieve ligera";
    break;
  }
  case 86: {
    description = "Chubascos de nieve";
    break;
  }
  case 95: {
    description = "Tormenta eléctrica";
    break;
  }
  case 96: {
    description = "Tormenta eléctrica ligera con granizo";
    break;
  }
  case 99: {
    description = "Tormenta eléctrica con granizo";
    break;
  }
  }

  return description;
}

export function getWeatherCodeIcon(weatheCode: number, isDay: number) {

  let icon = "";

  switch (weatheCode) {
  case 0: {
    if (isDay)
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/clear-day.svg";
    else
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/clear-night.svg";
    break;
  }
  case 1: {
    if (isDay)
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy-1-day.svg";
    else
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy-1-night.svg";
    break;
  }
  case 2: {
    if (isDay)
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy-3-day.svg";
    else
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy-3-night.svg";
    break;
  }
  case 3: {
    icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/cloudy.svg";
    break;
  }
  case 45: {
    icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/fog.svg";
    break;
  }
  case 48: {
    icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/frost.svg";
    break;
  }
  case 51: {
    if (isDay)
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-1-day.svg";
    else
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-1-night.svg";
    break;
  }
  case 53: {
    if (isDay)
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-2-day.svg";
    else
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-2-night.svg";
    break;
  }
  case 55: {
    if (isDay)
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-3-day.svg";
    else
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-3-night.svg";
    break;
  }
  case 56: {
    icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-1.svg";
    break;
  }
  case 57: {
    icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-2.svg";
    break;
  }
  case 61: {
    icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-1.svg";
    break;
  }
  case 63: {
    icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-2.svg";
    break;
  }
  case 65: {
    icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-3.svg";
    break;
  }
  case 66: {
    icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-1.svg";
    break;
  }
  case 67: {
    icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-2.svg";
    break;
  }
  case 71: {
    icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/snowy-1.svg";
    break;
  }
  case 73: {
    icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/snowy-2.svg";
    break;
  }
  case 75: {
    icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/snowy-3.svg";
    break;
  }
  case 77: {
    icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/hail.svg";
    break;
  }
  case 80: {
    if (isDay)
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-1-day.svg";
    else
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-1-night.svg";
    break;
  }
  case 81: {
    if (isDay)
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-2-day.svg";
    else
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-2-night.svg";
    break;
  }
  case 82: {
    if (isDay)
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-3-day.svg";
    else
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/rainy-3-night.svg";
    break;
  }
  case 85: {
    if (isDay)
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/snowy-1-day.svg";
    else
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/snowy-1-night.svg";
    break;
  }
  case 86: {
    if (isDay)
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/snowy-2-day.svg";
    else
      icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/snowy-2-night.svg";
    break;
  }
  case 95: {
    icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/isolated-thunderstorms.svg";
    break;
  }
  case 96: {
    icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/scattered-thunderstorms.svg";
    break;
  }
  case 99: {
    icon = "https://raw.githubusercontent.com/Makin-Things/weather-icons/master/animated/thunderstorms.svg";
    break;
  }
  }



  return icon;
}
