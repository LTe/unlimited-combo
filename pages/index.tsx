import type { NextPage } from 'next';
import { AppContext } from 'next/app';
import { add, eachDayOfInterval, formatISO } from 'date-fns';
import Link from 'next/link';

const SelectDate: NextPage<{}> = (props) => {
  const today = new Date();
  const range = eachDayOfInterval({
    start: new Date(),
    end: add(today, { days: 5 }),
  });

  return (
    <>
      <h2 className="font-extrabold">Wybierz date</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {range.map((date) => {
          const iso = formatISO(date, { representation: 'date' });
          return (
            <div
              key={JSON.stringify(date)}
              className="text-blue-400 rounded bg-yellow-200 p-2 m-2 shadow-md"
            >
              <Link href={`/${iso}`}>
                <a>{iso}</a>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};

export async function getServerSideProps(context: AppContext) {
  return {
    props: {},
  };
}

export default SelectDate;
