import { ExtendedEvent, TIME_ZONE } from '@utils/cinema-city';
import { differenceInMinutes } from 'date-fns';
import { format } from 'date-fns-tz';
import { LinkIcon } from '@heroicons/react/solid';
import { ShareIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, FunctionComponent } from 'react';

const Movie: FunctionComponent<{ movie: ExtendedEvent }> = ({ movie }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col gap-2">
        <div className="text-center">Start</div>
        <div className="bg-green-300 p-3 rounded shadow-md text-center">
          {format(movie.startAt, 'HH:mm', { timeZone: TIME_ZONE })}
        </div>
        <div className="text-center text-blue-600">Real Start™</div>
        <div className="bg-green-300 p-3 rounded shadow-md text-center">
          {format(movie.startAtWithCommercial, 'HH:mm', {
            timeZone: TIME_ZONE,
          })}
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
          <div>
            {format(movie.endAtWithCommercial, 'HH:mm', {
              timeZone: TIME_ZONE,
            })}
          </div>
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
  const link = `/${date}/${cinema}/${id}`;

  const [isShareAvailable, setIsShareAvailable] = useState<boolean>(false);

  useEffect(() => {
    // @ts-ignore
    window.navigator.share && setIsShareAvailable(true);
  }, []);

  const shareMovie = () => {
    navigator
      .share({
        title: `${firstMovie.film.name} - ${secondMovie.film.name}`,
        url: link,
      })
      .catch(() => {});
  };

  return (
    <div
      id={id}
      className="relative flex gap-5 items-center bg-gray-50 p-5 rounded shadow-xl flex-col md:flex-row w-auto justify-center"
    >
      <div className="top-5 right-5 absolute">
        {isShareAvailable ? (
          <div>
            <ShareIcon onClick={shareMovie} className="h-5 w-5 text-blue-500" />
          </div>
        ) : (
          <Link href={link}>
            <a>
              <LinkIcon className="h-5 w-5 text-blue-500" />
            </a>
          </Link>
        )}
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
