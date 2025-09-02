import { render } from '../render';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import usePlayer from '../hooks/usePlayer';

export function Panel() {
	const data = usePlayer();

	return (
		<DashboardThemeProvider>
			<h3>Now Playing</h3>
			{!data && <p>Waiting for data…</p>}
			
			{data && !data.error && (
				<>
					<p>Album: <b>{data.album || '-'}</b></p>
					<p>Title: <b>{data.title || '-'}</b></p>
					<p className="monospace">Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}</p>
				</>
			)}
		</DashboardThemeProvider>
	)
}

render(<Panel/>)