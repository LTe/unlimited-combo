import fetch from 'node-fetch';
import {
  format,
  parseISO,
  add,
  compareAsc,
  differenceInMinutes,
} from 'date-fns';

export const COMMERCIAL_BREAK = 30;
export const MAXIMUM_BREAK = 60;

export type CinemaCityFilm = {
  id: string;
  name: string;
  length: number;
  posterLink: string;
  videoLink: string;
  link: string;
  weight: number;
  releaseYear: string;
  attributeIds: string[];
};

export type CinemaCityEvent = {
  id: string;
  filmId: string;
  cinemaId: string;
  businessDay: string;
  eventDateTime: string;
  attributeIds: string[];
  bookingLink: string;
  soldOut: boolean;
  auditorium: string;
  auditoriumTinyName: string;
};

export type CinemaCityResponse = {
  body: {
    films: CinemaCityFilm[];
    events: CinemaCityEvent[];
  };
};

export type ExtendedEvent = CinemaCityEvent & {
  startAt: Date;
  endAt: Date;
  endAtWithCommercial: Date;
  startAtWithCommercial: Date;
  film: CinemaCityFilm;
};

export type ComboEvent = {
  event: ExtendedEvent;
  candidates: ExtendedEvent[];
};

export type FilmPair = {
  firstMovie: ExtendedEvent;
  secondMovie: ExtendedEvent;
};

export const cinamas = [
  { id: '1088', name: 'Bielsko-Biała' },
  { id: '1086', name: 'Bydgoszcz' },
  { id: '1092', name: 'Bytom' },
  { id: '1089', name: 'Częstochowa - Galeria Jurajska' },
  { id: '1075', name: 'Częstochowa - Wolność' },
  { id: '1085', name: 'Gliwice' },
  { id: '1065', name: 'Katowice - Punkt 44' },
  { id: '1079', name: 'Katowice - Silesia' },
  { id: '1090', name: 'Kraków - Bonarka' },
  { id: '1076', name: 'Kraków - Galeria Kazimierz' },
  { id: '1064', name: 'Kraków - Zakopianka' },
  { id: '1094', name: 'Lublin - Felicity' },
  { id: '1084', name: 'Lublin - Plaza' },
  { id: '1080', name: 'Łódź Manufaktura' },
  { id: '1081', name: 'Poznań - Kinepolis' },
  { id: '1078', name: 'Poznań - Plaza' },
  { id: '1062', name: 'Ruda Śląska' },
  { id: '1082', name: 'Rybnik' },
  { id: '1083', name: 'Sosnowiec' },
  { id: '1095', name: 'Starogard Gdański' },
  { id: '1077', name: 'Toruń - Czerwona Droga' },
  { id: '1093', name: 'Toruń - Plaza' },
  { id: '1091', name: 'Wałbrzych' },
  { id: '1074', name: 'Warszawa -  Arkadia' },
  { id: '1061', name: 'Warszawa - Bemowo' },
  { id: '1096', name: 'Warszawa - Białołęka Galeria Północna' },
  { id: '1070', name: 'Warszawa - Galeria Mokotów' },
  { id: '1069', name: 'Warszawa - Janki' },
  { id: '1068', name: 'Warszawa - Promenada' },
  { id: '1060', name: 'Warszawa - Sadyba' },
  { id: '1067', name: 'Wrocław - Korona' },
  { id: '1097', name: 'Wrocław - Wroclavia' },
  { id: '1087', name: 'Zielona Góra' },
];

export const apiURL = (cinemaId: string, date: Date) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  return `https://www.cinema-city.pl/pl/data-api-service/v1/quickbook/10103/film-events/in-cinema/${cinemaId}/at-date/${formattedDate}`;
};

export const getMovies = async (
  cinemaId: string,
  date: Date
): Promise<CinemaCityResponse> => {
  const response = await fetch(apiURL(cinemaId, date));
  return (await response.json()) as CinemaCityResponse;
};

export const generateCombos = (
  data: CinemaCityResponse,
  maximumBreak: number = MAXIMUM_BREAK,
  commercial_break: number = COMMERCIAL_BREAK
): FilmPair[] => {
  const {
    body: { films, events },
  } = data;

  const extendedEvents: ExtendedEvent[] = events.map((event) => {
    const startAt = parseISO(event.eventDateTime);
    const film = films.find((film) => film.id === event.filmId)!;
    const movieLength = film.length;
    const endAt = add(startAt, { minutes: movieLength });
    const endAtWithCommercial = add(endAt, { minutes: commercial_break });
    const startAtWithCommercial = add(startAt, { minutes: commercial_break });

    return {
      ...event,
      startAt,
      endAt,
      endAtWithCommercial,
      startAtWithCommercial,
      film,
    };
  });

  return extendedEvents
    .map((event) => {
      const candidates = findCandidates(event, extendedEvents, maximumBreak);
      return candidates.map((candidate) => ({
        firstMovie: event,
        secondMovie: candidate,
      }));
    })
    .flat();
};

const findCandidates = (
  event: ExtendedEvent,
  candidates: ExtendedEvent[],
  maximumBreak: number
) => {
  const { endAtWithCommercial } = event;

  return candidates
    .filter(
      (candidate) =>
        compareAsc(candidate.startAtWithCommercial, endAtWithCommercial) === 1
    )
    .filter(
      (candidate) =>
        differenceInMinutes(
          candidate.startAtWithCommercial,
          event.endAtWithCommercial
        ) <= maximumBreak
    );
};
