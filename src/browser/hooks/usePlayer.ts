import { useReplicant } from '@nodecg/react-hooks';
import { NowPlaying } from 'src/types/nowPlaying';

function usePlayer() {
  const [nowPlaying] = useReplicant<NowPlaying>('nowPlaying');

  return nowPlaying ?? '';
}

export default usePlayer;
