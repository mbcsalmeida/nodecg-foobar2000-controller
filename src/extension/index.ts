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

	const beefwebUrl = 'http://localhost:8880';
	const nowPlaying = nodecg.Replicant('nowPlaying', {
		defaultValue: {
			album: '' as string,
			title: '' as string,
			error: null as string | null,
			lastUpdated: 0,
		},
	});

	async function fetchJson(url: string): Promise<unknown> {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(`HTTP ${res.status} ${res.statusText}`);
		}
		return res.json();
	}

	async function pollBeefweb() {
		try {
			const data = (await fetchJson(
				`${beefwebUrl}/api/query?player=true&trcolumns=%25album%25,%25title%25`,
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

	// Initial fetch, then poll every 3 seconds.
	pollBeefweb();
	setInterval(pollBeefweb, 3000);
};
