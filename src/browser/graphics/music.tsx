import usePlayer from '../hooks/usePlayer';
import useSongIcon from '../hooks/useSongIcon';
import './css/style.css';
import { render } from '../render';
import musicIcon from './img/music.svg';

const App = () => {
  const data = usePlayer();
  const icon = useSongIcon();

  return (
    <div className='song-container'>
      <img className={`song-icon ${icon ? "show" : ""}`} src={musicIcon} alt='Music' />
      <div className='song-title'>
					{data && !data.error && (
				<>
					<p><b>{data.album || '-'}</b> - <b>{data.title || '-'}</b></p>
				</>
			)}
      </div>
    </div>
  );
};

render(<App />);
