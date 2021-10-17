import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next';
import Link from 'next/link';
import { cinemas } from '@utils/cinema-city';

type Props = InferGetStaticPropsType<typeof getStaticProps>;
type Params = { date: string };

const SelectCinema: NextPage<Props> = ({ date }) => {
  return (
    <>
      <h2 className="font-extrabold">Wybierz kino</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {cinemas.map((cinema) => (
          <div
            key={JSON.stringify(cinema)}
            className="bg-yellow-200 rounded p-2 shadow-md text-blue-400"
          >
            <Link href={`/${date}/${cinema.id}/`}>
              <a>{cinema.name}</a>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Params, Params> = async (
  context
) => {
  return {
    props: context.params!,
  };
};

export default SelectCinema;
