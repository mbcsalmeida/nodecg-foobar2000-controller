import { render } from '../render';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import usePlayer from '../hooks/usePlayer';
import {useState} from "react";

export function Panel() {
	const data = usePlayer();
	const [isSongIconVisible, setIsSongIconVisible] = useState(true);
	const [isPause, setIsPaused] = useState(false);

	const handlePlaybackControl = (action: string) => {
		nodecg.sendMessage(`playback${action}`);
		if(action==="Play"){
			const newPauseState = !isPause;
			setIsPaused(newPauseState);
		}
		
	};

	const toggleSongIcon = () => {
		const newVisibility = !isSongIconVisible;
		setIsSongIconVisible(newVisibility);
		nodecg.sendMessage('toggleSongIcon', { visible: newVisibility });
	};

	return (
		<DashboardThemeProvider>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
				<h3 style={{ margin: 0 }}>Now Playing</h3>
				<button 
					onClick={toggleSongIcon}
					style={{
						padding: '0.5rem 1rem',
						backgroundColor: isSongIconVisible ? '#ff4444' : '#278178',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer'
					}}
				>
					{isSongIconVisible ? 'Hide Icon' : 'Show Icon'}
				</button>
			</div>
			
			{!data && <p>Waiting for data…</p>}
			
			{data && !data.error && (
				<>
					<p>Album: <b>{data.album || '-'}</b></p>
					<p>Title: <b>{data.title || '-'}</b></p>
					<p className="monospace">Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}</p>
				</>
			)}

			{/* Playback Control Buttons */}
			<div style={{ 
				marginTop: '1.5rem', 
				display: 'grid', 
				gridTemplateColumns: 'repeat(2, 1fr)', 
				gap: '0.5rem' 
			}}>
				<button 
					onClick={() => handlePlaybackControl('Play')}
					style={{
						padding: '0.75rem',
						backgroundColor: '#278178',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						fontWeight: 'bold'
					}}
				>
					{isPause ? "▶ Play" : "⏸️Pause"}
					
				</button>
				<button 
					onClick={() => handlePlaybackControl('Stop')}
					style={{
						padding: '0.75rem',
						backgroundColor: '#278178',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						fontWeight: 'bold'
					}}
				>
					⏹ Stop
				</button>
				<button 
					onClick={() => handlePlaybackControl('Next')}
					style={{
						padding: '0.75rem',
						backgroundColor: '#278178',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						fontWeight: 'bold'
					}}
				>
					⏭ Next
				</button>
				<button 
					onClick={() => handlePlaybackControl('Previous')}
					style={{
						padding: '0.75rem',
						backgroundColor: '#278178',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						fontWeight: 'bold'
					}}
				>
					⏮ Previous
				</button>
			</div>
		</DashboardThemeProvider>
	);
}

render(<Panel/>);