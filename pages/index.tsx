import type { NextPage } from 'next';
import Head from 'next/head';
import {
  COMMERCIAL_BREAK,
  generateCombos,
  getMovies,
} from '@utils/cinema-city';
import type { AppContext } from 'next/app';
import { Combo } from '@components/Combo';
import 'react-json-pretty/themes/monikai.css';
import type { ComboEvent } from '@utils/cinema-city';

const MAXIMUM_BREAK = 60;
const WROCLAVIA = '1097';

const Home: NextPage<{ movies: Array<object>; combos: ComboEvent[] }> = (
  props
) => {
  const { combos } = props;

  const renderCombos = () => {
    if (combos.length > 0) {
      return combos
        .map((combo) =>
          combo.candidates.map((candidate) => (
            <Combo
              key={JSON.stringify([combo.event, candidate])}
              firstFilm={combo.event}
              secondFilm={candidate}
            />
          ))
        )
        .flat();
    } else {
      return <div>Brak combo :(</div>;
    }
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

        {renderCombos()}
      </div>
    </div>
  );
};

export async function getServerSideProps(context: AppContext) {
  const combos = generateCombos(await getMovies(WROCLAVIA, new Date()));
  return {
    props: {
      combos: combos,
    },
  };
}

export default Home;
