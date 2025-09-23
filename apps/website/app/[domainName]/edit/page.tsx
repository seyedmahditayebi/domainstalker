'use client';

import { getDomainInterval, updateDomain } from '@/lib/actions';
import formatInterval from '@/utils/formatInterval';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';

export default function Page() {
  const params = useParams();
  const [days, setDay] = useState(0);
  const [hours, setHour] = useState(0);
  const [domainInterval, setDomainInterval] = useState<string>('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notify = () => toast.success('Domain successfully updated.');

  useEffect(() => {
    intervalInit();
  });

  async function intervalInit() {
    const interval = await getDomainInterval(params.domainName as string);
    setDomainInterval(interval);
  }
  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      await updateDomain(formData);
      intervalInit();
      notify();
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else if (typeof error === 'string') {
        setError(error);
      }
    } finally {
      setIsPending(false);
    }
  }
  return (
    <main className="px-12 py-8 ">
      <h1 className="font-bold text-3xl mb-4">{params.domainName}</h1>
      <p>Currnet interval is {domainInterval}</p>
      <form onSubmit={handleUpdate}>
        <input name="name" value={params.domainName} type="hidden" />
        <div className="w-3/5">
          <p className="font-bold text-xl mt-5">Interval:</p>
          <div className="flex mt-2 **:first:mb-2">
            <div className="flex flex-col w-1/2">
              <label htmlFor="days" className="font-bold">
                Days:
              </label>
              <input
                required
                defaultValue={0}
                type="number"
                name="days"
                className="border rounded-sm  w-3/4  px-2 py-1 outline-0  focus:ring-2 focus:border-transparent focus:ring-blue-600"
                onChange={(e) => {
                  setDay(+e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="hours" className="font-bold">
                Hours:
              </label>
              <input
                required
                defaultValue={0}
                type="number"
                name="hours"
                className="rounded-sm  w-3/4 px-2 py-1 border outline-0  focus:ring-2 focus:border-transparent focus:ring-blue-600 "
                onChange={(e) => {
                  setHour(+e.target.value);
                }}
              />
            </div>
          </div>
          <p className="mt-10 text-primary-50/80">Selected Interval:</p>
          <p className="inline-block text-xl font-bold">
            {formatInterval(days, hours)}
          </p>
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className={`py-3 px-8 rounded-md bg-accent-700 font-bold ${isPending ? 'text-primary-300 bg-accent-800 hover:cursor-progress' : 'bg-accent-700 hover:cursor-pointer hover:bg-accent-600'} `}
            >
              Update
            </button>
          </div>
        </div>
      </form>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
        transition={Slide}
      />
    </main>
  );
}
