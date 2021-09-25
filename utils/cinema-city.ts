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
  film: CinemaCityFilm;
};

export type ComboEvent = {
  event: ExtendedEvent;
  candidates: ExtendedEvent[];
};

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
): ComboEvent[] => {
  const {
    body: { films, events },
  } = data;

  const extendedEvents: ExtendedEvent[] = events.map((event) => {
    const startAt = parseISO(event.eventDateTime);
    const film = films.find((film) => film.id === event.filmId)!;
    const movieLength = film.length;
    const endAt = add(startAt, { minutes: movieLength });
    const endAtWithCommercial = add(endAt, { minutes: commercial_break });

    return { ...event, startAt, endAt, endAtWithCommercial, film };
  });

  return extendedEvents.map((event) => {
    const candidates = findCandidates(event, extendedEvents, maximumBreak);
    return { event: event, candidates: candidates };
  });
};

const findCandidates = (
  event: ExtendedEvent,
  candidates: ExtendedEvent[],
  maximumBreak: number
) => {
  const { endAtWithCommercial } = event;

  return candidates
    .filter(
      (candidate) => compareAsc(candidate.startAt, endAtWithCommercial) === 1
    )
    .filter(
      (candidate) =>
        differenceInMinutes(candidate.startAt, event.endAtWithCommercial) <=
        maximumBreak
    );
};
