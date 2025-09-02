import usePlayer from '../hooks/usePlayer';
import './css/style.css';
import { render } from '../render';

const App = () => {
  const data = usePlayer();

  return (
    <div className='test-class'>
					{data && !data.error && (
				<>
					<p><b>{data.album || '-'}</b> - <b>{data.title || '-'}</b></p>
				</>
			)}
    </div>
  );
};

render(<App />);
