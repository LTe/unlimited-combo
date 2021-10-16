import { FilmPair, generateCombos, getMovies } from '@utils/cinema-city';
import { parseISO } from 'date-fns';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Combo } from '@components/Combo';

type Props = FilmPair;
type Params = { date: string; cinema: string; movie: string };

const Movie: NextPage<Props> = (props) => (
  <div>
    <Combo {...props} />
  </div>
);

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const { date, cinema, movie } = context.params!;

  const movies = await getMovies(cinema, parseISO(date));
  const extendedEvents = generateCombos(movies);
  const [firstMovieId, secondMovieId] = movie.split('-');

  return {
    props: {
      firstMovie: extendedEvents.find((event) => event.id === firstMovieId)!,
      secondMovie: extendedEvents.find((event) => event.id === secondMovieId)!,
    },
  };
};

export default Movie;
