import { useReplicant } from '@nodecg/react-hooks';

type NowPlaying = {
	album: string;
	title: string;
	error: string | null;
	lastUpdated: number;
};

function usePlayer() {
  const [nowPlaying] = useReplicant<NowPlaying>('nowPlaying');

  return nowPlaying ?? '';
}

export default usePlayer;
