export function getWeatherCodeDescriptions(weatheCode: number, isDay: number): string {

    let description = "";

    if (isDay) {
        switch (weatheCode) {
            case 0: {
                description = "Soleado";
                break;
            }
            case 1: {
                description = "Mayormente soleado";
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
    } else if (isDay === 0) {
        switch (weatheCode) {

            case 0: {
                description = "Despejado";
                break;
            }

            case 1: {
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
    }

    return description;
}

export function getWeatherCodeIcon(weatheCode: number, isDay: number) {
    let icon = "";
    if (isDay === 1) {
        switch (weatheCode) {
            case 0: {
                icon = "http://openweathermap.org/img/wn/01d@2x.png";
                break;
            }

            case 1: {
                icon = "http://openweathermap.org/img/wn/01d@2x.png";
                break;
            }

            case 2: {
                icon = "http://openweathermap.org/img/wn/02d@2x.png";
                break;
            }

            case 3: {
                icon = "http://openweathermap.org/img/wn/03d@2x.png";
                break;
            }

            case 45: {
                icon = "http://openweathermap.org/img/wn/50d@2x.png";
                break;
            }

            case 48: {
                icon = "http://openweathermap.org/img/wn/50d@2x.png";
                break;
            }

            case 51: {
                icon = "http://openweathermap.org/img/wn/09d@2x.png";
                break;
            }

            case 53: {
                icon = "http://openweathermap.org/img/wn/09d@2x.png";
                break;
            }

            case 55: {
                icon = "http://openweathermap.org/img/wn/09d@2x.png";
                break;
            }

            case 56: {
                icon = "http://openweathermap.org/img/wn/09d@2x.png";
                break;
            }

            case 57: {
                icon = "http://openweathermap.org/img/wn/09d@2x.png";
                break;
            }

            case 61: {
                icon = "http://openweathermap.org/img/wn/10d@2x.png";
                break;
            }

            case 63: {
                icon = "http://openweathermap.org/img/wn/10d@2x.png";
                break;
            }

            case 65: {
                icon = "http://openweathermap.org/img/wn/10d@2x.png";
                break;
            }

            case 66: {
                icon = "http://openweathermap.org/img/wn/10d@2x.png";
                break;
            }

            case 67: {
                icon = "http://openweathermap.org/img/wn/10d@2x.png";
                break;
            }

            case 71: {
                icon = "http://openweathermap.org/img/wn/13d@2x.png";
                break;
            }

            case 73: {
                icon = "http://openweathermap.org/img/wn/13d@2x.png";
                break;
            }

            case 75: {
                icon = "http://openweathermap.org/img/wn/13d@2x.png";
                break;
            }

            case 77: {
                icon = "http://openweathermap.org/img/wn/13d@2x.png";
                break;
            }

            case 80: {
                icon = "http://openweathermap.org/img/wn/09d@2x.png";
                break;
            }

            case 81: {
                icon = "http://openweathermap.org/img/wn/09d@2x.png";
                break;
            }

            case 82: {
                icon = "http://openweathermap.org/img/wn/09d@2x.png";
                break;
            }

            case 85: {
                icon = "http://openweathermap.org/img/wn/13d@2x.png";
                break;
            }

            case 86: {
                icon = "http://openweathermap.org/img/wn/13d@2x.png";
                break;
            }

            case 95: {
                icon = "http://openweathermap.org/img/wn/11d@2x.png";
                break;
            }

            case 96: {
                icon = "http://openweathermap.org/img/wn/11d@2x.png";
                break;
            }

            case 99: {
                icon = "http://openweathermap.org/img/wn/11d@2x.png";
                break;
            }
        }
    } else if (isDay === 0) {
        switch (weatheCode) {
            case 0: {
                icon = "http://openweathermap.org/img/wn/01n@2x.png";
                break;
            }
            case 1: {
                icon = "http://openweathermap.org/img/wn/01n@2x.png";
                break;
            }
            case 2: {
                icon = "http://openweathermap.org/img/wn/02n@2x.png";
                break;
            }
            case 3: {
                icon = "http://openweathermap.org/img/wn/03n@2x.png";
                break;
            }
            case 45: {
                icon = "http://openweathermap.org/img/wn/50n@2x.png";
                break;
            }
            case 48: {
                icon = "http://openweathermap.org/img/wn/50n@2x.png";
                break;
            }
            case 51: {
                icon = "http://openweathermap.org/img/wn/09n@2x.png";
                break;
            }
            case 53: {
                icon = "http://openweathermap.org/img/wn/09n@2x.png";
                break;
            }
            case 55: {
                icon = "http://openweathermap.org/img/wn/09n@2x.png";
                break;
            }
            case 56: {
                icon = "http://openweathermap.org/img/wn/09n@2x.png";
                break;
            }
            case 57: {
                icon = "http://openweathermap.org/img/wn/09n@2x.png";
                break;
            }
            case 61: {
                icon = "http://openweathermap.org/img/wn/10n@2x.png";
                break;
            }
            case 63: {
                icon = "http://openweathermap.org/img/wn/10n@2x.png";
                break;
            }
            case 65: {
                icon = "http://openweathermap.org/img/wn/10n@2x.png";
                break;
            }
            case 66: {
                icon = "http://openweathermap.org/img/wn/10n@2x.png";
                break;
            }
            case 67: {
                icon = "http://openweathermap.org/img/wn/10n@2x.png";
                break;
            }
            case 71: {
                icon = "http://openweathermap.org/img/wn/13n@2x.png";
                break;
            }
            case 73: {
                icon = "http://openweathermap.org/img/wn/13n@2x.png";
                break;
            }
            case 75: {
                icon = "http://openweathermap.org/img/wn/13n@2x.png";
                break;
            }
            case 77: {
                icon = "http://openweathermap.org/img/wn/13n@2x.png";
                break;
            }
            case 80: {
                icon = "http://openweathermap.org/img/wn/09n@2x.png";
                break;
            }
            case 81: {
                icon = "http://openweathermap.org/img/wn/09n@2x.png";
                break;
            }
            case 82: {
                icon = "http://openweathermap.org/img/wn/09n@2x.png";
                break;
            }
            case 85: {
                icon = "http://openweathermap.org/img/wn/13n@2x.png";
                break;
            }
            case 86: {
                icon = "http://openweathermap.org/img/wn/13n@2x.png";
                break;
            }
            case 95: {
                icon = "http://openweathermap.org/img/wn/11n@2x.png";
                break;
            }
            case 96: {
                icon = "http://openweathermap.org/img/wn/11n@2x.png";
                break;
            }
            case 99: {
                icon = "http://openweathermap.org/img/wn/11n@2x.png";
                break;
            }
        }
    }

    return icon;
}
