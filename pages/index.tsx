import type { NextPage } from 'next';
import Head from 'next/head';
import {
  CinemaCityFilm,
  COMMERCIAL_BREAK,
  generateCombos,
  getMovies,
} from '@utils/cinema-city';
import type { AppContext } from 'next/app';
import { Combo } from '@components/Combo';
import 'react-json-pretty/themes/monikai.css';
import type { ComboEvent } from '@utils/cinema-city';
import { ChangeEventHandler, ReactEventHandler, useState } from 'react';

const MAXIMUM_BREAK = 60;
const WROCLAVIA = '1097';

const Home: NextPage<{ movies: Array<CinemaCityFilm>; combos: ComboEvent[] }> =
  (props) => {
    const { combos, movies } = props;

    const [moviesToShow, setMoviesToShow] = useState<string[]>([]);

    const renderCombos = () => {
      const combosToShow = combos
        .map((combo) =>
          combo.candidates.map((candidate) => {
            return { firstFilm: combo.event, secondFilm: candidate };
          })
        )
        .flat()
        .filter(
          (combo) =>
            moviesToShow.includes(combo.firstFilm.filmId) &&
            moviesToShow.includes(combo.secondFilm.filmId) &&
            combo.firstFilm.filmId != combo.secondFilm.filmId
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
        setMoviesToShow(moviesToShow.filter((item) => item !== value));
      } else {
        setMoviesToShow([...moviesToShow, value]);
      }
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
            <div className="flex flex-row gap-2">
              <label className="m-2">
                <div>
                  <a target="_blank" rel="noreferrer" href={movie.link}>
                    {movie.name}
                  </a>
                </div>
                <div>
                  <img src={movie.posterLink} className="w-10" />
                </div>
              </label>
            </div>
          </div>
        );
      });
    };
    return (
      <div className="container h-full w-full mx-auto p-10">
        <Head>
          <title>Unlimited Combo</title>
          <meta name="description" content="Unlimited Combo Generator" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="flex justify-center flex-col items-center gap-8">
          <h1 className="text-5xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-yellow-500 to-red-500">
            Unlimited Combo Generator
          </h1>

          <h2 className="font-extrabold">Możliwe combosy</h2>
          <div className="bg-yellow-200 p-3 rounded shadow-md text-center">
            <h3 className="font-extrabold">Note</h3>
            <ul>
              <li>
                <span className="font-extrabold">Maksymalny czas przerwy</span>{' '}
                {MAXIMUM_BREAK} minut
              </li>
              <li>
                <span className="font-extrabold">Przewidywany czas reklam</span>{' '}
                {COMMERCIAL_BREAK} minut
              </li>
              <li>
                <span className="font-extrabold">Kino</span> Wroclavia
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
            {renderCheckboxes()}
          </div>

          {renderCombos()}
        </div>
      </div>
    );
  };

export async function getServerSideProps(context: AppContext) {
  const movies = await getMovies(WROCLAVIA, new Date());
  const combos = generateCombos(movies);
  return {
    props: {
      combos: combos,
      movies: movies.body.films,
    },
  };
}

export default Home;
