import { flags } from '@/entrypoint/utils/targets';
import { makeEmbed } from '@/providers/base';
import { NotFoundError } from '@/utils/errors';

export const doodScraper = makeEmbed({
  id: 'dood',
  name: 'dood',
  rank: 173,
  async scrape(ctx) {
    let url = ctx.url;
    if (ctx.url.includes('primewire')) {
      const request = await ctx.proxiedFetcher.full(ctx.url);
      url = request.finalUrl;
    }

    const vidScrapeURL = `https://dood.wafflehacker.io/scrape?url=${encodeURIComponent(url)}`;
    const vidScrape = await ctx.fetcher(vidScrapeURL);

    if (vidScrape.videoUrl?.length === 0) {
      throw new NotFoundError('No Video Found');
    }

    const downloadURL = vidScrape.videoUrl;

    return {
      stream: [
        {
          id: 'primary',
          type: 'file',
          flags: [flags.CORS_ALLOWED],
          captions: [],
          qualities: {
            unknown: {
              type: 'mp4',
              url: downloadURL,
            },
          },
        },
      ],
    };
  },
});
