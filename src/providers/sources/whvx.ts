import { flags } from '@/entrypoint/utils/targets';
import { SourcererOutput, makeSourcerer } from '@/providers/base';
import { MovieScrapeContext, ShowScrapeContext } from '@/utils/context';

export const baseUrl = 'https://api.whvx.net';

async function comboScraper(ctx: ShowScrapeContext | MovieScrapeContext): Promise<SourcererOutput> {
  const query = {
    title: ctx.media.title,
    releaseYear: ctx.media.releaseYear,
    type: ctx.media.type,
    season: '',
    episode: '',
  };

  if (ctx.media.type === 'show') {
    query.season = ctx.media.season.number.toString();
    query.episode = ctx.media.episode.number.toString();
  }

  const providers = ['nova', null];

  const embeds = providers.map((provider: string | null) => {
    return {
      embedId: provider || '',
      url: JSON.stringify(query),
    };
  });

  return {
    embeds,
  };
}

export const whvxScraper = makeSourcerer({
  id: 'whvx',
  name: 'WHVX',
  rank: 145,
  flags: [flags.CORS_ALLOWED],
  disabled: true,
  scrapeMovie: comboScraper,
  scrapeShow: comboScraper,
});
