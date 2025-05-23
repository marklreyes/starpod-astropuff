import { useEffect, useState } from 'preact/hooks';
import type { Episode } from '../../lib/rss';
import { currentEpisode, isPlaying } from '../state';

type Props = {
  episode?: Episode;
};

const PlayIcon = (
  <svg
    class="h-4 w-4"
    fill="none"
    height="14"
    viewBox="0 0 9 14"
    width="13"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clip-rule="evenodd"
      d="m.367882.443158c0-.065142.07026-.106046.126866-.073861l11.541952 6.562623c.0573.03256.0573.11515 0 .14772l-11.541949 6.56266c-.056606.0321-.126865-.0088-.126865-.0739z"
      fill="currentColor"
      fill-rule="evenodd"
    />
  </svg>
);

const PauseIcon = (
  <svg
    class="h-4 w-4"
    fill="none"
    height="18"
    viewBox="0 0 14 18"
    width="14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="currentColor">
      <rect height="16.8" rx="1.07692" width="5.6" y=".799805" />
      <rect height="16.8" rx="1.07692" width="5.6" x="8.40039" y=".799805" />
    </g>
  </svg>
);

export default function PlayButton({ episode }: Props) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const isCurrentEpisode = episode && episode.id === currentEpisode.value?.id;
  const showPauseIcon =
    ((episode && isCurrentEpisode) || !episode) && isPlaying.value;

  return (
    <div class="flex h-16 w-16 items-center justify-center">
      <button
        class="bg-light-text-heading flex h-14 w-14 items-center justify-center rounded-full text-white transition-all duration-300 hover:h-16 hover:w-16 hover:bg-linear-to-r hover:from-[#9ae17b] hover:to-[#6bba62] dark:bg-white dark:text-[#24263D] dark:hover:from-[#9ae17b] dark:hover:to-[#6bba62]"
        type="button"
        onClick={() => {
          if (episode) {
            currentEpisode.value = {
              ...episode
            };

            isPlaying.value = isCurrentEpisode ? !isPlaying.value : true;
          } else {
            isPlaying.value = !isPlaying.value;
          }
        }}
      >
        {hasMounted && (
          <span key={showPauseIcon ? 'pause' : 'play'}>
            {showPauseIcon ? PauseIcon : PlayIcon}
          </span>
        )}
        <span class="sr-only">{showPauseIcon ? 'Pause' : 'Play'}</span>
      </button>
    </div>
  );
}
