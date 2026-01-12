import usePlayer from '../hooks/usePlayer';
import './css/style.css';
import { render } from '../render';

const App = () => {
  const data = usePlayer();

  return (
    <div className='song-container'>
      <div className='song-title'>
					{data && !data.error && (
				<>
					<p><b>{data.title || '-'}</b></p>
				</>
			)}
      </div>
    </div>
  );
};

render(<App />);
