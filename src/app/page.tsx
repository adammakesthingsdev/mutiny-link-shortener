import { api, HydrateClient } from "@/trpc/server";
import type { Metadata } from "next";

export default async function Home() {
  void api.link.getAll.prefetch();

  return (
    <HydrateClient>
      <main>
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-800 font-sans text-xl">
          <h1>Adam{"'"}s awesome link shortener</h1>
          <div className="my-10 flex h-2/3 w-2/3 rounded-md bg-gray-600 shadow-lg">
            <div className="text-md flex h-full w-2/3 flex-col items-center p-5">
              <h4 className="mb-2">All links</h4>
              <div className="h-full w-full overflow-y-auto rounded-sm bg-gray-700 p-2 shadow-lg">
                <table className="w-full table-fixed divide-y divide-dashed">
                  <thead>
                    <tr className="font-semibold">
                      <td className="w-1/3">ID</td>
                      <td className="w-2/3">Path</td>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashed">
                    {(await api.link.getAll()).map((link) => (
                      <tr key={link.id}>
                        <td>{link.id}</td>
                        <td className="truncate">
                          <a href={link.href}>{link.href}</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

export const metadata: Metadata = {
  title: "Mutiny Link Shortener",
};
