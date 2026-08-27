export async function isolateSourceFetch<T>(fetcher: () => Promise<T[]>) {
  try { return { candidates: await fetcher(), error: null as string | null } }
  catch (error) { return { candidates: [] as T[], error: error instanceof Error ? error.message : "Noma'lum manba xatosi" } }
}
