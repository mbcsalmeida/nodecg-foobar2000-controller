type NodeCGServerAPI = any;

type QueryResponse = {
    player?: {
        activeItem?: {
            columns?: string[];
        };
    };
};

module.exports = function (nodecg: NodeCGServerAPI) {
	nodecg.log.info('Beefweb extension starting.');

	const beefwebUrl = 'http://localhost:8880/api';
	const nowPlaying = nodecg.Replicant('nowPlaying', {
		defaultValue: {
			album: '' as string,
			title: '' as string,
			error: null as string | null,
			lastUpdated: 0,
		},
	});

	const songIconVisible = nodecg.Replicant('songIconVisible', {
		defaultValue: false,
	});
	

	async function fetchJson(url: string): Promise<unknown> {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(`HTTP ${res.status} ${res.statusText}`);
		}
		return res.json();
	}

	async function postToBeefweb(endpoint: string): Promise<void> {
		try {
			const res = await fetch(`${beefwebUrl}${endpoint}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			
			if (!res.ok) {
				throw new Error(`HTTP ${res.status} ${res.statusText}`);
			}
			
			nodecg.log.info(`Successfully sent POST to ${endpoint}`);
		} catch (err) {
			const message = `Failed to send POST to ${endpoint}: ${String(err)}`;
			nodecg.log.error(message);
			throw err;
		}
	}

	async function pollBeefweb() {
		try {
			const data = (await fetchJson(
				`${beefwebUrl}/query?player=true&trcolumns=%25album%25,%25title%25`,
			)) as QueryResponse;

			const columns = data?.player?.activeItem?.columns ?? [];
			const album = typeof columns[0] === 'string' ? columns[0] : '';
			const title = typeof columns[1] === 'string' ? columns[1] : '';

			nowPlaying.value = {
				album,
				title,
				error: null,
				lastUpdated: Date.now(),
			};
		} catch (err) {
			const message = `Failed to fetch Beefweb data: ${String(err)}`;
			nodecg.log.error(message);
			nowPlaying.value = {
				album: '',
				title: '',
				error: message,
				lastUpdated: Date.now(),
			};
		}
	}

	// Add message handlers for playback control
	nodecg.listenFor('playbackPlay', () => {
		postToBeefweb('/player/play-pause').catch(err => {
			nodecg.log.error('Play command failed:', err);
		});
	});

	nodecg.listenFor('playbackStart', () => {
		postToBeefweb('/player/play').catch(err => {
			nodecg.log.error('Play command failed:', err);
		});
	});

	nodecg.listenFor('playbackStop', () => {
		postToBeefweb('/player/stop').catch(err => {
			nodecg.log.error('Stop command failed:', err);
		});
	});

	nodecg.listenFor('playbackNext', () => {
		postToBeefweb('/player/next').catch(err => {
			nodecg.log.error('Next command failed:', err);
		});
	});

	nodecg.listenFor('playbackPrevious', () => {
		postToBeefweb('/player/previous').catch(err => {
			nodecg.log.error('Previous command failed:', err);
		});
	});

	nodecg.listenFor('toggleSongIcon', (data: { visible: boolean }) => {
		songIconVisible.value = data.visible;
		nodecg.log.info(`Setting song-icon visibility: ${data.visible}`);
	});

	// Initial fetch, then poll every 3 seconds.
	pollBeefweb();
	setInterval(pollBeefweb, 3000);
};