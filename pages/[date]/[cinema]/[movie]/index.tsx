import { NextPageContext } from 'next/dist/shared/lib/utils';
import { FilmPair, generateCombos, getMovies } from '@utils/cinema-city';
import { parseISO } from 'date-fns';
import { NextPage } from 'next';
import { Combo } from '@components/Combo';

const Movie: NextPage<FilmPair> = (props) => (
  <div>
    <Combo {...props} />
  </div>
);

export async function getServerSideProps(context: NextPageContext) {
  const { date, cinema, movie } = context.query as {
    date: string;
    cinema: string;
    movie: string;
  };

  const movies = await getMovies(cinema, parseISO(date));
  const extendedEvents = generateCombos(movies);
  const [firstMovieId, secondMovieId] = movie.split('-');

  return {
    props: {
      firstMovie: extendedEvents.find((event) => event.id === firstMovieId),
      secondMovie: extendedEvents.find((event) => event.id === secondMovieId),
    },
  };
}

export default Movie;
