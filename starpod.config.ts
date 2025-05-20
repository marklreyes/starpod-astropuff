import { defineStarpodConfig } from 'src/utils/config';

export default defineStarpodConfig({
  blurb: 'Your FAVORITE Cannabis Comedy Show!',
  description:
	'Hey, I\'m Mark—those two are Darrell and Mike. We\'re three dads having real, often hilarious, cannabis-fueled chats about modern life. From vape pens that look like USBs to what our kids might think—we\'re figuring it out as we go. We don\'t have all the answers, but we\'ve got questions, snacks, and a mic. So if you\'re comfy with that, pull up a chair, kick back and welcome to The Puff Provisions Podcast!',  hosts: [
    {
      name: 'Mark',
      bio: 'Elevating minds and moods, one leafy convo at a time.',
      img: 'mark.jpg',
      instagram: 'https://www.instagram.com/puffprovisionsmark/',
      website: 'https://marklreyes.com'
    },
    {
      name: 'Darrell',
      bio: 'Out with the judgment, in with the good vibes.',
      img: 'darrell.jpg',
      instagram: 'https://www.instagram.com/puffprovisionsdarrell/',
    },
    {
      name: 'Mike',
      bio: 'Breaking stigma with laughs, facts, and just a little haze.',
      img: 'mike.jpg',
      instagram: 'https://www.instagram.com/puffprovisionsmike/',
    }
  ],
  platforms: {
    apple: 'https://podcasts.apple.com/us/podcast/the-puff-provisions-podcast/id1462384838',
    appleIdNumber: '1462384838',
    spotify: 'https://open.spotify.com/show/2pymRIfDuaDCYRA2Znu8eQ?si=fabc9f336ac340aa',
    youtube: 'https://www.youtube.com/@puffprovisions/'
  },
  rssFeed: 'https://feeds.libsyn.com/176270/rss'
});
