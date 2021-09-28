import type { NextPage } from 'next';
import { AppContext } from 'next/app';
import { add, eachDayOfInterval, formatISO } from 'date-fns';
import Link from 'next/link';
import { NextPageContext } from 'next/dist/shared/lib/utils';
import { cinamas } from '@utils/cinema-city';

const SelectCinema: NextPage<{ date: string }> = (props) => {
  const { date } = props;

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

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: context.query,
  };
}

export default SelectCinema;
