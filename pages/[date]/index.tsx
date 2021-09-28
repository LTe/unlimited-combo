import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next';
import Link from 'next/link';
import { cinamas } from '@utils/cinema-city';

const SelectCinema: NextPage = ({
  date,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <h2 className="font-extrabold">Wybierz kino</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {cinamas.map((cinema) => (
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

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: context.params || {},
  };
};

export default SelectCinema;
