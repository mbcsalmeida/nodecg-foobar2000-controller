import { useReplicant } from '@nodecg/react-hooks';


function useSongIcon() {
    const [songIconVisible] = useReplicant<boolean>('songIconVisible');
  
    return songIconVisible ?? '';
  }
  
  export default useSongIcon;
  