import { api } from '../lib/api.js';
import { useFetch } from '../lib/hooks.js';
import { VideoCard, Spinner } from '../components/Cards.jsx';

export default function Videos() {
  const { data, loading } = useFetch(api.videos, []);
  if (loading) return <Spinner />;
  return (
    <div className="container-x pt-6 pb-8">
      <h1 className="sec-title mb-4 md:mb-6">Tractor Videos</h1>
      <p className="text-sm text-gray-main">Reviews, comparisons and reels from the KhetiHub channel</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {data?.map((v) => <VideoCard key={v.id} video={v} />)}
      </div>
    </div>
  );
}
