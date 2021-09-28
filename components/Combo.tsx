import { ExtendedEvent } from '@utils/cinema-city';
import { format, differenceInMinutes } from 'date-fns';
import { LinkIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Movie = (props: { movie: ExtendedEvent }) => {
  const { movie } = props;
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col gap-2">
        <div className="text-center">Start</div>
        <div className="bg-green-300 p-3 rounded shadow-md text-center">
          {format(movie.startAt, 'HH:mm')}
        </div>
        <div className="text-center text-blue-600">Real Start™</div>
        <div className="bg-green-300 p-3 rounded shadow-md text-center">
          {format(movie.startAtWithCommercial, 'HH:mm')}
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <div className="mx-auto w-auto">
          <a href={movie.film.link}>
            <img alt="" title="" src={movie.film.posterLink} />
          </a>
        </div>
        <div className="text-center">{movie.film.length} min</div>
        {movie.attributeIds
          .filter((attribute) => attribute.match(/(\dd)|dubbed|subbed|vip/))
          .map((attribute) => (
            <div
              className="text-center rounded bg-blue-300 m-1 p-0.5 shadow-md"
              key={attribute}
            >
              {attribute}
            </div>
          ))}
      </div>
      <div className="flex flex-col">
        <div className="text-center">Koniec</div>
        <div className="bg-green-300 p-3 rounded shadow-md">
          <div>{format(movie.endAtWithCommercial, 'HH:mm')}</div>
        </div>
      </div>
    </div>
  );
};

export const Combo = (props: {
  firstMovie: ExtendedEvent;
  secondMovie: ExtendedEvent;
}) => {
  const { firstMovie, secondMovie } = props;
  const difference = differenceInMinutes(
    secondMovie.startAtWithCommercial,
    firstMovie.endAtWithCommercial
  );
  const id = [firstMovie.id, secondMovie.id].join('-');
  const router = useRouter();
  const { date, cinema, movie } = router.query;

  return (
    <div
      id={id}
      className="relative flex gap-5 items-center bg-gray-50 p-5 rounded shadow-xl flex-col md:flex-row w-auto justify-center"
    >
      <div className="top-5 right-5 absolute">
        <Link href={`/${date}/${cinema}/${id}`}>
          <a>
            <LinkIcon className="h-5 w-5 text-blue-500" />
          </a>
        </Link>
      </div>
      <Movie movie={firstMovie} />
      <div className="flex flex-col">
        <div className="text-center">Przerwa</div>
        <div className="bg-yellow-300 p-3 rounded shadow-md text-center">
          {difference} min
        </div>
      </div>
      <Movie movie={secondMovie} />
    </div>
  );
};
