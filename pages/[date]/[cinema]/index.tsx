import { GetServerSideProps, InferGetStaticPropsType } from 'next';
import {
  cinamas,
  CinemaCityResponse,
  COMMERCIAL_BREAK,
  findCombos,
  getMovies,
} from '@utils/cinema-city';
import { Combo } from '@components/Combo';
import 'react-json-pretty/themes/monikai.css';
import { ChangeEventHandler, useState } from 'react';
import { parseISO } from 'date-fns';
import { useRouter } from 'next/router';

const MAXIMUM_BREAK = 60;

type Props = { data: CinemaCityResponse; cinema: string };
type Params = { date: string; cinema: string };

const Home = (props: Props) => {
  const router = useRouter();
  const moviesFromParams =
    router.query.movies && JSON.parse(router.query.movies as string);
  const [moviesToShow, setMoviesToShow] = useState<string[]>(
    moviesFromParams || []
  );

  const breakFromParams =
    router.query.break && parseInt(router.query.break as string);
  const [maximumBreak, setMaximumBreak] = useState<number>(
    breakFromParams || MAXIMUM_BREAK
  );
  const commercialBreakFromParams =
    router.query.commercial && parseInt(router.query.commercial as string);
  const [commercialBreak, setCommercialBreak] = useState<number>(
    commercialBreakFromParams || COMMERCIAL_BREAK
  );

  const { data, cinema } = props;
  const combos = findCombos(data, maximumBreak, commercialBreak);
  const movies = data.body.films;
  const currentCinema = cinamas.find((element) => element.id === cinema)!;

  const renderCombos = () => {
    const combosToShow = combos
      .filter((combo) => combo.firstMovie.filmId != combo.secondMovie.filmId)
      .filter(
        (combo) =>
          moviesToShow.includes(combo.firstMovie.filmId) &&
          moviesToShow.includes(combo.secondMovie.filmId)
      );

    if (combosToShow.length > 0) {
      return combosToShow.map((combo) => (
        <Combo key={JSON.stringify(combo)} {...combo} />
      ));
    } else {
      return <div>Brak combo :(</div>;
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;

    if (moviesToShow.includes(value)) {
      const movies = moviesToShow.filter((item) => item !== value);
      setMovies(movies);
    } else {
      const movies = [...moviesToShow, value];
      setMovies(movies);
    }
  };

  const setMovies = (moviesToSet: string[]) => {
    setMoviesToShow(moviesToSet);
    router.query.movies = JSON.stringify(moviesToSet);
    router.push(router, undefined, { shallow: true });
  };

  const renderCheckboxes = () => {
    return movies.map((movie) => {
      return (
        <div className="flex items-baseline" key={JSON.stringify(movie)}>
          <div>
            <input
              type="checkbox"
              value={movie.id}
              onChange={handleChange}
              checked={moviesToShow.includes(movie.id)}
            />
          </div>
          <div className="flex flex-row">
            <label className="m-1">
              <div>
                <a target="_blank" rel="noreferrer" href={movie.link}>
                  {movie.name}
                </a>
              </div>
            </label>
          </div>
        </div>
      );
    });
  };
  return (
    <>
      <h2 className="font-extrabold">Wybierz przynajmniej 2 filmy</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
        {renderCheckboxes()}
      </div>
      <div className="bg-yellow-200 p-3 rounded shadow-md text-center">
        <ul>
          <li className="p-1">
            <span className="font-extrabold">Maksymalny czas przerwy</span>{' '}
            <input
              className="inline w-20 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="number"
              value={maximumBreak}
              onChange={({ target: { value } }) => {
                setMaximumBreak(parseInt(value));
                router.query.break = value;
                router.push(router, undefined, { shallow: true });
              }}
            />
            <span className="p-1">minut</span>
          </li>
          <li className="p-1">
            <span className="font-extrabold">Przewidywany czas reklam</span>{' '}
            <input
              className="inline w-20 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="number"
              value={commercialBreak}
              onChange={({ target: { value } }) => {
                setCommercialBreak(parseInt(value));
                router.query.commercial = value;
                router.push(router, undefined, { shallow: true });
              }}
            />
            <span className="p-1">minut</span>
          </li>
          <li className="p-1">
            <span className="font-extrabold">Kino</span> {currentCinema.name}
          </li>
        </ul>
      </div>

      {renderCombos()}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  const { date, cinema } = context.params!;

  const movies = await getMovies(cinema, parseISO(date));
  return {
    props: {
      data: movies,
      cinema: cinema,
    },
  };
};

export default Home;
